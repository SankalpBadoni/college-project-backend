import mongoose from "mongoose";

const courseOfferedSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Behavioral", "Technical", "Others"], required: true },
    name: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    relevantIndustries: { type: String, default: "All" },
    previousDelivery: { type: String, trim: true },
    targetStudents: { type: String, enum: ["1 Year", "2 Year", "3 Year", "4 Year"], default: "1 Year" },
    stream: { type: String, default: "All" }
  },
  { _id: false }
);

const facultySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    role: { type: String, default: "faculty", enum: ["faculty", "professor"] },
    university: {
      universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
      branchId: { type: mongoose.Schema.Types.ObjectId }
    },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    designation: { type: String, trim: true },
    employeeId: { type: String, trim: true },
    profilePicture: { type: String, trim: true },
    
    professionalProfile: {
      describesBest: { type: String, required: true },
      otherDescription: { type: String, trim: true }
    },

    profile: {
      headline: { type: String, trim: true },
      bio: { type: String, trim: true },
      website: { type: String, trim: true },
      linkedinUrl: { type: String, trim: true },
      officeHours: { type: String, trim: true }
    },
    
    coursesOffered: { type: [courseOfferedSchema], default: [] },

    ratingSummary: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
      stars: { type: [Number], default: [] }
    },
    
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date }
  },
  { timestamps: true }
);

facultySchema.index({ "university.universityId": 1, departmentId: 1 });

const Faculty = mongoose.model("Faculty", facultySchema);
export default Faculty;
