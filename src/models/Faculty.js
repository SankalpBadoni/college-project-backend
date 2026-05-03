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
    role: { type: String, default: "faculty", enum: ["faculty"] },
    
    professionalProfile: {
      describesBest: { type: String, required: true },
      otherDescription: { type: String, trim: true }
    },
    
    coursesOffered: { type: [courseOfferedSchema], default: [] },
    
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date }
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", facultySchema);
export default Faculty;
