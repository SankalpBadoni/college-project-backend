import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    paymentLink: { type: String, required: true },
    amountInr: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    providerRef: { type: String, trim: true }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
