import { Router } from "express";
import {
  getActiveCareerTest,
  getMyCareerAnalysis,
  submitCareerTest
} from "../controllers/careerTestController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/active", protectStudent, getActiveCareerTest);
router.post("/submit", protectStudent, submitCareerTest);
router.get("/analysis/me", protectStudent, getMyCareerAnalysis);

export default router;
