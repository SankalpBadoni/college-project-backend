import Employer from "../models/Employer.js";
import bcrypt from "bcryptjs";

import JobPosting from "../models/JobPosting.js";
import JobApplication from "../models/JobApplication.js";
import Notification from "../models/Notification.js";
import Program from "../models/Program.js";
import Student from "../models/Student.js";
import Enrollment from "../models/Enrollment.js";

const allowedEmployerFields = [
  "companyName",
  "divisionDept",
  "approvingAuthority",
  "contactPerson",
  "tier",
  "website",
  "logoUrl",
  "industry",
  "about",
  "isApproved",
  "approvedAt",
  "password"
];

const pick = (source, keys) =>
  keys.reduce((accumulator, key) => {
    if (source[key] !== undefined) {
      accumulator[key] = source[key];
    }
    return accumulator;
  }, {});

const normalizeIds = (value) => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
};

const buildStudentFilter = async (posting, filters = {}) => {
  const query = {};
  const yearFilter = filters.year || posting?.restriction?.minYear || posting?.restriction?.maxYear ? {} : null;

  if (yearFilter) {
    const minYear = Number(filters.minYear || posting?.restriction?.minYear || 1);
    const maxYear = Number(filters.maxYear || posting?.restriction?.maxYear || 6);
    query["profile.yearOfCourse"] = { $gte: minYear, $lte: maxYear };
  }

  if (filters.streams?.length || posting?.restriction?.streams?.length) {
    query["profile.stream"] = { $in: filters.streams?.length ? filters.streams : posting.restriction.streams };
  }

  if (filters.genders?.length || posting?.restriction?.genders?.length) {
    query["profile.gender"] = { $in: filters.genders?.length ? filters.genders : posting.restriction.genders };
  }

  if (filters.studentIds?.length) {
    query._id = { $in: filters.studentIds };
  }

  const completedProgramIds = normalizeIds(filters.completedProgramIds);
  const requireCompletion =
    filters.completedOnly === true ||
    filters.completedOnly === "true" ||
    filters.requireCompleted === true ||
    filters.requireCompleted === "true" ||
    completedProgramIds.length > 0 ||
    ((posting?.tagType === "hot_job_linked" || posting?.tagType === "exclusive") && normalizeIds(posting?.linkedPrograms).length > 0);

  if (requireCompletion) {
    const targetProgramIds = completedProgramIds.length ? completedProgramIds : normalizeIds(posting?.linkedPrograms);
    const enrolledStudentIds = await Enrollment.distinct("student", {
      program: { $in: targetProgramIds },
      status: "completed"
    });

    query._id = query._id
      ? { $in: enrolledStudentIds.filter((studentId) => query._id.$in.some((id) => String(id) === String(studentId))) }
      : { $in: enrolledStudentIds };
  }

  return query;
};

export const getEmployerDashboard = async (employerId) => {
  const employer = await Employer.findById(employerId);
  const postings = await JobPosting.find({ employer: employerId }).populate("linkedPrograms preferredCourses shortlistedStudents.student");
  const liveProjects = await Program.find({ employer: employerId, type: "live_project" }).sort({ createdAt: -1 });

  const postingCountByType = postings.reduce(
    (accumulator, posting) => {
      accumulator[posting.postingType || "job"] = (accumulator[posting.postingType || "job"] || 0) + 1;
      return accumulator;
    },
    { job: 0, internship: 0, live_project: 0 }
  );

  const shortlistedStudents = postings.reduce((count, posting) => count + (posting.shortlistedStudents?.length || 0), 0);
  const totalApplicants = await JobApplication.countDocuments({ jobPosting: { $in: postings.map(p => p._id) } });

  const recentPostings = await Promise.all(
    postings.slice(0, 10).map(async (posting) => {
      const count = await JobApplication.countDocuments({ jobPosting: posting._id });
      const obj = posting.toObject();
      obj.applicantsCount = count;
      return obj;
    })
  );

  return {
    employer: employer
      ? {
          id: employer._id,
          companyName: employer.companyName,
          divisionDept: employer.divisionDept,
          tier: employer.tier,
          isApproved: employer.isApproved,
          industry: employer.industry,
          website: employer.website
        }
      : null,
    stats: {
      jobs: postingCountByType.job,
      internships: postingCountByType.internship,
      liveProjects: liveProjects.length,
      shortlistedStudents,
      totalApplicants,
      urgentPostings: postings.filter((posting) => posting.isUrgent).length,
      premiumEmployer: employer?.tier === "premium"
    },
    recentPostings,
    liveProjects
  };
};

