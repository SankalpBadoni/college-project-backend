import Notification from "../models/Notification.js";
import Enrollment from "../models/Enrollment.js";
import JobApplication from "../models/JobApplication.js";
import JobPosting from "../models/JobPosting.js";
import Employer from "../models/Employer.js";
import { sendEmail } from "../utils/sendEmail.js";
import { buildEmployerResponseEmail } from "../utils/notificationEmailTemplates.js";

export const listNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ student: req.student._id })
      .populate("jobPosting", "title companyName postingType employmentType location workMode status isActive")
      .populate("jobApplication", "status createdAt updatedAt")
      .sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (error) {
    return next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, student: req.student._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    return next(error);
  }
};

export const respondToNotification = async (req, res, next) => {
  try {
    const response = String(req.body.response || "").toLowerCase().trim();
    const acceptedResponses = new Set(["accepted", "accept"]);
    const rejectedResponses = new Set(["rejected", "reject"]);

    if (!acceptedResponses.has(response) && !rejectedResponses.has(response)) {
      return res.status(400).json({ message: "Response must be accepted or rejected" });
    }

    const notification = await Notification.findOne({
      _id: req.params.notificationId,
      student: req.student._id,
      type: { $in: ["job_shortlist", "job_offer"] }
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const isOffer = notification.type === "job_offer";
    const isAccepted = acceptedResponses.has(response);

    notification.response = isAccepted ? "accepted" : "rejected";
    notification.responseAt = new Date();
    notification.read = true;
    await notification.save();

    const jobApplication = notification.jobApplication
      ? await JobApplication.findById(notification.jobApplication)
      : await JobApplication.findOne({ student: req.student._id, jobPosting: notification.jobPosting || notification.metadata?.jobPostingId });

    if (jobApplication) {
      if (isOffer) {
        jobApplication.status = isAccepted ? "hired" : "rejected";
      } else {
        jobApplication.status = isAccepted ? "shortlisted" : "rejected";
      }
      await jobApplication.save();
      notification.jobApplication = jobApplication._id;
      await notification.save();
    }

    const postingId = notification.jobPosting || notification.metadata?.jobPostingId;
    let jobPosting = null;
    if (postingId) {
      jobPosting = await JobPosting.findById(postingId);
      if (jobPosting) {
        const shortlistedMap = new Map(
          (jobPosting.shortlistedStudents || []).map((item) => [String(item.student), item])
        );
        const existing = shortlistedMap.get(String(req.student._id));
        if (existing) {
          if (isOffer) {
            existing.status = isAccepted ? "hired" : "rejected";
          } else {
            existing.status = isAccepted ? "interview_scheduled" : "rejected";
          }
          shortlistedMap.set(String(req.student._id), existing);
          jobPosting.shortlistedStudents = Array.from(shortlistedMap.values());
          await jobPosting.save();
        }

        const employerId = notification.senderEmployer || notification.metadata?.employerId || jobPosting.employer;
        if (employerId) {
          const studentName = req.student.fullName || `${req.student.firstName || ""} ${req.student.lastName || ""}`.trim() || "Student";
          let titleText = `Candidate Response: ${jobPosting.title || "Job Posting"}`;
          let messageText = `${studentName} has ${isAccepted ? "accepted the interview scheduled" : "rejected the interview/shortlist invitation"} for ${jobPosting.title || "the position"}.`;

          if (isOffer) {
            titleText = isAccepted ? `🎉 Offer Accepted: ${jobPosting.title}` : `❌ Offer Declined: ${jobPosting.title}`;
            messageText = isAccepted
              ? `🎉 ${studentName} accepted your hiring offer for ${jobPosting.title} and is ready to join!`
              : `${studentName} declined your hiring offer for ${jobPosting.title}.`;
          }

          await Notification.create({
            recipientType: "employer",
            recipientEmployer: employerId,
            student: req.student._id,
            jobPosting: jobPosting._id,
            jobApplication: jobApplication?._id,
            type: "general",
            title: titleText,
            message: messageText,
            read: false,
            metadata: {
              studentId: String(req.student._id),
              jobPostingId: String(jobPosting._id),
              response: isAccepted ? "accepted" : "rejected",
              isOffer
            }
          });

          const employerAccount = await Employer.findById(employerId).select("companyName contactPerson.name contactPerson.email").lean();
          if (employerAccount?.contactPerson?.email) {
            const emailPayload = buildEmployerResponseEmail({
              studentName,
              posting: jobPosting,
              isOffer,
              isAccepted
            });

            sendEmail({
              to: employerAccount.contactPerson.email,
              subject: emailPayload.subject,
              html: emailPayload.html
            }).catch((error) => {
              console.error("Failed to send employer response email:", error);
            });
          }
        }
      }
    }

    return res.json({
      message: "Notification response saved",
      notification,
      jobApplication: jobApplication || null
    });
  } catch (error) {
    return next(error);
  }
};

export const generateCourseStartNotifications = async (req, res, next) => {
  try {
    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const enrollments = await Enrollment.find({ student: req.student._id, status: "booked" }).populate("program");

    const notifications = [];
    for (const enr of enrollments) {
      const start = enr.program?.startDate ? new Date(enr.program.startDate) : null;
      if (start && start >= now && start <= in48Hours) {
        notifications.push({
          student: req.student._id,
          type: "course_start",
          title: "Program starting soon",
          message: `${enr.program.title} starts on ${start.toISOString()}`,
          metadata: { programId: enr.program._id }
        });
      }
    }

    if (notifications.length) {
      await Notification.insertMany(notifications);
    }

    return res.json({
      message: "Start notifications generated",
      count: notifications.length
    });
  } catch (error) {
    return next(error);
  }
};
