import { Router } from "express";
import {
  createLiveProject,
  createPosting,
  deletePosting,
  getDashboard,
  getPosting,
  listCandidates,
  listPostings,
  shortlistCandidates,
  updateCourseTags,
  updateMe,
  updatePosting,
  getMe
} from "../controllers/employerController.js";
import { protectEmployer } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", protectEmployer, getDashboard);
router.get("/me", protectEmployer, getMe);
router.patch("/me", protectEmployer, updateMe);

router.post("/jobs", protectEmployer, createPosting);
router.get("/jobs", protectEmployer, listPostings);
router.get("/jobs/:jobPostingId", protectEmployer, getPosting);
router.patch("/jobs/:jobPostingId", protectEmployer, updatePosting);
router.delete("/jobs/:jobPostingId", protectEmployer, deletePosting);
router.post("/jobs/:jobPostingId/candidates", protectEmployer, listCandidates);
router.post("/jobs/:jobPostingId/shortlist", protectEmployer, shortlistCandidates);

router.post("/live-projects", protectEmployer, createLiveProject);
router.patch("/live-projects/:programId/tags", protectEmployer, updateCourseTags);

export default router;