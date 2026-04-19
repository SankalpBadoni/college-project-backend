import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    requiredCompetencies: [{ type: String, trim: true }],
    industry: { type: String, trim: true },
    function: { type: String, trim: true },
    deadline: { type: Date, required: true },
    linkedPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const JobPosting = mongoose.model("JobPosting", jobPostingSchema);
export default JobPosting;
