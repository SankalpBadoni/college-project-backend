import { Router } from "express";
import {
  generateCourseStartNotifications,
  listNotifications,
  markAsRead,
  respondToNotification
} from "../controllers/notificationController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/me", protectStudent, listNotifications);
router.patch("/me/:notificationId/read", protectStudent, markAsRead);
router.patch("/me/:notificationId/respond", protectStudent, respondToNotification);
router.post("/me/generate-course-start", protectStudent, generateCourseStartNotifications);

export default router;
