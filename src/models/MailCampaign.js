import mongoose from "mongoose";

const mailCampaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    content: { type: String, required: true }, // HTML or text content
    recipientGroup: { 
      type: String, 
      required: true, 
      enum: ["Students", "Faculty", "Employers", "All Users"] 
    },
    templateType: {
      type: String,
      required: true,
      enum: ["Upcoming Courses", "New Courses This Fortnight", "New Learning Paths", "Placement Drives", "Custom"]
    },
    status: {
      type: String,
      enum: ["Sent", "Scheduled", "Draft"],
      default: "Sent"
    },
    scheduledAt: { type: Date },
    sentAt: { type: Date, default: Date.now },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    recipientCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const MailCampaign = mongoose.model("MailCampaign", mailCampaignSchema);
export default MailCampaign;
