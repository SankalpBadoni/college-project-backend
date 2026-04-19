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
