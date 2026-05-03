import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema(
  {
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    postingType: { type: String, enum: ["job", "internship", "live_project"], default: "job" },
    sourceType: { type: String, enum: ["website", "linkedin", "client", "referral", "other"], default: "website" },
    sourceLink: { type: String, trim: true },
    isUrgent: { type: Boolean, default: false },
    requiredCount: { type: Number, default: 1, min: 1 },
    restriction: {
      minYear: { type: Number, min: 1 },
      maxYear: { type: Number, min: 1 },
      streams: [{ type: String, trim: true }],
      genders: [{ type: String, trim: true }]
    },
    requiredCompetencies: [{ type: String, trim: true }],
    industry: { type: String, trim: true },
    function: { type: String, trim: true },
    deadline: { type: Date, required: true },
    linkedPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
    preferredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
    shortlistingNotes: { type: String, trim: true },
    tagType: { type: String, enum: ["normal", "employer_preferred", "hot_job_linked", "exclusive"], default: "normal" },
    shortlistedStudents: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        note: { type: String, trim: true },
        shortlistedAt: { type: Date, default: Date.now }
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const JobPosting = mongoose.model("JobPosting", jobPostingSchema);
export default JobPosting;
