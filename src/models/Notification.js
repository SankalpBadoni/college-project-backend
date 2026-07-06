import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientType: { type: String, enum: ["student", "employer"], default: "student" },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: function () {
        return this.recipientType === "student" || !this.recipientType;
      }
    },
    recipientEmployer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },
    jobPosting: { type: mongoose.Schema.Types.ObjectId, ref: "JobPosting" },
    jobApplication: { type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" },
    senderEmployer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },
    type: {
      type: String,
      enum: ["course_start", "recommendation", "payment", "general", "job_shortlist", "job_offer"],
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
