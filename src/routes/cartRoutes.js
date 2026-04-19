import { Router } from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.get("/", protectStudent, getCart);
router.post("/", protectStudent, addToCart);
router.delete("/:programId", protectStudent, removeFromCart);

export default router;
