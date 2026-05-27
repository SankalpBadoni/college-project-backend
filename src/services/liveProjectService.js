import LiveProject from "../models/LiveProject.js";

const pick = (source, keys) =>
  keys.reduce((accumulator, key) => {
    if (source[key] !== undefined) {
      accumulator[key] = source[key];
    }
    return accumulator;
  }, {});

const parseMaybeJson = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      return JSON.parse(trimmed);
    } catch (error) {
      return value;
    }
  }

  return value;
};

const toArray = (value) => {
  const parsed = parseMaybeJson(value);
  if (Array.isArray(parsed)) {
    return parsed.filter((item) => item !== undefined && item !== null && item !== "");
  }

  if (parsed === undefined || parsed === null || parsed === "") {
    return [];
  }

  return [parsed];
};

const populateProjectQuery = (query) =>
  query
    .populate("createdBy", "fullName companyName email profile logoUrl")
    .populate("linkedCourses", "title type description status coverImageUrl faculty employer")
    .populate("applicants.student", "fullName email profile")
    .populate("enrolledStudents.student", "fullName email profile")
    .populate("groups.leader", "fullName email profile")
    .populate("groups.members", "fullName email profile")
    .populate("milestones.submissions.studentId", "fullName email profile");

const populateProjectDocument = async (document) =>
  document.populate([
    { path: "createdBy", select: "fullName companyName email profile logoUrl" },
    { path: "linkedCourses", select: "title type description status coverImageUrl faculty employer" },
    { path: "applicants.student", select: "fullName email profile" },
    { path: "enrolledStudents.student", select: "fullName email profile" },
    { path: "groups.leader", select: "fullName email profile" },
    { path: "groups.members", select: "fullName email profile" },
    { path: "milestones.submissions.studentId", select: "fullName email profile" }
  ]);

const buildProjectPayload = (payload, creatorRole, creatorId) => ({
  title: payload.title,
  shortDescription: payload.shortDescription,
  fullDescription: payload.fullDescription,
  bannerImage: payload.bannerImage,
  createdBy: creatorId,
  createdByModel: creatorRole === "faculty" ? "Faculty" : "Employer",
  creatorRole,
  employerLogo: payload.employerLogo,
  companyName: payload.companyName,
  hiringOpportunity: payload.hiringOpportunity ?? false,
  linkedCourses: toArray(payload.linkedCourses),
  skillsRequired: toArray(payload.skillsRequired),
  duration: payload.duration,
  projectType: payload.projectType,
  mode: payload.mode || "online",
  allowGroup: payload.allowGroup ?? true,
  allowIndividual: payload.allowIndividual ?? true,
  maxEnrollments: payload.maxEnrollments || 100,
  milestones: toArray(payload.milestones),
  evaluationCriteria: toArray(payload.evaluationCriteria),
  prerequisites: toArray(payload.prerequisites),
  toolsRequired: toArray(payload.toolsRequired),
  deliverables: toArray(payload.deliverables),
  deadline: payload.deadline,
  status: payload.status || "open"
});

const projectLeanFields = {
  title: 1,
  shortDescription: 1,
  fullDescription: 1,
  bannerImage: 1,
  creatorRole: 1,
  employerLogo: 1,
  companyName: 1,
  hiringOpportunity: 1,
  linkedCourses: 1,
  skillsRequired: 1,
  duration: 1,
  projectType: 1,
  mode: 1,
  allowGroup: 1,
  allowIndividual: 1,
  maxEnrollments: 1,
  milestones: 1,
  evaluationCriteria: 1,
  prerequisites: 1,
  toolsRequired: 1,
  deliverables: 1,
  deadline: 1,
  applicants: 1,
  enrolledStudents: 1,
  groups: 1,
  status: 1,
  createdAt: 1,
  createdBy: 1
};

const sortProjects = (query, sortBy) => {
  switch (sortBy) {
    case "deadline":
      return query.sort({ deadline: 1, createdAt: -1 });
    case "title":
      return query.sort({ title: 1, createdAt: -1 });
    default:
      return query.sort({ createdAt: -1 });
  }
};

