import mongoose from "mongoose";

const assessmentScoreSchema = new mongoose.Schema(
  {
    assessment: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    score: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, required: true, min: 0 },
    feedback: { type: String, trim: true },
    gradedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

assessmentScoreSchema.index({ assessment: 1, student: 1 }, { unique: true });

const AssessmentScore = mongoose.model("AssessmentScore", assessmentScoreSchema);
export default AssessmentScore;