import { Router } from "express";
import {
  generateSystemRecommendations,
  listMyRecommendations
} from "../controllers/recommendationController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/me", protectStudent, listMyRecommendations);
router.post("/me/generate", protectStudent, generateSystemRecommendations);

export default router;
