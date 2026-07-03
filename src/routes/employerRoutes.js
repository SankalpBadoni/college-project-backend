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
  updateCourseTags,
  updateMe,
  updatePosting,
  getMe
} from "../controllers/employerController.js";
import { protectEmployer } from "../middleware/auth.js";
import { uploadGenericFile } from "../middleware/upload.js";
import { uploadGenericFileController } from "../controllers/facultyController.js";

const router = Router();

router.get("/dashboard", protectEmployer, getDashboard);
router.get("/me", protectEmployer, getMe);
router.patch("/me", protectEmployer, updateMe);
router.post("/me/upload", protectEmployer, uploadGenericFile, uploadGenericFileController);

router.post("/jobs", protectEmployer, createPosting);
router.get("/jobs", protectEmployer, listPostings);
router.get("/jobs/:jobPostingId", protectEmployer, getPosting);
router.get("/jobs/:jobPostingId/structure", protectEmployer, getJobStructureItem);
router.patch("/jobs/:jobPostingId", protectEmployer, updatePosting);
router.patch("/jobs/:jobPostingId/close", protectEmployer, closePosting);
router.delete("/jobs/:jobPostingId", protectEmployer, deletePosting);
router.post("/jobs/:jobPostingId/candidates", protectEmployer, listCandidates);
router.post("/jobs/:jobPostingId/shortlist", protectEmployer, shortlistCandidates);

router.post("/live-projects", protectEmployer, createLiveProject);
router.patch("/live-projects/:programId/tags", protectEmployer, updateCourseTags);

export default router;