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
    profile: {
      collegeName: { type: String, required: true, trim: true },
      collegeId: { type: String, required: true, trim: true },
      studentId: { type: String, required: true, trim: true },
      courseName: { type: String, required: true, trim: true },
      yearOfCourse: { type: Number, required: true, min: 1, max: 6 }
    },
    credits: { type: Number, default: 0, min: 0 },
    preferredJobs: { type: [preferredJobSchema], default: [] },
    favoriteItems: { type: [studentProgramItemSchema], default: [] },
    competency: { type: [studentCompetencySchema], default: [] },
    careerTestLatestAttempt: { type: mongoose.Schema.Types.ObjectId, ref: "CareerTestAttempt" }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
