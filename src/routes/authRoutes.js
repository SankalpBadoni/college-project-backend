import { Router } from "express";
import {
	loginEmployer,
	loginFaculty,
	loginStudent,
	registerEmployer,
	registerFaculty,
	registerStudent
} from "../controllers/authController.js";
import { uploadGenericFile } from "../middleware/upload.js";
import { uploadGenericFileController } from "../controllers/facultyController.js";

const router = Router();

router.post("/students/register", registerStudent);
router.post("/students/login", loginStudent);
router.post("/faculty/register", registerFaculty);
router.post("/faculty/login", loginFaculty);
router.post("/employers/register", registerEmployer);
router.post("/employers/login", loginEmployer);

// Public file upload endpoint for onboarding / registration
router.post("/upload", uploadGenericFile, uploadGenericFileController);

export default router;
