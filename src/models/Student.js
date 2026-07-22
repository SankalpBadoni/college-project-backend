import mongoose from "mongoose";

const preferredJobSchema = new mongoose.Schema(
  {
    industry: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const studentCompetencySchema = new mongoose.Schema(
  {
    competency: { type: mongoose.Schema.Types.ObjectId, ref: "Competency", required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now }
  },
  { _id: false }
);

const studentProgramItemSchema = new mongoose.Schema(
  {
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    addedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },
    role: { type: String, default: "student", enum: ["student"] },
    university: {
      universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
      branchId: { type: mongoose.Schema.Types.ObjectId }
    },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "UniversityDegree" },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    enrollmentYear: { type: Number },
    semester: { type: Number },
    profile: {
      collegeName: { type: String, required: true, trim: true },
      collegeId: { type: String, required: true, trim: true },
      studentId: { type: String, required: true, trim: true },
      courseName: { type: String, required: true, trim: true },
      yearOfCourse: { type: Number, required: true, min: 1, max: 6 },
      stream: { type: String, trim: true },
      gender: { type: String, enum: ["Male", "Female", "Other"], trim: true },
      careerIcon: { type: String, default: "💼" },
      dreamJobUrl: { type: String, default: "" }
    },
    profilePicture: { type: String, trim: true },
    credits: { type: Number, default: 0, min: 0 },
    preferredJobs: { type: [preferredJobSchema], default: [] },
    favoriteItems: { type: [studentProgramItemSchema], default: [] },
    competency: { type: [studentCompetencySchema], default: [] },
    strengths: {
      technical: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competency" }],
      behavioral: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competency" }]
    },
    weaknesses: {
      technical: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competency" }],
      behavioral: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competency" }]
    },
    careerTestLatestAttempt: { type: mongoose.Schema.Types.ObjectId, ref: "CareerTestAttempt" },
    assessmentResult: {
      dominantType: { type: String, enum: ["Butterfly", "Dove", "Lion", "Owl"] },
      secondaryType: { type: String, enum: ["Butterfly", "Dove", "Lion", "Owl"] },
      completedAt: { type: Date }
    },
    communicationResult: {
      dominantType: { type: String, enum: ["Butterfly", "Dove", "Lion", "Owl"] },
      secondaryType: { type: String, enum: ["Butterfly", "Dove", "Lion", "Owl"] },
      completedAt: { type: Date }
    }
  },
  { timestamps: true }
);

studentSchema.index({ "university.universityId": 1 });
studentSchema.index({ courseId: 1, departmentId: 1 });

const Student = mongoose.model("Student", studentSchema);
export default Student;
