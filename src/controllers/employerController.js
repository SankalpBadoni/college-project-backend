import {
  createEmployerLiveProject,
  createJobPosting,
  closeEmployerPosting,
  deleteEmployerPosting,
  findEmployerCandidates,
  getEmployerDashboard,
  getEmployerPosting,
  getJobStructure,
  listEmployerPostings,
  shortlistEmployerCandidates,
  updateEmployerCourseTags,
  updateEmployerPosting,
  updateEmployerProfile
} from "../services/employerService.js";

export const getDashboard = async (req, res, next) => {
  try {
    return res.json(await getEmployerDashboard(req.employer._id));
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return res.json(req.employer);
  } catch (error) {
    return next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const employer = await updateEmployerProfile(req.employer._id, req.body);
    return res.json({ message: "Employer profile updated", employer });
  } catch (error) {
    return next(error);
  }
};

export const createPosting = async (req, res, next) => {
  try {
    const posting = await createJobPosting(req.employer._id, req.body);
    return res.status(201).json({ message: "Posting created", posting });
  } catch (error) {
    return next(error);
  }
};

export const listPostings = async (req, res, next) => {
  try {
    return res.json(await listEmployerPostings(req.employer._id));
  } catch (error) {
    return next(error);
  }
};

export const getPosting = async (req, res, next) => {
  try {
    const posting = await getEmployerPosting(req.employer._id, req.params.jobPostingId);
    if (!posting) {
      return res.status(404).json({ message: "Posting not found" });
    }

    return res.json(posting);
  } catch (error) {
    return next(error);
  }
};

export const getJobStructureItem = async (req, res, next) => {
  try {
    const structure = await getJobStructure(req.employer._id, req.params.jobPostingId);
    if (!structure) {
      return res.status(404).json({ message: "Posting not found" });
    }

    return res.json(structure);
  } catch (error) {
    return next(error);
  }
};

export const updatePosting = async (req, res, next) => {
  try {
    const posting = await updateEmployerPosting(req.employer._id, req.params.jobPostingId, req.body);
    if (!posting) {
      return res.status(404).json({ message: "Posting not found" });
    }

    return res.json({ message: "Posting updated", posting });
  } catch (error) {
    return next(error);
  }
};

export const closePosting = async (req, res, next) => {
  try {
    const posting = await closeEmployerPosting(req.employer._id, req.params.jobPostingId);
    if (!posting) {
      return res.status(404).json({ message: "Posting not found" });
    }

    return res.json({ message: "Posting closed", posting });
  } catch (error) {
    return next(error);
  }
};

export const deletePosting = async (req, res, next) => {
  try {
    const posting = await deleteEmployerPosting(req.employer._id, req.params.jobPostingId);
    if (!posting) {
      return res.status(404).json({ message: "Posting not found" });
    }

    return res.json({ message: "Posting deleted" });
  } catch (error) {
    return next(error);
  }
};

export const createLiveProject = async (req, res, next) => {
  try {
    const project = await createEmployerLiveProject(req.employer._id, req.body);
    return res.status(201).json({ message: "Live project created", project });
  } catch (error) {
    return next(error);
  }
};

export const updateCourseTags = async (req, res, next) => {
  try {
    const program = await updateEmployerCourseTags(req.params.programId, req.body);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    return res.json({ message: "Course tags updated", program });
  } catch (error) {
    return next(error);
  }
};

export const listCandidates = async (req, res, next) => {
  try {
    const result = await findEmployerCandidates(req.employer._id, req.params.jobPostingId, req.body || {});
    if (!result) {
      return res.status(404).json({ message: "Posting not found" });
    }

    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

export const shortlistCandidates = async (req, res, next) => {
  try {
    const posting = await shortlistEmployerCandidates(req.employer._id, req.params.jobPostingId, req.body.studentIds || [], req.body.note);
    if (!posting) {
      return res.status(404).json({ message: "Posting not found" });
    }

    return res.json({ message: "Students shortlisted", posting });
  } catch (error) {
    return next(error);
  }
};
