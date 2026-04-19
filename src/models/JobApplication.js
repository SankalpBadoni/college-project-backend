import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    jobPosting: { type: mongoose.Schema.Types.ObjectId, ref: "JobPosting", required: true },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "placed"],
      default: "applied"
    },
    coverLetter: { type: String, trim: true }
  },
  { timestamps: true }
);

jobApplicationSchema.index({ student: 1, jobPosting: 1 }, { unique: true });

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
export default JobApplication;
