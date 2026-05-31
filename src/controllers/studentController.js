import Student from "../models/Student.js";
import bcrypt from "bcryptjs";


export const getMyProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.student._id)
      .select("-password")
      .populate("careerTestLatestAttempt")
      .populate({
        path: "cartItems.program",
        populate: { path: "competencies", select: "name" }
      })
      .populate({
        path: "favoriteItems.program",
        populate: { path: "competencies", select: "name" }
      });

    return res.json(student);
  } catch (error) {
    return next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (updates.email) {
      const email = updates.email.toLowerCase().trim();
      updates.email = email;
      const exists = await Student.findOne({ email, _id: { $ne: req.student._id } });
      if (exists) {
        return res.status(400).json({ message: "Email is already taken by another student" });
      }
    }

    if (updates.password) {
      if (updates.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const student = await Student.findByIdAndUpdate(req.student._id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    return res.json({ message: "Profile updated", student });
  } catch (error) {
    return next(error);
  }
};

export const updatePreferredJobs = async (req, res, next) => {
  try {
    const { preferredJobs } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.student._id,
      { preferredJobs: preferredJobs || [] },
      { new: true, runValidators: true }
    ).select("-password");

    return res.json({ message: "Preferred jobs updated", preferredJobs: student.preferredJobs });
  } catch (error) {
    return next(error);
  }
};

export const getDashboardData = async (req, res, next) => {
  try {
    const studentId = req.student._id;
    const student = await Student.findById(studentId)
      .select("-password")
      .populate("competency.competency");

    // In a real application, calculate completionPercentage based on profile completeness or course progress
    const completionPercentage = 45; 
    
    // Determine job goal from preferredJobs if it exists
    const jobGoal = student.preferredJobs?.length > 0 ? student.preferredJobs[0].domain : 'Lead Software Engineer';

    // Mock response matching frontend dashboard expectations
    // Real implementation would join courses, enrollments, and jobs
    return res.json({
      student: {
        id: student._id,
        fullName: student.fullName,
        competencies: student.competency,
        jobGoal,
        completionPercentage
      },
      // In real scenario these would be fetched from Enrollment and Recommendation / JobPosting tables
      ongoingCourses: [], 
      recommendedCourses: [],
      matchedJobs: []
    });
  } catch (error) {
    return next(error);
  }
};
