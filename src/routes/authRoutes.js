import { Router } from "express";
import { loginStudent, registerStudent } from "../controllers/authController.js";

const router = Router();

router.post("/students/register", registerStudent);
router.post("/students/login", loginStudent);

export default router;
