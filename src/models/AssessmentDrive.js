import mongoose from "mongoose";

const assessmentDriveSchema = new mongoose.Schema(
  {
    employerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Employer", 
      required: true 
    },
    assessmentId: { 
      type: String, 
      required: true,
      default: "behavioral-assessment" 
    },
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    tokenNo: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    allowedEmails: { 
      type: [String], 
      default: [] 
    },
    status: { 
      type: String, 
      enum: ["active", "closed"], 
      default: "active" 
    }
  },
  { timestamps: true }
);

const AssessmentDrive = mongoose.model("AssessmentDrive", assessmentDriveSchema);
export default AssessmentDrive;
