import {
  addMilestoneToLiveProject,
  applyStudentToProject,
  createLiveProjectRecord,
  deleteLiveProjectRecord,
  getLiveProjectRecordById,
  getLiveProjectRecords,
  getMyLiveProjectRecords,
  joinProjectGroup,
  reviewLiveProjectSubmission,
  submitLiveProjectMilestone,
  updateLiveProjectRecord
} from "../services/liveProjectService.js";

const sendProjectResponse = (res, project, statusCode = 200, message) => {
  if (!project) {
    return res.status(404).json({ message: "Live project not found" });
  }

  return res.status(statusCode).json(message ? { message, project } : project);
};

export const getLiveProjects = async (req, res, next) => {
  try {
    const result = await getLiveProjectRecords(req.user, req.userRole, req.query);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

export const getMyLiveProjects = async (req, res, next) => {
  try {
    const result = await getMyLiveProjectRecords(req.user, req.userRole);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

export const getLiveProjectById = async (req, res, next) => {
  try {
    const project = await getLiveProjectRecordById(req.user, req.userRole, req.params.id);
    return sendProjectResponse(res, project);
  } catch (error) {
    return next(error);
  }
};

export const createLiveProject = async (req, res, next) => {
  try {
    const project = await createLiveProjectRecord(req.user, req.userRole, req.body);
    return res.status(201).json({ message: "Live project created", project });
  } catch (error) {
    return next(error);
  }
};

export const updateLiveProject = async (req, res, next) => {
  try {
    const project = await updateLiveProjectRecord(req.user, req.userRole, req.params.id, req.body);
    return sendProjectResponse(res, project, 200, "Live project updated");
  } catch (error) {
    return next(error);
  }
};

export const deleteLiveProject = async (req, res, next) => {
  try {
    const project = await deleteLiveProjectRecord(req.user, req.userRole, req.params.id);
    return sendProjectResponse(res, project, 200, "Live project deleted");
  } catch (error) {
    return next(error);
  }
};

export const applyToLiveProject = async (req, res, next) => {
  try {
    const project = await applyStudentToProject(req.student._id, req.params.id, req.body);
    return sendProjectResponse(res, project, 200, "Applied to live project");
  } catch (error) {
    return next(error);
  }
};

export const joinGroup = async (req, res, next) => {
  try {
    const project = await joinProjectGroup(req.student._id, req.params.id, req.body);
    return sendProjectResponse(res, project, 200, "Group updated");
  } catch (error) {
    return next(error);
  }
};

export const addMilestone = async (req, res, next) => {
  try {
    const project = await addMilestoneToLiveProject(req.user, req.userRole, req.params.id, req.body);
    return sendProjectResponse(res, project, 201, "Milestone added");
  } catch (error) {
    return next(error);
  }
};

export const submitMilestone = async (req, res, next) => {
  try {
    const project = await submitLiveProjectMilestone(req.student._id, req.params.id, req.params.milestoneId, req.body);
    return sendProjectResponse(res, project, 201, "Submission received");
  } catch (error) {
    return next(error);
  }
};

export const reviewSubmission = async (req, res, next) => {
  try {
    const project = await reviewLiveProjectSubmission(req.faculty._id, req.params.submissionId, req.body);
    return sendProjectResponse(res, project, 200, "Submission reviewed");
  } catch (error) {
    return next(error);
  }
};
