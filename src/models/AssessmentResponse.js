import mongoose from "mongoose";

const assessmentResponseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    assessmentType: {
      type: String,
      enum: ["career-profiler", "communication"],
      default: "career-profiler",
    },
    strengthResponses: [
      {
        questionId: {
          type: Number,
          required: true,
        },
        selected: {
          type: String,
          enum: ["A", "B", "C", "D"],
          required: true,
        },
      },
    ],
    weaknessResponses: [
      {
        questionId: {
          type: Number,
          required: true,
        },
        selected: {
          type: String,
          enum: ["A", "B", "C", "D"],
          required: true,
        },
      },
    ],
    scores: {
      butterfly: {
        type: Number,
        default: 0,
      },
      dove: {
        type: Number,
        default: 0,
      },
      lion: {
        type: Number,
        default: 0,
      },
      owl: {
        type: Number,
        default: 0,
      },
    },
    percentages: {
      butterfly: {
        type: Number,
        default: 0,
      },
      dove: {
        type: Number,
        default: 0,
      },
      lion: {
        type: Number,
        default: 0,
      },
      owl: {
        type: Number,
        default: 0,
      },
    },
    dominantType: {
      type: String,
      enum: ["Butterfly", "Dove", "Lion", "Owl"],
    },
    secondaryType: {
      type: String,
      enum: ["Butterfly", "Dove", "Lion", "Owl"],
    },
    careerSuggestions: [String],
    analysisDetails: {
      strengthAnalysis: String,
      weaknessAnalysis: String,
      combinedAnalysis: String,
    },
    status: {
      type: String,
      enum: ["completed", "incomplete", "pending"],
      default: "completed",
    },
  },
  { timestamps: true }
);

// Index for user lookup
assessmentResponseSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("AssessmentResponse", assessmentResponseSchema);
