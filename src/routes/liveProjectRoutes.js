import express from "express";
import { getDummyProjects, createDummyProject, getDummyProjectById } from "../controllers/liveProjectController.js";

const router = express.Router();

router.get("/", getDummyProjects);
router.get("/:id", getDummyProjectById);
router.post("/", createDummyProject);

export default router;
