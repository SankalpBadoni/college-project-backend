import { Router } from "express";
import { applyToJob, listJobPostings, listMyJobApplications } from "../controllers/jobController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/postings", protectStudent, listJobPostings);
router.post("/apply", protectStudent, applyToJob);
router.get("/applications/me", protectStudent, listMyJobApplications);

export default router;
