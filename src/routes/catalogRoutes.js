import { Router } from "express";
import {
  getProgramDetails,
  getProgramModules,
  getModuleMaterials,
  listPrograms,
  listUpcomingPrograms
} from "../controllers/catalogController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/programs", listPrograms);
router.get("/programs/upcoming/me", protectStudent, listUpcomingPrograms);
router.get("/programs/:programId", getProgramDetails);
router.get("/programs/:programId/modules", getProgramModules);
router.get("/programs/:programId/modules/:moduleId/materials", getModuleMaterials);

export default router;