const buildSearchQuery = ({ search, status, projectType, mode, creatorRole }) => {
  const query = {};

  if (status) {
    query.status = status;
  } else {
    query.status = { $in: ["open", "ongoing", "draft"] };
  }

  if (projectType) {
    query.projectType = projectType;
  }

  if (mode) {
    query.mode = mode;
  }

  if (creatorRole) {
    query.creatorRole = creatorRole;
  }

  if (search) {
    const term = String(search).trim();
    if (term) {
      query.$or = [
        { title: { $regex: term, $options: "i" } },
        { shortDescription: { $regex: term, $options: "i" } },
        { fullDescription: { $regex: term, $options: "i" } },
        { companyName: { $regex: term, $options: "i" } },
        { skillsRequired: { $in: [new RegExp(term, "i")] } }
      ];
    }
  }

  return query;
};

const getProjectProgress = (project, studentId) => {
  const milestones = project.milestones || [];
  const total = milestones.length;
  if (!total) {
    return 0;
  }

  const completed = milestones.filter((milestone) =>
    milestone.submissions?.some((submission) => String(submission.studentId?._id || submission.studentId) === String(studentId) && submission.status !== "draft")
  ).length;

  return Math.min(100, Math.round((completed / total) * 100));
};

const decorateProject = (project, currentUserId) => {
  const plain = project.toObject ? project.toObject() : project;
  const milestones = plain.milestones || [];
  const overdueMilestones = milestones.filter((milestone) => milestone.dueDate && new Date(milestone.dueDate) < new Date());
  const latestSubmission = milestones
    .flatMap((milestone) => milestone.submissions || [])
    .sort((left, right) => new Date(right.submittedAt || 0) - new Date(left.submittedAt || 0))[0];
  const currentStudent = plain.enrolledStudents?.find((entry) => String(entry.student?._id || entry.student) === String(currentUserId));

  return {
    ...plain,
    applicantCount: plain.applicants?.length || 0,
    enrolledCount: plain.enrolledStudents?.length || 0,
    groupCount: plain.groups?.length || 0,
    progressPercent: currentStudent ? currentStudent.progress || getProjectProgress(project, currentUserId) : getProjectProgress(project, currentUserId),
    overdueMilestoneCount: overdueMilestones.length,
    latestSubmission,
    recentMilestones: milestones.slice(-3)
  };
};

const getProjectByIdOrThrow = async (projectId) => {
  const project = await populateProjectQuery(LiveProject.findById(projectId));
  if (!project) {
    return null;
  }

  return project;
};

const ensureOwnership = (project, userId, userRole) => String(project.createdBy?._id || project.createdBy) === String(userId) && project.creatorRole === userRole;

export const getLiveProjectRecords = async (user, userRole, filters = {}) => {
  const mine = String(filters.mine || "").toLowerCase() === "true";
  const query = mine
    ? userRole === "student"
      ? {
          $or: [
            { "enrolledStudents.student": user._id },
            { "applicants.student": user._id },
            { "groups.leader": user._id },
            { "groups.members": user._id }
          ]
        }
      : { createdBy: user._id, creatorRole: userRole }
    : buildSearchQuery(filters);
  const sort = filters.sort || "newest";
  const projects = sortProjects(LiveProject.find(query, projectLeanFields), sort);
  const populated = await populateProjectQuery(projects);
  const data = populated.map((project) => decorateProject(project, user._id));

  return { data, count: data.length };
};

