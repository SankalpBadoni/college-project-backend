import mongoose from "mongoose";

/**
 * A student-submitted report flagging a problematic SensAI response.
 * Opened from the small "report" button on an assistant message.
 */
const aiChatReportSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "AiChatSession", required: true },
    messageId: { type: mongoose.Schema.Types.ObjectId },
    messageContent: { type: String, trim: true },
    reportText: { type: String, trim: true, required: true },
    status: {
      type: String,
      enum: ["open", "reviewed", "dismissed"],
      default: "open"
    }
  },
  { timestamps: true }
);

const AiChatReport = mongoose.model("AiChatReport", aiChatReportSchema);
export default AiChatReport;
