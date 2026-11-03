import { Router } from "express";
import { protectStudent } from "../middleware/auth.js";
import {
  listSessions,
  createSession,
  getSession,
  deleteSession,
  chat,
  reportMessage
} from "../controllers/aiMentorController.js";

const router = Router();

router.get("/sessions", protectStudent, listSessions);
router.post("/sessions", protectStudent, createSession);
router.get("/sessions/:id", protectStudent, getSession);
router.delete("/sessions/:id", protectStudent, deleteSession);

router.post("/chat", protectStudent, chat);
router.post("/report", protectStudent, reportMessage);

export default router;
