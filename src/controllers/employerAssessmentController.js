import AssessmentDrive from "../models/AssessmentDrive.js";
import ApplicantAssessment from "../models/ApplicantAssessment.js";

// @desc    Create a new assessment drive
// @route   POST /api/assessment/employer/drives
// @access  Private (Employer)
export const createDrive = async (req, res, next) => {
  try {
    const { name, allowedEmails, assessmentId } = req.body;
    
    // Generate a unique token No (e.g. random alphanumeric 8 chars)
    const tokenNo = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Clean and validate emails
    const emails = allowedEmails
      ? allowedEmails.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e)
      : [];

    const drive = await AssessmentDrive.create({
      employerId: req.user._id, // Assuming auth middleware attaches user
      name,
      tokenNo,
      allowedEmails: emails,
      assessmentId: assessmentId || "behavioral-assessment",
    });

    res.status(201).json({ success: true, data: drive });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all drives for logged-in employer
// @route   GET /api/assessment/employer/drives
// @access  Private (Employer)
export const getDrives = async (req, res, next) => {
  try {
    const drives = await AssessmentDrive.find({ employerId: req.user._id }).sort({ createdAt: -1 });
    
    // Attach progress info to each drive
    const drivesWithStats = await Promise.all(
      drives.map(async (drive) => {
        const totalApplicants = drive.allowedEmails.length;
        const completedApplicants = await ApplicantAssessment.countDocuments({
          driveId: drive._id,
          status: "completed"
        });
        return {
          ...drive.toObject(),
          totalApplicants,
          completedApplicants
        };
      })
    );

    res.status(200).json({ success: true, data: drivesWithStats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get details and applicant stats for a specific drive
// @route   GET /api/assessment/employer/drives/:id
// @access  Private (Employer)
export const getDriveDetails = async (req, res, next) => {
  try {
    const drive = await AssessmentDrive.findOne({
      _id: req.params.id,
      employerId: req.user._id,
    });

    if (!drive) {
      return res.status(404).json({ success: false, message: "Drive not found" });
    }

    const applicants = await ApplicantAssessment.find({ driveId: drive._id });

    // Build a map of email to status
    const applicantMap = {};
    applicants.forEach((app) => {
      applicantMap[app.email.toLowerCase()] = app;
    });

    // Map all allowed emails to their status
    const stats = drive.allowedEmails.map((email) => {
      const e = email.toLowerCase();
      if (applicantMap[e]) {
        return {
          email: e,
          name: applicantMap[e].name,
          phone: applicantMap[e].phone,
          status: applicantMap[e].status, // "started" or "completed"
          optionCounts: applicantMap[e].optionCounts,
          createdAt: applicantMap[e].createdAt
        };
      } else {
        return {
          email: e,
          name: null,
          phone: null,
          status: "pending",
          optionCounts: null,
          createdAt: null
        };
      }
    });

    res.status(200).json({ success: true, data: { drive, stats } });
  } catch (error) {
    next(error);
  }
};