export const updateEmployerProfile = async (employerId, updates) => {
  if (updates.contactPerson?.email) {
    const email = updates.contactPerson.email.toLowerCase().trim();
    updates.contactPerson.email = email;
    const exists = await Employer.findOne({ "contactPerson.email": email, _id: { $ne: employerId } });
    if (exists) {
      const error = new Error("Email is already taken by another employer");
      error.statusCode = 400;
      throw error;
    }
  }

  const payload = pick(updates, allowedEmployerFields);

  if (payload.password) {
    if (payload.password.length < 6) {
      const error = new Error("Password must be at least 6 characters long");
      error.statusCode = 400;
      throw error;
    }
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  return Employer.findByIdAndUpdate(employerId, payload, { new: true, runValidators: true }).select("-password");
};

export const createJobPosting = async (employerId, payload) => {
  const employer = await Employer.findById(employerId);
  const companyName = payload.companyName || employer.companyName;
  const safePayload = {
    employer: employerId,
    companyName,
    title: payload.title,
    description: payload.description,
    location: payload.location,
    workMode: payload.workMode || "onsite",
    postingType: payload.postingType || "job",
    employmentType: payload.employmentType || payload.postingType || "full-time",
    salaryRange: payload.salaryRange || {},
    postedAt: payload.postedAt || new Date(),
    sourceType: payload.sourceType || "website",
    sourceLink: payload.sourceLink,
    isUrgent: Boolean(payload.isUrgent),
    requiredCount: payload.requiredCount || 1,
    aboutCompany: payload.aboutCompany || {},
    jobDescription: payload.jobDescription || {},
    keyResponsibilities: payload.keyResponsibilities || [],
    requiredQualifications: payload.requiredQualifications || {},
    preferredQualifications: payload.preferredQualifications || {},
    compensationBenefits: payload.compensationBenefits || {},
    applicationProcess: payload.applicationProcess || {},
    screeningQuestions: payload.screeningQuestions || [],
    additionalInformation: payload.additionalInformation || {},
    restriction: payload.restriction || {},
    requiredCompetencies: payload.requiredCompetencies || [],
    requiredCompetencyLinks: payload.requiredCompetencyLinks || [],
    preferredCompetencyLinks: payload.preferredCompetencyLinks || [],
    industry: payload.industry,
    function: payload.function,
    deadline: payload.deadline,
    applicationDeadline: payload.applicationDeadline || payload.deadline,
    linkedPrograms: payload.linkedPrograms || [],
    preferredCourses: payload.preferredCourses || [],
    shortlistingNotes: payload.shortlistingNotes,
    tagType: payload.tagType || "normal",
    visualElements: payload.visualElements || {},
    jdUrl: payload.jdUrl,
    isActive: payload.isActive ?? true,
    status: "open"
  };

  return JobPosting.create(safePayload);
};

export const listEmployerPostings = async (employerId) => {
  const postings = await JobPosting.find({ employer: employerId })
    .populate("linkedPrograms preferredCourses shortlistedStudents.student")
    .sort({ createdAt: -1 });

  return Promise.all(
    postings.map(async (posting) => {
      const count = await JobApplication.countDocuments({ jobPosting: posting._id });
      const obj = posting.toObject();
      obj.applicantsCount = count;
      return obj;
    })
  );
};

export const getEmployerPosting = async (employerId, postingId) => {
  const posting = await JobPosting.findOne({ _id: postingId, employer: employerId }).populate(
    "linkedPrograms preferredCourses shortlistedStudents.student"
  );
  if (!posting) return null;
  const count = await JobApplication.countDocuments({ jobPosting: posting._id });
  const obj = posting.toObject();
  obj.applicantsCount = count;
  return obj;
};

export const updateEmployerPosting = async (employerId, postingId, updates) => {
  const payload = pick(updates, [
    "title",
    "companyName",
    "description",
    "location",
    "workMode",
    "postingType",
    "employmentType",
    "salaryRange",
    "postedAt",
    "sourceType",
    "sourceLink",
    "isUrgent",
    "requiredCount",
    "aboutCompany",
    "jobDescription",
    "keyResponsibilities",
    "requiredQualifications",
    "preferredQualifications",
    "compensationBenefits",
    "applicationProcess",
    "screeningQuestions",
    "additionalInformation",
    "restriction",
    "requiredCompetencies",
    "requiredCompetencyLinks",
    "preferredCompetencyLinks",
    "industry",
    "function",
    "deadline",
    "applicationDeadline",
    "linkedPrograms",
    "preferredCourses",
    "shortlistingNotes",
    "tagType",
    "visualElements",
    "jdUrl"
  ]);

  return JobPosting.findOneAndUpdate({ _id: postingId, employer: employerId }, payload, {
    new: true,
    runValidators: true
  }).populate("linkedPrograms preferredCourses shortlistedStudents.student");
};

export const closeEmployerPosting = async (employerId, postingId) =>
  JobPosting.findOneAndUpdate(
    { _id: postingId, employer: employerId },
    { status: "closed", isActive: false, closedAt: new Date() },
    { new: true, runValidators: true }
  ).populate("linkedPrograms preferredCourses shortlistedStudents.student");

export const deleteEmployerPosting = async (employerId, postingId) =>
  JobPosting.findOneAndDelete({ _id: postingId, employer: employerId });

export const createEmployerLiveProject = async (employerId, payload) => {
  const program = await Program.create({
    employer: employerId,
    title: payload.title,
    description: payload.description,
    type: "live_project",
    status: payload.status || "published",
    coverImageUrl: payload.coverImageUrl,
    competencies: payload.competencies || [],
    preferredJobTags: payload.preferredJobTags || [],
    employerPreferred: Boolean(payload.employerPreferred),
    hotJobLinked: Boolean(payload.hotJobLinked),
    exclusiveJobLinked: Boolean(payload.exclusiveJobLinked),
    linkedJobs: payload.linkedJobs || [],
    minYearEligible: payload.minYearEligible || 1,
    maxYearEligible: payload.maxYearEligible || 6,
    startDate: payload.startDate,
    applicationDeadline: payload.applicationDeadline,
    durationHours: payload.durationHours || 0,
    maxStudents: payload.maxStudents || 100,
    creditCost: payload.creditCost || 0,
    priceInr: payload.priceInr || 0,
    isActive: payload.isActive ?? true
  });

  return program.populate("employer");
};

export const updateEmployerCourseTags = async (programId, updates) => {
  const payload = pick(updates, ["employerPreferred", "hotJobLinked", "exclusiveJobLinked", "preferredJobTags", "linkedJobs", "status", "isActive"]);
  return Program.findByIdAndUpdate(programId, payload, { new: true, runValidators: true }).populate("faculty employer");
};

export const findEmployerCandidates = async (employerId, postingId, filters = {}) => {
  const posting = await getEmployerPosting(employerId, postingId);

  if (!posting) {
    return null;
  }

  const studentFilter = await buildStudentFilter(posting, filters);
  const students = await Student.find(studentFilter)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(filters.limit || 100);

  const applications = await JobApplication.find({ jobPosting: posting._id });
  const appMap = new Map(applications.map((app) => [String(app.student), app]));
  const shortlistedMap = new Map((posting.shortlistedStudents || []).map((item) => [String(item.student), item]));

  const studentIdSet = new Set(students.map((s) => String(s._id)));
  const missingApplicantIds = applications
    .map((app) => String(app.student))
    .filter((id) => !studentIdSet.has(id));

  let allStudents = [...students];
  if (missingApplicantIds.length > 0) {
    const extraStudents = await Student.find({ _id: { $in: missingApplicantIds } }).select("-password");
    allStudents = [...extraStudents, ...allStudents];
  }

  const formatStatus = (rawStatus, hasApp) => {
    if (rawStatus === "shortlisted") return "Shortlisted";
    if (rawStatus === "under_review") return "Under Review";
    if (rawStatus === "interview_scheduled") return "Interview Scheduled";
    if (rawStatus === "offered") return "Offered";
    if (rawStatus === "hired" || rawStatus === "placed" || rawStatus === "accepted") return "Hired";
    if (rawStatus === "rejected") return "Rejected";
    if (rawStatus === "applied" || hasApp) return "Applied";
    return "Candidate";
  };

  const enrichedStudents = allStudents.map((student) => {
    const studentObj = student.toObject ? student.toObject() : student;
    const app = appMap.get(String(student._id));
    const shortlistInfo = shortlistedMap.get(String(student._id));
    const rawStatus = shortlistInfo?.status || app?.status || (app ? "applied" : "candidate");

    return {
      ...studentObj,
      id: String(student._id),
      name: `${studentObj.firstName || ""} ${studentObj.lastName || ""}`.trim() || studentObj.fullName || "Student",
      email: studentObj.email || "",
      phone: studentObj.phone || "",
      applicationStatus: rawStatus,
      status: formatStatus(rawStatus, Boolean(app)),
      resumeUrl: app?.coverLetter || "",
      coverLetter: app?.coverLetter || "",
      appliedAt: app?.createdAt || null,
      note: shortlistInfo?.note || "",
      shortlistingNote: shortlistInfo?.note || "",
      interviewDetails: shortlistInfo?.interviewDetails || null,
      shortlistedAt: shortlistInfo?.shortlistedAt || null
    };
  });

  return {
    posting,
    count: enrichedStudents.length,
    students: enrichedStudents
  };
};

export const getJobStructure = async (employerId, postingId) => {
  const posting = await getEmployerPosting(employerId, postingId);

  if (!posting) {
    return null;
  }

  return {
    posting,
    overview: {
      title: posting.title,
      companyName: posting.companyName,
      location: posting.location,
      workMode: posting.workMode,
      employmentType: posting.employmentType,
      salaryRange: posting.salaryRange,
      postedAt: posting.postedAt,
      deadline: posting.deadline,
      applicationDeadline: posting.applicationDeadline
    },
    aboutCompany: posting.aboutCompany || {},
    jobDescription: posting.jobDescription || {},
    keyResponsibilities: posting.keyResponsibilities || [],
    requiredQualifications: posting.requiredQualifications || {},
    preferredQualifications: posting.preferredQualifications || {},
    compensationBenefits: posting.compensationBenefits || {},
    applicationProcess: posting.applicationProcess || {},
    screeningQuestions: posting.screeningQuestions || [],
    additionalInformation: posting.additionalInformation || {},
    restriction: posting.restriction || {},
    competencies: {
      requiredCompetencies: posting.requiredCompetencies || [],
      requiredCompetencyLinks: posting.requiredCompetencyLinks || [],
      preferredCompetencyLinks: posting.preferredCompetencyLinks || []
    },
    visualElements: posting.visualElements || {}
  };
};

export const shortlistEmployerCandidates = async (employerId, postingId, studentIds = [], note, status = "shortlisted", interviewDetails = {}) => {
  const posting = await JobPosting.findOne({ _id: postingId, employer: employerId });

  if (!posting) {
    return null;
  }

  const targetStudentIds = normalizeIds(studentIds);
  const shortlistedMap = new Map(
    (posting.shortlistedStudents || []).map((item) => [String(item.student), item])
  );

  targetStudentIds.forEach((studentId) => {
    const rawExisting = shortlistedMap.get(String(studentId)) || {};
    const existing = rawExisting.toObject ? rawExisting.toObject() : rawExisting;
    shortlistedMap.set(String(studentId), {
      ...existing,
      student: studentId,
      note: note !== undefined ? note : (existing.note || posting.shortlistingNotes || "Shortlisted from employer dashboard"),
      status: status || existing.status || "shortlisted",
      interviewDetails: Object.keys(interviewDetails || {}).length ? interviewDetails : (existing.interviewDetails || {}),
      shortlistedAt: existing.shortlistedAt || new Date()
    });
  });

  posting.shortlistedStudents = Array.from(shortlistedMap.values());
  await posting.save();

  const applications = targetStudentIds.length
    ? await JobApplication.find({ jobPosting: posting._id, student: { $in: targetStudentIds } })
    : [];

  const applicationMap = new Map(applications.map((application) => [String(application.student), application]));

  await Promise.all(
    targetStudentIds.map(async (studentId) => {
      const application = applicationMap.get(String(studentId));

      if (application) {
        if (status === "rejected") {
          application.status = "rejected";
        } else {
          application.status = "shortlisted";
        }
        await application.save();
      }

      await Notification.findOneAndUpdate(
        {
          student: studentId,
          type: "job_shortlist",
          jobPosting: posting._id
        },
        {
          recipientType: "student",
          student: studentId,
          jobPosting: posting._id,
          jobApplication: application?._id,
          senderEmployer: employerId,
          type: "job_shortlist",
          title: `Shortlisted for ${posting.title || "job posting"}`,
          message: `You have been shortlisted for ${posting.title || "a job posting"} at ${posting.companyName || "the employer"}.`,
          read: false,
          response: undefined,
          responseAt: undefined,
          metadata: {
            jobPostingId: String(posting._id),
            jobApplicationId: application?._id ? String(application._id) : undefined,
            employerId: String(employerId),
            note: note !== undefined ? note : (posting.shortlistingNotes || "Shortlisted from employer dashboard"),
            status: status || "shortlisted",
            interviewDetails: interviewDetails || {}
          }
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          runValidators: true
        }
      );
    })
  );

  return posting.populate("linkedPrograms preferredCourses shortlistedStudents.student");
};

export const updateCandidateStatus = async (employerId, postingId, studentId, status, note, interviewDetails = {}) => {
  const posting = await JobPosting.findOne({ _id: postingId, employer: employerId });
  if (!posting) return null;

  const shortlistedMap = new Map(
    (posting.shortlistedStudents || []).map((item) => [String(item.student), item])
  );
  const rawExisting = shortlistedMap.get(String(studentId)) || {};
  const existing = rawExisting.toObject ? rawExisting.toObject() : rawExisting;

  shortlistedMap.set(String(studentId), {
    ...existing,
    student: studentId,
    note: note !== undefined ? note : existing.note,
    status: status || existing.status || "shortlisted",
    interviewDetails: Object.keys(interviewDetails || {}).length ? interviewDetails : (existing.interviewDetails || {}),
    shortlistedAt: existing.shortlistedAt || new Date()
  });

  posting.shortlistedStudents = Array.from(shortlistedMap.values());
  await posting.save();

  const application = await JobApplication.findOne({ jobPosting: posting._id, student: studentId });
  if (application) {
    if (status === "rejected" || status === "Rejected") {
      application.status = "rejected";
    } else if (status === "offered" || status === "Offered") {
      application.status = "offered";
    } else if (status === "hired" || status === "Hired" || status === "placed") {
      application.status = "hired";
    } else if (["shortlisted", "under_review", "interview_scheduled", "accepted", "Shortlisted", "Under Review", "Interview Scheduled", "Accepted"].includes(status)) {
      application.status = "shortlisted";
    }
    await application.save();
  }

  const normStatus = status?.toLowerCase() || "";
  if (normStatus === "rejected") {
    await Notification.create({
      recipientType: "student",
      student: studentId,
      jobPosting: posting._id,
      jobApplication: application?._id,
      senderEmployer: employerId,
      type: "general",
      title: `Application Update for ${posting.title || "job posting"}`,
      message: `Thank you for your interest in ${posting.title} at ${posting.companyName}. After careful review, we have decided not to proceed with your application at this time.`,
      read: false
    });
  } else if (normStatus === "offered") {
    await Notification.findOneAndUpdate(
      { student: studentId, type: "job_offer", jobPosting: posting._id },
      {
        recipientType: "student",
        student: studentId,
        jobPosting: posting._id,
        jobApplication: application?._id,
        senderEmployer: employerId,
        type: "job_offer",
        title: `Hiring Offer: ${posting.title || "Job Posting"}`,
        message: `Congratulations! ${posting.companyName} has extended a hiring offer for the position of ${posting.title}. Please review and accept your joining invitation.`,
        read: false,
        response: undefined,
        responseAt: undefined,
        metadata: {
          jobPostingId: String(posting._id),
          jobApplicationId: application?._id ? String(application._id) : undefined,
          employerId: String(employerId),
          note: note !== undefined ? note : existing.note,
          status: status,
          offerDetails: interviewDetails || {}
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } else if (normStatus === "interview_scheduled" || normStatus === "shortlisted") {
    await Notification.findOneAndUpdate(
      { student: studentId, type: "job_shortlist", jobPosting: posting._id },
      {
        recipientType: "student",
        student: studentId,
        jobPosting: posting._id,
        jobApplication: application?._id,
        senderEmployer: employerId,
        type: "job_shortlist",
        title: `Shortlisted for ${posting.title || "job posting"}`,
        message: `You have been shortlisted for ${posting.title} at ${posting.companyName}.`,
        read: false,
        metadata: {
          jobPostingId: String(posting._id),
          jobApplicationId: application?._id ? String(application._id) : undefined,
          employerId: String(employerId),
          note: note !== undefined ? note : existing.note,
          status: status,
          interviewDetails: interviewDetails || {}
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  return posting.populate("linkedPrograms preferredCourses shortlistedStudents.student");
};

export const getEmployerCalendar = async (employerId) => {
  const postings = await JobPosting.find({ employer: employerId, isActive: true })
    .populate("shortlistedStudents.student", "firstName lastName email phone avatarUrl");

  const events = [];
  postings.forEach((posting) => {
    (posting.shortlistedStudents || []).forEach((item) => {
      if (
        item.interviewDetails &&
        item.interviewDetails.date
      ) {
        events.push({
          id: `${posting._id}_${item.student?._id || Math.random()}`,
          jobPostingId: String(posting._id),
          jobTitle: posting.title,
          companyName: posting.companyName,
          studentId: item.student?._id ? String(item.student._id) : null,
          studentName: item.student ? `${item.student.firstName || ""} ${item.student.lastName || ""}`.trim() : "Candidate",
          studentEmail: item.student?.email || "",
          studentPhone: item.student?.phone || "",
          status: item.status,
          date: item.interviewDetails.date,
          time: item.interviewDetails.time || "10:00 AM",
          type: item.interviewDetails.type || "online",
          venue: item.interviewDetails.venue || "",
          contactPerson: item.interviewDetails.contactPerson || "",
          meetingLink: item.interviewDetails.meetingLink || "",
          note: item.note || ""
        });
      }
    });
  });

  return events;
};