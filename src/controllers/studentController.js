import Student from "../models/Student.js";

export const getMyProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.student._id)
      .select("-password")
      .populate("careerTestLatestAttempt")
      .populate("cartItems.program")
      .populate("favoriteItems.program");

    return res.json(student);
  } catch (error) {
    return next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const updates = req.body;

    if (updates.password) {
      delete updates.password;
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