export const getMyLiveProjectRecords = async (user, userRole) => {
  const projects = await populateProjectQuery(
    userRole === "student"
      ? LiveProject.find({
          $or: [
            { "enrolledStudents.student": user._id },
            { "applicants.student": user._id },
            { "groups.leader": user._id },
            { "groups.members": user._id }
          ]
        })
      : LiveProject.find({ createdBy: user._id, creatorRole: userRole })
  ).sort({ updatedAt: -1 });

  const items = projects.map((project) => decorateProject(project, user._id));
  const now = new Date();
  const deadlines = items.flatMap((project) =>
    (project.milestones || []).map((milestone) => ({
      projectId: project._id,
      projectTitle: project.title,
      milestoneId: milestone._id,
      milestoneTitle: milestone.title,
      dueDate: milestone.dueDate,
      overdue: milestone.dueDate ? new Date(milestone.dueDate) < now : false,
      score: milestone.submissions?.find((submission) => String(submission.studentId?._id || submission.studentId) === String(user._id))?.score || 0
    }))
  );

  const recentSubmissions = items
    .flatMap((project) =>
      (project.milestones || []).flatMap((milestone) =>
        (milestone.submissions || []).map((submission) => ({
          projectId: project._id,
          projectTitle: project.title,
          milestoneTitle: milestone.title,
          ...submission
        }))
      )
    )
    .sort((left, right) => new Date(right.submittedAt || 0) - new Date(left.submittedAt || 0))
    .slice(0, 10);

  const summary = {
    total: items.length,
    active: items.filter((project) => ["open", "ongoing"].includes(project.status)).length,
    overdueMilestones: deadlines.filter((item) => item.overdue).length,
    averageScore:
      items.length > 0
        ? Math.round(items.reduce((sum, project) => sum + (project.latestSubmission?.score || 0), 0) / items.length)
        : 0
  };

  return { projects: items, summary, deadlines, recentSubmissions };
};

export const getLiveProjectRecordById = async (user, userRole, projectId) => {
  const project = await getProjectByIdOrThrow(projectId);
  if (!project) {
    return null;
  }

  return decorateProject(project, user._id);
};

export const createLiveProjectRecord = async (user, userRole, payload) => {
  if (!["faculty", "employer"].includes(userRole)) {
    throw new Error("Only faculty and employers can create live projects");
  }

  const project = await LiveProject.create(buildProjectPayload(payload, userRole, user._id));
  return populateProjectDocument(project);
};

export const updateLiveProjectRecord = async (user, userRole, projectId, updates) => {
  const existingProject = await getProjectByIdOrThrow(projectId);
  if (!existingProject || !ensureOwnership(existingProject, user._id, userRole)) {
    return null;
  }

  const payload = pick(updates, [
    "title",
    "shortDescription",
    "fullDescription",
    "bannerImage",
    "employerLogo",
    "companyName",
    "hiringOpportunity",
    "linkedCourses",
    "skillsRequired",
    "duration",
    "projectType",
    "mode",
    "allowGroup",
    "allowIndividual",
    "maxEnrollments",
    "milestones",
    "evaluationCriteria",
    "prerequisites",
    "toolsRequired",
    "deliverables",
    "deadline",
    "status"
  ]);

  if (payload.linkedCourses !== undefined) {
    payload.linkedCourses = toArray(payload.linkedCourses);
  }

  if (payload.skillsRequired !== undefined) {
    payload.skillsRequired = toArray(payload.skillsRequired);
  }

  if (payload.milestones !== undefined) {
    payload.milestones = toArray(payload.milestones);
  }

  if (payload.evaluationCriteria !== undefined) {
    payload.evaluationCriteria = toArray(payload.evaluationCriteria);
  }

  if (payload.prerequisites !== undefined) {
    payload.prerequisites = toArray(payload.prerequisites);
  }

  if (payload.toolsRequired !== undefined) {
    payload.toolsRequired = toArray(payload.toolsRequired);
  }

  if (payload.deliverables !== undefined) {
    payload.deliverables = toArray(payload.deliverables);
  }

  const project = await LiveProject.findOneAndUpdate({ _id: projectId, createdBy: user._id, creatorRole: userRole }, payload, {
    new: true,
    runValidators: true
  });

  return populateProjectDocument(project);
};

export const deleteLiveProjectRecord = async (user, userRole, projectId) =>
  LiveProject.findOneAndDelete({ _id: projectId, createdBy: user._id, creatorRole: userRole });

