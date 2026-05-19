import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { 
      type: String, 
      required: true, 
      enum: ["dean", "university_admin", "employu_team"],
      default: "university_admin"
    },
    college: { type: String, trim: true }, // e.g. "Delhi Technological University", for dean/uni admin
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
