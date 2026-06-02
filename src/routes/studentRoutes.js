import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  updatePreferredJobs
} from "../controllers/studentController.js";
import { protectStudent } from "../middleware/auth.js";
import { uploadGenericFile } from "../middleware/upload.js";
import { uploadGenericFileController } from "../controllers/facultyController.js";

const router = Router();

router.get("/me", protectStudent, getMyProfile);
router.patch("/me", protectStudent, updateMyProfile);
router.patch("/me/preferred-jobs", protectStudent, updatePreferredJobs);
router.post("/me/upload", protectStudent, uploadGenericFile, uploadGenericFileController);

export default router;
