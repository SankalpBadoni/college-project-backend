import { Router } from "express";
import {
  addToFavorites,
  getFavorites,
  removeFromFavorites
} from "../controllers/favoriteController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/", protectStudent, getFavorites);
router.post("/", protectStudent, addToFavorites);
router.delete("/:programId", protectStudent, removeFromFavorites);

export default router;
