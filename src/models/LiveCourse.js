import mongoose from "mongoose";

const liveCourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    
    // Cohort Rules
    minParticipantsToStart: { type: Number, default: 10, min: 1 },
    maxParticipants: { type: Number, default: 50 },
    enrolledCount: { type: Number, default: 0 },
    
    // Schedule
    enrollmentDeadline: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    
    // Live Class Details (Dummy implementation for now)
    liveMeetingUrl: { type: String, trim: true }, // e.g. Zoom link for the iframe
    
    // Ownership & Categorization
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    industry: { type: mongoose.Schema.Types.ObjectId, ref: "Industry" },
    domain: { type: mongoose.Schema.Types.ObjectId, ref: "Domain" },
    competencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competency" }],
    
    // Financials
    price: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "INR" },
    
    // UI Metadata
    metadata: {
      coverImageUrl: { type: String, trim: true },
      bannerImageUrl: { type: String, trim: true },
      accentColor: { type: String, trim: true }
    },
    
    status: { type: String, enum: ["Draft", "Enrolling", "Active", "Completed", "Cancelled"], default: "Enrolling" }
  },
  { timestamps: true }
);

const LiveCourse = mongoose.model("LiveCourse", liveCourseSchema);
export default LiveCourse;
