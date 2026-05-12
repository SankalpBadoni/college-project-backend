import mongoose from "mongoose";

const liveProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 }, // Live Project Header
    problemStatement: { type: String, required: true, trim: true, maxlength: 500 },
    descriptionUrl: { type: String, trim: true }, // Uploaded LP Desc document
    
    // Ownership
    postedByModel: { type: String, enum: ["Employer", "Faculty"], required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "postedByModel" },
    sponsorType: { type: String, enum: ["Employer", "Faculty", "Industry Mandate"], default: "Employer" },
    
    // Enrollment Rules
    projectType: { type: String, enum: ["Individual", "Group"], required: true },
    maxPerGroup: { type: Number, min: 1, default: 1 },
    maxEnrollment: { type: Number, min: 1 },
    
    // Schedule
    dateStarting: { type: Date, required: true },
    lastDateForEnrollment: { type: Date, required: true },
    completionDate: { type: Date, required: true },
    
    // Financials
    creditsRequired: { type: Number, default: 0, min: 0 },
    stipend: {
      type: { type: String, enum: ["Unpaid", "Salary", "Out-of-pocket"], default: "Unpaid" },
      amount: { type: Number, default: 0 },
      currency: { type: String, default: "INR" }
    },
    
    // Selection Criteria
    selectionCriteria: {
      gender: { type: String, enum: ["None", "Male Only", "Female Only"], default: "None" },
      location: { type: String, enum: ["Employer Office", "Lab", "Offline", "WFH", "Others"], default: "WFH" },
      academicBackground: [{ type: String, trim: true }],
      academicYear: [{ type: Number }], // e.g. 3 for 3rd year
      mandatoryInfra: [{ type: String, trim: true }] // e.g. Phone, Camera
    },
    
    // Deliverables & Competencies
    completionCriteria: { type: String, trim: true },
    deliverable: { type: String, trim: true },
    industry: { type: mongoose.Schema.Types.ObjectId, ref: "Industry" },
    domain: { type: mongoose.Schema.Types.ObjectId, ref: "Domain" },
    competencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competency" }],
    
    // UI Metadata
    metadata: {
      coverImageUrl: { type: String, trim: true },
      bannerImageUrl: { type: String, trim: true },
      accentColor: { type: String, trim: true }
    },
    
    status: { type: String, enum: ["Draft", "Open", "Ongoing", "Completed"], default: "Open" }
  },
  { timestamps: true }
);

const LiveProject = mongoose.model("LiveProject", liveProjectSchema);
export default LiveProject;
