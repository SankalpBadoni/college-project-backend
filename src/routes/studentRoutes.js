import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  updatePreferredJobs
} from "../controllers/studentController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/me", protectStudent, getMyProfile);
router.patch("/me", protectStudent, updateMyProfile);
router.patch("/me/preferred-jobs", protectStudent, updatePreferredJobs);

export default router;
