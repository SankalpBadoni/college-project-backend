import { Router } from "express";
import { confirmPayment, createPaymentLink } from "../controllers/paymentController.js";
import { protectStudent } from "../middleware/auth.js";

const router = Router();

router.post("/links", protectStudent, createPaymentLink);
router.patch("/:paymentId/confirm", protectStudent, confirmPayment);

export default router;
