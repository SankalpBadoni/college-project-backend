import { Router } from "express";
import {
	addMilestone,
	applyToLiveProject,
	createLiveProject,
	deleteLiveProject,
	getLiveProjectById,
	getLiveProjects,
	getMyLiveProjects,
	joinGroup,
	reviewSubmission,
	submitMilestone,
	updateLiveProject
} from "../controllers/liveProjectController.js";
import { protectAccount, protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/me", protectAccount, getMyLiveProjects);
router.get("/", protectAccount, getLiveProjects);
router.get("/:id", protectAccount, getLiveProjectById);

router.post("/create", protectAccount, createLiveProject);
router.post("/", protectAccount, createLiveProject);
router.put("/:id", protectAccount, updateLiveProject);
router.delete("/:id", protectAccount, deleteLiveProject);

router.post("/:id/apply", protectStudent, applyToLiveProject);
router.post("/:id/join-group", protectStudent, joinGroup);
router.post("/:id/milestone", protectAccount, addMilestone);
router.post("/:id/submit/:milestoneId", protectStudent, submitMilestone);
router.post("/review/:submissionId", protectAccount, reviewSubmission);

export default router;