export const applyStudentToProject = async (studentId, projectId, payload = {}) => {
  const project = await getProjectByIdOrThrow(projectId);
  if (!project) {
    return null;
  }

  const alreadyApplied = project.applicants.find((applicant) => String(applicant.student?._id || applicant.student) === String(studentId));
  if (alreadyApplied) {
    alreadyApplied.status = alreadyApplied.status || "applied";
    alreadyApplied.note = payload.note || alreadyApplied.note;
  } else {
    project.applicants.push({
      student: studentId,
      joinedAs: payload.joinedAs === "group" ? "group" : "individual",
      groupId: payload.groupId,
      note: payload.note,
      status: "applied"
    });
  }

  const enrolled = project.enrolledStudents.find((entry) => String(entry.student?._id || entry.student) === String(studentId));
  if (!enrolled) {
    project.enrolledStudents.push({ student: studentId, progress: 0 });
  }

  await project.save();
  return populateProjectDocument(project);
};

export const joinProjectGroup = async (studentId, projectId, payload = {}) => {
  const project = await getProjectByIdOrThrow(projectId);
  if (!project) {
    return null;
  }

  if (!project.allowGroup) {
    throw new Error("This project does not allow group enrollment");
  }

  let group = null;
  const memberIds = toArray(payload.memberIds).map((memberId) => String(memberId));

  if (payload.groupId) {
    group = project.groups.id(payload.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const currentMembers = new Set((group.members || []).map((memberId) => String(memberId)));
    currentMembers.add(String(studentId));
    memberIds.forEach((memberId) => currentMembers.add(memberId));
    group.members = Array.from(currentMembers);
    if (!group.leader) {
      group.leader = studentId;
    }
  } else {
    const uniqueMembers = Array.from(new Set([String(studentId), ...memberIds]));
    project.groups.push({
      groupName: payload.groupName || `Team ${project.groups.length + 1}`,
      leader: studentId,
      members: uniqueMembers
    });
    group = project.groups[project.groups.length - 1];
  }

  const enrolledIndex = project.enrolledStudents.findIndex((entry) => String(entry.student?._id || entry.student) === String(studentId));
  if (enrolledIndex >= 0) {
    project.enrolledStudents[enrolledIndex].groupId = group._id;
  } else {
    project.enrolledStudents.push({ student: studentId, groupId: group._id, progress: 0 });
  }

  await project.save();
  return populateProjectDocument(project);
};

export const addMilestoneToLiveProject = async (user, userRole, projectId, payload) => {
  const project = await getProjectByIdOrThrow(projectId);
  if (!project || !ensureOwnership(project, user._id, userRole)) {
    return null;
  }

  project.milestones.push({
    title: payload.title,
    description: payload.description,
    dueDate: payload.dueDate,
    deliverable: payload.deliverable,
    submissions: []
  });

  await project.save();
  return populateProjectDocument(project);
};

export const submitLiveProjectMilestone = async (studentId, projectId, milestoneId, payload) => {
  const project = await getProjectByIdOrThrow(projectId);
  if (!project) {
    return null;
  }

  const milestone = project.milestones.id(milestoneId);
  if (!milestone) {
    throw new Error("Milestone not found");
  }

  milestone.submissions.push({
    studentId,
    groupId: payload.groupId,
    githubLink: payload.githubLink,
    demoLink: payload.demoLink,
    notes: payload.notes,
    files: toArray(payload.files),
    score: payload.score || 0,
    feedback: payload.feedback,
    status: payload.status || "submitted"
  });

  const enrolled = project.enrolledStudents.find((entry) => String(entry.student?._id || entry.student) === String(studentId));
  if (enrolled) {
    enrolled.lastSubmittedAt = new Date();
  }

  await project.save();
  return populateProjectDocument(project);
};

export const reviewLiveProjectSubmission = async (facultyId, submissionId, payload) => {
  const project = await LiveProject.findOne({ "milestones.submissions._id": submissionId });
  if (!project) {
    return null;
  }

  if (project.creatorRole !== "faculty" || String(project.createdBy) !== String(facultyId)) {
    throw new Error("Only the faculty creator can review submissions");
  }

  let targetSubmission = null;
  project.milestones.forEach((milestone) => {
    const submission = milestone.submissions.id(submissionId);
    if (submission) {
      submission.score = payload.score ?? submission.score;
      submission.feedback = payload.feedback ?? submission.feedback;
      submission.status = payload.status || "reviewed";
      targetSubmission = submission;
    }
  });

  if (!targetSubmission) {
    throw new Error("Submission not found");
  }

  await project.save();
  return populateProjectDocument(project);
};