import { Router } from "express";
import { applyToJob, listJobPostings, listMyJobApplications, getJobMetadata, getJobById } from "../controllers/jobController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/metadata", getJobMetadata);
router.get("/postings", protectStudent, listJobPostings);
router.get("/postings/:id", protectStudent, getJobById);
router.post("/apply", protectStudent, applyToJob);
router.get("/applications/me", protectStudent, listMyJobApplications);

export default router;
