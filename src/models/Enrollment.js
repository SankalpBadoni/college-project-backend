import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    status: {
      type: String,
      enum: ["booked", "ongoing", "completed", "cancelled"],
      default: "booked"
    },
    enrollmentMode: { type: String, enum: ["credits", "payment"], required: true },
    creditsUsed: { type: Number, default: 0, min: 0 },
    amountPaidInr: { type: Number, default: 0, min: 0 },
    paymentLink: { type: String, trim: true },
    cancelledAt: { type: Date },
    completionDate: { type: Date }
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, program: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
