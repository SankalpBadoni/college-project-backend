import { Router } from "express";
import {
  cancelLiveClass,
  createAssessmentItem,
  createLiveClass,
  createMaterial,
  createModule,
  deleteMaterial,
  deleteModule,
  getDashboard,
  getCourseStructureItem,
  getMe,
  gradeAssessment,
  listAssessmentItems,
  listLiveClasses,
  listMaterials,
  listModules,
  listRatings,
  submitRating,
  updateCourseOverviewItem,
  createCourseItem,
  updateAssessmentItem,
  updateLiveClass,
  updateMaterial,
  updateMe,
  updateModule
} from "../controllers/facultyController.js";
import { protectFaculty, protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", protectFaculty, getDashboard);
router.get("/me", protectFaculty, getMe);
router.patch("/me", protectFaculty, updateMe);
router.post("/me/courses", protectFaculty, createCourseItem);
router.patch("/me/courses/:programId/overview", protectFaculty, updateCourseOverviewItem);
router.get("/me/courses/:programId/structure", protectFaculty, getCourseStructureItem);

router.post("/me/materials", protectFaculty, createMaterial);
router.get("/me/materials", protectFaculty, listMaterials);
router.patch("/me/materials/:materialId", protectFaculty, updateMaterial);
router.delete("/me/materials/:materialId", protectFaculty, deleteMaterial);

router.post("/me/modules", protectFaculty, createModule);
router.get("/me/modules", protectFaculty, listModules);
router.patch("/me/modules/:moduleId", protectFaculty, updateModule);
router.delete("/me/modules/:moduleId", protectFaculty, deleteModule);

router.post("/me/live-classes", protectFaculty, createLiveClass);
router.get("/me/live-classes", protectFaculty, listLiveClasses);
router.patch("/me/live-classes/:sessionId", protectFaculty, updateLiveClass);
router.delete("/me/live-classes/:sessionId", protectFaculty, cancelLiveClass);

router.post("/me/assessments", protectFaculty, createAssessmentItem);
router.get("/me/assessments", protectFaculty, listAssessmentItems);
router.patch("/me/assessments/:assessmentId", protectFaculty, updateAssessmentItem);
router.post("/me/assessments/:assessmentId/scores", protectFaculty, gradeAssessment);

router.get("/me/ratings", protectFaculty, listRatings);
router.post("/:facultyId/ratings", protectStudent, submitRating);

export default router;