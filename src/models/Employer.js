import mongoose from "mongoose";

const employerSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    divisionDept: { type: String, required: true, trim: true },
    
    approvingAuthority: {
      name: { type: String, required: true, trim: true },
      dept: { type: String, required: true, trim: true }
    },
    
    contactPerson: {
      name: { type: String, required: true, trim: true },
      dept: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true }
    },
    
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "employer", enum: ["employer"] },
    
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date }
  },
  { timestamps: true }
);

const Employer = mongoose.model("Employer", employerSchema);
export default Employer;
