import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    jobPosting: { type: mongoose.Schema.Types.ObjectId, ref: "JobPosting" },
    jobApplication: { type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" },
    senderEmployer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },
    type: {
      type: String,
      enum: ["course_start", "recommendation", "payment", "general", "job_shortlist"],
      default: "general"
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    response: { type: String, enum: ["accepted", "rejected"] },
    responseAt: { type: Date },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
