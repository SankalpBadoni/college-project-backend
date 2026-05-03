import Employer from "../models/Employer.js";
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
  "approvedAt"
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
  const payload = pick(updates, allowedEmployerFields);
  return Employer.findByIdAndUpdate(employerId, payload, { new: true, runValidators: true });
};

export const createJobPosting = async (employerId, payload) => {
  const employer = await Employer.findById(employerId);
  const safePayload = {
    employer: employerId,
    companyName: payload.companyName || employer.companyName,
    title: payload.title,
    description: payload.description,
    postingType: payload.postingType || "job",
    sourceType: payload.sourceType || "website",
    sourceLink: payload.sourceLink,
    isUrgent: Boolean(payload.isUrgent),
    requiredCount: payload.requiredCount || 1,
    restriction: payload.restriction || {},
    requiredCompetencies: payload.requiredCompetencies || [],
    industry: payload.industry,
    function: payload.function,
    deadline: payload.deadline,
    linkedPrograms: payload.linkedPrograms || [],
    preferredCourses: payload.preferredCourses || [],
    shortlistingNotes: payload.shortlistingNotes,
    tagType: payload.tagType || "normal",
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
    "postingType",
    "sourceType",
    "sourceLink",
    "isUrgent",
    "requiredCount",
    "restriction",
    "requiredCompetencies",
    "industry",
    "function",
    "deadline",
    "linkedPrograms",
    "preferredCourses",
    "shortlistingNotes",
    "tagType",
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