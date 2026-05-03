import { Router } from "express";
import {
	loginEmployer,
	loginFaculty,
	loginStudent,
	registerEmployer,
	registerFaculty,
	registerStudent
} from "../controllers/authController.js";

const router = Router();

router.post("/students/register", registerStudent);
router.post("/students/login", loginStudent);
router.post("/faculty/register", registerFaculty);
router.post("/faculty/login", loginFaculty);
router.post("/employers/register", registerEmployer);
router.post("/employers/login", loginEmployer);

export default router;
