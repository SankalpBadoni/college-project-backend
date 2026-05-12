import express from "express";
import { getDummyLiveCourses, createDummyLiveCourse } from "../controllers/liveCourseController.js";

const router = express.Router();

router.get("/", getDummyLiveCourses);
router.post("/", createDummyLiveCourse);

export default router;
