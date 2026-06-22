import mongoose from "mongoose";

const applicantAssessmentSchema = new mongoose.Schema(
  {
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentDrive",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    responses: [
      {
        questionId: {
          type: Number,
          required: true,
        },
        section: {
          type: String,
          required: true,
        },
        selected: {
          type: String,
          enum: ["A", "B", "C", "D"],
          required: true,
        },
      },
    ],
    categoryCounts: {
      Lion: { type: Number, default: 0 },
      Owl: { type: Number, default: 0 },
      Dove: { type: Number, default: 0 },
      Butterfly: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["started", "completed"],
      default: "started",
    },
  },
  { timestamps: true }
);

// Compound index for quick lookup
applicantAssessmentSchema.index({ driveId: 1, email: 1 });

export default mongoose.model("ApplicantAssessment", applicantAssessmentSchema);
