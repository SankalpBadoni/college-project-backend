import crypto from "crypto";
import Payment from "../models/Payment.js";
import Program from "../models/Program.js";
import Enrollment from "../models/Enrollment.js";

export const createPaymentLink = async (req, res, next) => {
  try {
    const { programId } = req.body;
    const program = await Program.findById(programId);

    if (!program || !program.isActive) {
      return res.status(404).json({ message: "Program not found" });
    }

    const ref = crypto.randomBytes(8).toString("hex");
    const paymentLink = `https://payments.example.com/pay/${ref}`;

    const payment = await Payment.create({
      student: req.student._id,
      program: program._id,
      paymentLink,
      amountInr: program.priceInr,
      providerRef: ref
    });

    return res.status(201).json({ message: "Payment link generated", payment });
  } catch (error) {
    return next(error);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({ _id: paymentId, student: req.student._id }).populate("program");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "paid";
    await payment.save();

    let enrollment = await Enrollment.findOne({ student: req.student._id, program: payment.program._id });

    if (!enrollment) {
      enrollment = await Enrollment.create({
        student: req.student._id,
        program: payment.program._id,
        enrollmentMode: "payment",
        amountPaidInr: payment.amountInr,
        paymentLink: payment.paymentLink,
        status: "booked"
      });
    } else {
      enrollment.status = "booked";
      enrollment.enrollmentMode = "payment";
      enrollment.amountPaidInr = payment.amountInr;
      enrollment.paymentLink = payment.paymentLink;
      enrollment.cancelledAt = undefined;
      await enrollment.save();
    }

    return res.json({ message: "Payment confirmed and enrollment booked", payment, enrollment });
  } catch (error) {
    return next(error);
  }
};
