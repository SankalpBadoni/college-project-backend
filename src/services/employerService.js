import Employer from "../models/Employer.js";
import bcrypt from "bcryptjs";

import JobPosting from "../models/JobPosting.js";
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
      urgentPostings: postings.filter((posting) => posting.isUrgent).length,
      premiumEmployer: employer?.tier === "premium"
    },
    recentPostings: postings.slice(0, 10),
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
    isActive: payload.isActive ?? true
  };

  return JobPosting.create(safePayload);
};

export const listEmployerPostings = async (employerId) =>
  JobPosting.find({ employer: employerId })
    .populate("linkedPrograms preferredCourses shortlistedStudents.student")
    .sort({ createdAt: -1 });

export const getEmployerPosting = async (employerId, postingId) =>
  JobPosting.findOne({ _id: postingId, employer: employerId }).populate(
    "linkedPrograms preferredCourses shortlistedStudents.student"
  );

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
    "jdUrl",
    "isActive"
  ]);

  return JobPosting.findOneAndUpdate({ _id: postingId, employer: employerId }, payload, {
    new: true,
    runValidators: true
  }).populate("linkedPrograms preferredCourses shortlistedStudents.student");
};

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

  return {
    posting,
    count: students.length,
    students
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

export const shortlistEmployerCandidates = async (employerId, postingId, studentIds = [], note) => {
  const posting = await getEmployerPosting(employerId, postingId);

  if (!posting) {
    return null;
  }

  const shortlistedMap = new Map(
    (posting.shortlistedStudents || []).map((item) => [String(item.student), item])
  );

  normalizeIds(studentIds).forEach((studentId) => {
    shortlistedMap.set(String(studentId), {
      student: studentId,
      note: note || posting.shortlistingNotes || "Shortlisted from employer dashboard",
      shortlistedAt: new Date()
    });
  });

  posting.shortlistedStudents = Array.from(shortlistedMap.values());
  await posting.save();

  return posting.populate("linkedPrograms preferredCourses shortlistedStudents.student");
};