import mongoose from "mongoose";

const assessmentQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: Number,
      required: true,
      index: true,
    },
    section: {
      type: String,
      enum: ["strengths", "weaknesses", "communication"],
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        code: {
          type: String,
          enum: ["A", "B", "C", "D"],
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        personality: {
          type: String,
          enum: ["Butterfly", "Dove", "Lion", "Owl"],
          required: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index for quick lookup
assessmentQuestionSchema.index({ section: 1, questionId: 1 });

export default mongoose.model("AssessmentQuestion", assessmentQuestionSchema);
