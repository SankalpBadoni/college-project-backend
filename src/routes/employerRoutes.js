import { Router } from "express";
import {
  createLiveProject,
  createPosting,
  closePosting,
  deletePosting,
  getDashboard,
  getPosting,
  getJobStructureItem,
  listCandidates,
  listPostings,
  shortlistCandidates,
  updateCandidateStatusItem,
  getCalendar,
  updateMe,
  updatePosting,
  getMe,
  listEmployerNotifications,
  markEmployerNotificationRead,
  updateCourseTags
} from "../controllers/employerController.js";
import { protectEmployer } from "../middleware/auth.js";
import { uploadGenericFile } from "../middleware/upload.js";
import { uploadGenericFileController } from "../controllers/facultyController.js";

const router = Router();

router.get("/dashboard", protectEmployer, getDashboard);
router.get("/calendar", protectEmployer, getCalendar);
router.get("/me", protectEmployer, getMe);
router.patch("/me", protectEmployer, updateMe);
router.post("/me/upload", protectEmployer, uploadGenericFile, uploadGenericFileController);
router.get("/notifications", protectEmployer, listEmployerNotifications);
router.patch("/notifications/:notificationId/read", protectEmployer, markEmployerNotificationRead);

router.post("/jobs", protectEmployer, createPosting);
router.get("/jobs", protectEmployer, listPostings);
router.get("/jobs/:jobPostingId", protectEmployer, getPosting);
router.get("/jobs/:jobPostingId/structure", protectEmployer, getJobStructureItem);
router.patch("/jobs/:jobPostingId", protectEmployer, updatePosting);
router.patch("/jobs/:jobPostingId/close", protectEmployer, closePosting);
router.delete("/jobs/:jobPostingId", protectEmployer, deletePosting);
router.post("/jobs/:jobPostingId/candidates", protectEmployer, listCandidates);
router.post("/jobs/:jobPostingId/shortlist", protectEmployer, shortlistCandidates);
router.patch("/jobs/:jobPostingId/candidates/:studentId/status", protectEmployer, updateCandidateStatusItem);

router.post("/live-projects", protectEmployer, createLiveProject);
router.patch("/live-projects/:programId/tags", protectEmployer, updateCourseTags);

export default router;