import { Router } from "express";
import {
  cancelEnrollment,
  enrollProgram,
  getMyEnrollments
} from "../controllers/enrollmentController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.post("/", protectStudent, enrollProgram);
router.get("/me", protectStudent, getMyEnrollments);
router.patch("/:enrollmentId/cancel", protectStudent, cancelEnrollment);

export default router;
