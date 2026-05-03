import {
  cancelLiveClassSession,
  createAssessment,
  createCourseMaterial,
  createCourseModule,
  createLiveClassSession,
  deleteCourseMaterial,
  deleteCourseModule,
  getFacultyDashboard,
  listAssessments,
  listCourseMaterials,
  listCourseModules,
  listFacultyRatings,
  listLiveClassSessions,
  getCourseStructure,
  submitFacultyRating,
  updateAssessment,
  updateCourseOverview,
  updateCourseMaterial,
  updateCourseModule,
  updateFacultyProfile,
  updateLiveClassSession,
  upsertAssessmentScore
} from "../services/facultyService.js";

export const getDashboard = async (req, res, next) => {
  try {
    return res.json(await getFacultyDashboard(req.faculty._id));
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return res.json(req.faculty);
  } catch (error) {
    return next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const faculty = await updateFacultyProfile(req.faculty._id, req.body);
    return res.json({ message: "Faculty profile updated", faculty });
  } catch (error) {
    return next(error);
  }
};

export const updateCourseOverviewItem = async (req, res, next) => {
  try {
    const course = await updateCourseOverview(req.faculty._id, req.params.programId, req.body);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json({ message: "Course overview updated", course });
  } catch (error) {
    return next(error);
  }
};

export const getCourseStructureItem = async (req, res, next) => {
  try {
    const structure = await getCourseStructure(req.faculty._id, req.params.programId);
    if (!structure) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json(structure);
  } catch (error) {
    return next(error);
  }
};

export const createMaterial = async (req, res, next) => {
  try {
    const material = await createCourseMaterial(req.faculty._id, req.body);
    return res.status(201).json({ message: "Course material uploaded", material });
  } catch (error) {
    return next(error);
  }
};

export const listMaterials = async (req, res, next) => {
  try {
    return res.json(await listCourseMaterials(req.faculty._id, req.query));
  } catch (error) {
    return next(error);
  }
};

export const updateMaterial = async (req, res, next) => {
  try {
    const material = await updateCourseMaterial(req.faculty._id, req.params.materialId, req.body);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    return res.json({ message: "Course material updated", material });
  } catch (error) {
    return next(error);
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    const material = await deleteCourseMaterial(req.faculty._id, req.params.materialId);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    return res.json({ message: "Course material deleted" });
  } catch (error) {
    return next(error);
  }
};

export const createModule = async (req, res, next) => {
  try {
    const module = await createCourseModule(req.faculty._id, req.body);
    return res.status(201).json({ message: "Module created", module });
  } catch (error) {
    return next(error);
  }
};

export const listModules = async (req, res, next) => {
  try {
    return res.json(await listCourseModules(req.faculty._id, req.query));
  } catch (error) {
    return next(error);
  }
};

export const updateModule = async (req, res, next) => {
  try {
    const module = await updateCourseModule(req.faculty._id, req.params.moduleId, req.body);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    return res.json({ message: "Module updated", module });
  } catch (error) {
    return next(error);
  }
};

export const deleteModule = async (req, res, next) => {
  try {
    const module = await deleteCourseModule(req.faculty._id, req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    return res.json({ message: "Module deleted" });
  } catch (error) {
    return next(error);
  }
};

export const createLiveClass = async (req, res, next) => {
  try {
    const session = await createLiveClassSession(req.faculty._id, req.body);
    return res.status(201).json({ message: "Live class created", session });
  } catch (error) {
    return next(error);
  }
};

export const listLiveClasses = async (req, res, next) => {
  try {
    return res.json(await listLiveClassSessions(req.faculty._id, req.query));
  } catch (error) {
    return next(error);
  }
};

export const updateLiveClass = async (req, res, next) => {
  try {
    const session = await updateLiveClassSession(req.faculty._id, req.params.sessionId, req.body);
    if (!session) {
      return res.status(404).json({ message: "Live class not found" });
    }

    return res.json({ message: "Live class updated", session });
  } catch (error) {
    return next(error);
  }
};

export const cancelLiveClass = async (req, res, next) => {
  try {
    const session = await cancelLiveClassSession(req.faculty._id, req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: "Live class not found" });
    }

    return res.json({ message: "Live class cancelled", session });
  } catch (error) {
    return next(error);
  }
};

export const createAssessmentItem = async (req, res, next) => {
  try {
    const assessment = await createAssessment(req.faculty._id, req.body);
    return res.status(201).json({ message: "Assessment created", assessment });
  } catch (error) {
    return next(error);
  }
};

export const listAssessmentItems = async (req, res, next) => {
  try {
    return res.json(await listAssessments(req.faculty._id, req.query));
  } catch (error) {
    return next(error);
  }
};

export const updateAssessmentItem = async (req, res, next) => {
  try {
    const assessment = await updateAssessment(req.faculty._id, req.params.assessmentId, req.body);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    return res.json({ message: "Assessment updated", assessment });
  } catch (error) {
    return next(error);
  }
};

export const gradeAssessment = async (req, res, next) => {
  try {
    const score = await upsertAssessmentScore(req.faculty._id, req.params.assessmentId, req.body);
    if (!score) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    return res.json({ message: "Assessment score updated", score });
  } catch (error) {
    return next(error);
  }
};

export const listRatings = async (req, res, next) => {
  try {
    return res.json(await listFacultyRatings(req.faculty._id));
  } catch (error) {
    return next(error);
  }
};

export const submitRating = async (req, res, next) => {
  try {
    const rating = await submitFacultyRating(req.params.facultyId || req.faculty._id, req.body);
    return res.status(201).json({ message: "Rating saved", rating });
  } catch (error) {
    return next(error);
  }
};
