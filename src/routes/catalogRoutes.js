import { Router } from "express";
import {
  getProgramDetails,
  listPrograms,
  listUpcomingPrograms
} from "../controllers/catalogController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/programs", listPrograms);
router.get("/programs/:programId", getProgramDetails);
router.get("/programs/upcoming/me", protectStudent, listUpcomingPrograms);

export default router;
