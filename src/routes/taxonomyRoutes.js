import { Router } from "express";
import {
  listIndustries,
  createIndustry,
  listDomains,
  createDomain,
  listCompetencies,
  listAllCompetencies,
  createCompetency
} from "../controllers/taxonomyController.js";
import { protectAccount } from "../middleware/auth.js";

const router = Router();

// Public READ routes (no auth required)
router.get("/industries", listIndustries);
router.get("/domains", listDomains);               // ?industry=<id>
router.get("/competencies", listCompetencies);      // ?domain=<id>&type=technical|behavioral
router.get("/competencies/all", listAllCompetencies);

// Authenticated WRITE routes (faculty/employer can add new taxonomy items via "Other")
router.post("/industries", protectAccount, createIndustry);
router.post("/domains", protectAccount, createDomain);
router.post("/competencies", protectAccount, createCompetency);

export default router;
