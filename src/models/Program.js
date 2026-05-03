import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["course", "assessment", "live_project"] },
    status: { type: String, default: "published", enum: ["draft", "published", "archived"] },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    competencies: [{ type: String, trim: true }],
    preferredJobTags: [{ type: String, trim: true }],
    employerPreferred: { type: Boolean, default: false },
    hotJobLinked: { type: Boolean, default: false },
    exclusiveJobLinked: { type: Boolean, default: false },
    linkedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPosting" }],
    courseOverview: {
      shortDescription: { type: String, trim: true },
      targetAudience: [{ type: String, trim: true }],
      learningOutcomes: [{ type: String, trim: true }],
      prerequisites: [{ type: String, trim: true }],
      numberOfModules: { type: Number, min: 0 },
      numberOfLessons: { type: Number, min: 0 }
    },
    courseIntroduction: {
      enabled: { type: Boolean, default: false },
      welcomeVideoUrl: { type: String, trim: true },
      platformGuide: { type: String, trim: true },
      roadmap: [{ type: String, trim: true }],
      visualElements: {
        coverImageUrl: { type: String, trim: true },
        bannerVideoUrl: { type: String, trim: true },
        accentColor: { type: String, trim: true },
        iconUrl: { type: String, trim: true }
      }
    },
    courseProgress: {
      enabled: { type: Boolean, default: false },
      completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
      milestones: [
        {
          title: { type: String, trim: true },
          description: { type: String, trim: true },
          completionPercentage: { type: Number, min: 0, max: 100 }
        }
      ],
      badges: [{ type: String, trim: true }]
    },
    certification: {
      enabled: { type: Boolean, default: false },
      minimumScore: { type: Number, min: 0, max: 100 },
      projectRequired: { type: Boolean, default: false },
      criteria: [{ type: String, trim: true }]
    },
    minYearEligible: { type: Number, default: 1 },
    maxYearEligible: { type: Number, default: 6 },
    startDate: { type: Date },
    applicationDeadline: { type: Date },
    durationHours: { type: Number, default: 0, min: 0 },
    maxStudents: { type: Number, default: 100, min: 1 },
    creditCost: { type: Number, default: 0, min: 0 },
    priceInr: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    placementStats: {
      successfulPlacementsCount: { type: Number, default: 0 },
      companies: [{ type: String, trim: true }]
    }
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", programSchema);
export default Program;
