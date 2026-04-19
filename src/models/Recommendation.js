import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    recipientStudent: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    sourceType: { type: String, enum: ["faculty", "student", "system"], required: true },
    sourceStudent: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    sourceFaculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    message: { type: String, trim: true }
  },
  { timestamps: true }
);

const Recommendation = mongoose.model("Recommendation", recommendationSchema);
export default Recommendation;
