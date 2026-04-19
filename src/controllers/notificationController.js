import Notification from "../models/Notification.js";
import Enrollment from "../models/Enrollment.js";

export const listNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ student: req.student._id }).sort({ createdAt: -1 });
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
