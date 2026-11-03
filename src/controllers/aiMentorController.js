import AiChatSession from "../models/AiChatSession.js";
import AiChatReport from "../models/AiChatReport.js";
import Student from "../models/Student.js";
import {
  buildStudentContext,
  buildCandidateCatalog,
  buildSystemPrompt,
  buildGreetingMessages,
  streamChatCompletion,
  resolveRecommendations
} from "../services/sensaiService.js";

/* List all of the student's conversations (sidebar) */
const REC_TAG_FOR_PREVIEW = /\[\[rec:(course|project|internship|job):[a-fA-F0-9]{24}\]\]/g;

export const listSessions = async (req, res, next) => {
  try {
    const sessions = await AiChatSession.find({ student: req.student._id })
      .select("title lastMessageAt createdAt messages")
      .sort({ lastMessageAt: -1 })
      .lean();

    const withPreview = sessions.map((s) => {
      const lastMessage = s.messages?.[s.messages.length - 1];
      const preview = lastMessage
        ? lastMessage.content.replace(REC_TAG_FOR_PREVIEW, "").trim().slice(0, 90)
        : "";
      return {
        _id: s._id,
        title: s.title,
        lastMessageAt: s.lastMessageAt,
        createdAt: s.createdAt,
        preview,
        lastRole: lastMessage?.role
      };
    });

    return res.json(withPreview);
  } catch (error) {
    return next(error);
  }
};

/* Create a new conversation and seed it with the scripted Touchpoint-1 greeting */
export const createSession = async (req, res, next) => {
  try {
    const rawStudent = await Student.findById(req.student._id).lean();
    const studentContext = await buildStudentContext(req.student._id);
    const greetingMessages = buildGreetingMessages(studentContext || { fullName: rawStudent?.fullName });

    const session = await AiChatSession.create({
      student: req.student._id,
      title: "New conversation",
      messages: greetingMessages.map((m) => ({
        role: "assistant",
        content: m.content,
        recommendations: [],
        intro: true,
        options: m.options || []
      })),
      lastMessageAt: new Date()
    });

    return res.status(201).json(session);
  } catch (error) {
    return next(error);
  }
};

/* Fetch a single conversation in full */
export const getSession = async (req, res, next) => {
  try {
    const session = await AiChatSession.findOne({ _id: req.params.id, student: req.student._id }).lean();
    if (!session) return res.status(404).json({ message: "Conversation not found" });
    return res.json(session);
  } catch (error) {
    return next(error);
  }
};

/* Delete a conversation */
export const deleteSession = async (req, res, next) => {
  try {
    const result = await AiChatSession.deleteOne({ _id: req.params.id, student: req.student._id });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Conversation not found" });
    return res.json({ message: "Conversation deleted" });
  } catch (error) {
    return next(error);
  }
};

/* The core streaming chat endpoint — Server-Sent Events */
export const chat = async (req, res, next) => {
  try {
    const { sessionId, message, intent } = req.body;
    if (!sessionId || !message || !message.trim()) {
      return res.status(400).json({ message: "sessionId and message are required" });
    }

    const session = await AiChatSession.findOne({ _id: sessionId, student: req.student._id });
    if (!session) return res.status(404).json({ message: "Conversation not found" });

    const rawStudent = await Student.findById(req.student._id).lean();
    const studentContext = await buildStudentContext(req.student._id);
    const { catalogMap, catalogForPrompt } = await buildCandidateCatalog(rawStudent);

    // Optional focus from a clicked option: limit what the model may recommend.
    const INTENT_CATALOG_KEY = { projects: "liveProjects", courses: "courses", internships: "jobsAndInternships" };
    const INTENT_LABEL = { projects: "live projects", courses: "courses", internships: "internships" };
    let promptCatalog = catalogForPrompt;
    let intentInstruction = "";
    if (intent && INTENT_CATALOG_KEY[intent]) {
      const key = INTENT_CATALOG_KEY[intent];
      let items = catalogForPrompt[key] || [];
      if (intent === "internships") items = items.filter((i) => i.itemType === "internship");
      promptCatalog = { [key]: items };
      intentInstruction = `\n\nFOCUS FOR THIS REPLY: The student asked for ${INTENT_LABEL[intent]}. Recommend the 2 to 3 best-fit ${INTENT_LABEL[intent]} ONLY from the catalog section "${key}" below, each with a [[rec:...]] tag and a clear "why this fits you" reason. If that section is empty, say so kindly and suggest what the student could look at instead.`;
    }
    const systemPrompt = buildSystemPrompt(studentContext, promptCatalog) + intentInstruction;

    const history = session.messages.map((m) => ({ role: m.role, content: m.content }));

    // Save the user's message immediately
    session.messages.push({ role: "user", content: message.trim() });
    if (session.title === "New conversation") {
      session.title = message.trim().slice(0, 60);
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    });

    const sendEvent = (event, data) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Let the frontend know about catalog items up-front so it can render
    // rich recommendation cards the moment a [[rec:...]] tag streams in.
    sendEvent("catalog", { items: catalogForPrompt });

    let fullText = "";
    try {
      for await (const delta of streamChatCompletion({ systemPrompt, history, userMessage: message.trim() })) {
        fullText += delta;
        sendEvent("delta", { text: delta });
      }
    } catch (streamError) {
      sendEvent("error", { message: "SensAI had trouble responding. Please try again." });
      await session.save();
      return res.end();
    }

    const recommendations = resolveRecommendations(fullText, catalogMap);
    session.messages.push({ role: "assistant", content: fullText, recommendations });
    session.lastMessageAt = new Date();
    await session.save();

    const savedAssistantMessage = session.messages[session.messages.length - 1];
    sendEvent("done", {
      messageId: savedAssistantMessage._id,
      recommendations,
      sessionTitle: session.title
    });
    return res.end();
  } catch (error) {
    if (!res.headersSent) {
      return next(error);
    }
    try {
      res.write(`event: error\ndata: ${JSON.stringify({ message: "Something went wrong." })}\n\n`);
      res.end();
    } catch (_) {
      // response already closed
    }
    return undefined;
  }
};

/* Report button -> modal submit */
export const reportMessage = async (req, res, next) => {
  try {
    const { sessionId, messageId, reportText } = req.body;
    if (!sessionId || !reportText || !reportText.trim()) {
      return res.status(400).json({ message: "sessionId and reportText are required" });
    }

    const session = await AiChatSession.findOne({ _id: sessionId, student: req.student._id });
    if (!session) return res.status(404).json({ message: "Conversation not found" });

    const targetMessage = messageId ? session.messages.id(messageId) : null;
    if (targetMessage) targetMessage.reported = true;

    await AiChatReport.create({
      student: req.student._id,
      session: session._id,
      messageId: targetMessage?._id,
      messageContent: targetMessage?.content,
      reportText: reportText.trim()
    });

    await session.save();
    return res.status(201).json({ message: "Report submitted. Thank you for the feedback." });
  } catch (error) {
    return next(error);
  }
};
