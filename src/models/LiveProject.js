import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    groupId: { type: mongoose.Schema.Types.ObjectId },
    githubLink: { type: String, trim: true },
    demoLink: { type: String, trim: true },
    notes: { type: String, trim: true },
    files: [{ type: String, trim: true }],
    submittedAt: { type: Date, default: Date.now },
    score: { type: Number, default: 0, min: 0 },
    feedback: { type: String, trim: true },
    status: { type: String, enum: ["draft", "submitted", "reviewed", "needs_revision"], default: "submitted" }
  },
  { _id: true }
);

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dueDate: { type: Date, required: true },
    deliverable: { type: String, trim: true },
    submissions: { type: [submissionSchema], default: [] }
  },
  { _id: true }
);

const groupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true, trim: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const applicantSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    joinedAs: { type: String, enum: ["individual", "group"], default: "individual" },
    groupId: { type: mongoose.Schema.Types.ObjectId },
    note: { type: String, trim: true },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["applied", "shortlisted", "accepted", "rejected"], default: "applied" }
  },
  { _id: true }
);

const enrolledStudentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId },
    joinedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    latestScore: { type: Number, default: 0, min: 0 },
    lastSubmittedAt: { type: Date }
  },
  { _id: true }
);

const liveProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    shortDescription: { type: String, required: true, trim: true, maxlength: 300 },
    fullDescription: { type: String, required: true, trim: true },
    bannerImage: { type: String, trim: true },
    createdByModel: { type: String, enum: ["Faculty", "Employer"], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "createdByModel" },
    creatorRole: { type: String, enum: ["faculty", "employer"], required: true },
    employerLogo: { type: String, trim: true },
    companyName: { type: String, trim: true },
    hiringOpportunity: { type: Boolean, default: false },
    linkedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
    skillsRequired: [{ type: String, trim: true }],
    duration: { type: String, trim: true },
    projectType: { type: String, trim: true },
    mode: { type: String, enum: ["online", "offline", "hybrid"], default: "online" },
    allowGroup: { type: Boolean, default: true },
    allowIndividual: { type: Boolean, default: true },
    maxEnrollments: { type: Number, default: 100, min: 1 },
    milestones: { type: [milestoneSchema], default: [] },
    evaluationCriteria: [
      {
        title: { type: String, trim: true },
        weight: { type: Number, min: 0, max: 100 },
        description: { type: String, trim: true }
      }
    ],
    prerequisites: [{ type: String, trim: true }],
    toolsRequired: [{ type: String, trim: true }],
    deliverables: [{ type: String, trim: true }],
    deadline: { type: Date, required: true },
    applicants: { type: [applicantSchema], default: [] },
    enrolledStudents: { type: [enrolledStudentSchema], default: [] },
    groups: { type: [groupSchema], default: [] },
    status: { type: String, enum: ["draft", "open", "ongoing", "completed", "archived"], default: "open" }
  },
  { timestamps: true }
);

liveProjectSchema.index({ title: "text", shortDescription: "text", fullDescription: "text", companyName: "text", skillsRequired: "text" });

const LiveProject = mongoose.model("LiveProject", liveProjectSchema);

export { submissionSchema, milestoneSchema, groupSchema };
export default LiveProject;
