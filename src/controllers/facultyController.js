import Faculty from "../models/Faculty.js";
import Enrollment from "../models/Enrollment.js";
import Program from "../models/Program.js";

export const getFacultyDashboardData = async (req, res, next) => {
  try {
    const facultyId = req.user._id;

    // In a real application, you would aggregate these from actual databases.
    // Here we provide a mock/aggregated structure similar to what the frontend expects.

    const stats = {
      totalEnrolled: 1248, // e.g. await Enrollment.countDocuments({ "program.faculty": facultyId })
      activeCourses: 4,    // e.g. await Program.countDocuments({ faculty: facultyId, status: "Active" })
      liveProjects: 2,
      avgRating: 4.8
    };

    const recentEnrollments = [
      { id: 1, studentName: "Student Name A", course: "Advanced React Patterns", isNew: true },
      { id: 2, studentName: "Student Name B", course: "Advanced React Patterns", isNew: true },
      { id: 3, studentName: "Student Name C", course: "Advanced React Patterns", isNew: true }
    ];

    const upcomingSessions = [
      { id: 1, title: "System Design Masterclass", time: "10:00 AM - 11:30 AM • Virtual Meets", date: "Oct 21" },
      { id: 2, title: "System Design Masterclass", time: "10:00 AM - 11:30 AM • Virtual Meets", date: "Oct 22" }
    ];

    return res.json({
      stats,
      recentEnrollments,
      upcomingSessions
    });
  } catch (error) {
    return next(error);
  }
};
