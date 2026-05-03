import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema(
  {
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },
    title: { type: String, trim: true },
    companyName: { type: String, trim: true },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    workMode: { type: String, enum: ["onsite", "remote", "hybrid"], default: "onsite" },
    postingType: { type: String, enum: ["job", "internship", "live_project"], default: "job" },
    employmentType: { type: String, enum: ["full-time", "part-time", "internship", "contract"], default: "full-time" },
    salaryRange: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: "INR", trim: true },
      text: { type: String, trim: true }
    },
    postedAt: { type: Date, default: Date.now },
    sourceType: { type: String, enum: ["website", "linkedin", "client", "referral", "other"], default: "website" },
    sourceLink: { type: String, trim: true },
    isUrgent: { type: Boolean, default: false },
    requiredCount: { type: Number, default: 1, min: 1 },
    aboutCompany: {
      companyDescription: { type: String, trim: true },
      industry: { type: String, trim: true },
      mission: { type: String, trim: true },
      website: { type: String, trim: true },
      portfolioUrl: { type: String, trim: true }
    },
    jobDescription: {
      roleSummary: { type: String, trim: true },
      purpose: { type: String, trim: true },
      organizationalFit: { type: String, trim: true }
    },
    keyResponsibilities: [{ type: String, trim: true }],
    requiredQualifications: {
      education: [{ type: String, trim: true }],
      technicalSkills: [{ type: String, trim: true }],
      softSkills: [{ type: String, trim: true }],
      experienceLevel: { type: String, trim: true }
    },
    preferredQualifications: {
      niceToHaveSkills: [{ type: String, trim: true }],
      certifications: [{ type: String, trim: true }],
      bonusExperience: [{ type: String, trim: true }]
    },
    compensationBenefits: {
      salaryDetails: { type: String, trim: true },
      perks: [{ type: String, trim: true }],
      growthOpportunities: [{ type: String, trim: true }]
    },
    applicationProcess: {
      howToApply: { type: String, trim: true },
      requiredDocuments: [{ type: String, trim: true }],
      hiringSteps: [{ type: String, trim: true }]
    },
    screeningQuestions: [
      {
        question: { type: String, trim: true },
        helpText: { type: String, trim: true },
        isRequired: { type: Boolean, default: false }
      }
    ],
    additionalInformation: {
      workCulture: { type: String, trim: true },
      teamDetails: { type: String, trim: true },
      recommendedPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
      workingHours: { type: String, trim: true },
      timezone: { type: String, trim: true },
      travelRequirements: { type: String, trim: true }
    },
    restriction: {
      minYear: { type: Number, min: 1 },
      maxYear: { type: Number, min: 1 },
      streams: [{ type: String, trim: true }],
      genders: [{ type: String, trim: true }]
    },
    requiredCompetencies: [{ type: String, trim: true }],
    requiredCompetencyLinks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competency" }],
    preferredCompetencyLinks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competency" }],
    industry: { type: String, trim: true },
    function: { type: String, trim: true },
    deadline: { type: Date },
    applicationDeadline: { type: Date },
    linkedPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
    preferredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
    shortlistingNotes: { type: String, trim: true },
    tagType: { type: String, enum: ["normal", "employer_preferred", "hot_job_linked", "exclusive"], default: "normal" },
    visualElements: {
      coverImageUrl: { type: String, trim: true },
      bannerImageUrl: { type: String, trim: true },
      bannerVideoUrl: { type: String, trim: true },
      accentColor: { type: String, trim: true }
    },
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
