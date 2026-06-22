import AssessmentDrive from "../models/AssessmentDrive.js";
import ApplicantAssessment from "../models/ApplicantAssessment.js";
import AssessmentQuestion from "../models/AssessmentQuestion.js";

// @desc    Get drive details by tokenNo (public route for applicant)
// @route   GET /api/assessment/applicant/drive/:tokenNo
// @access  Public
export const getDriveByToken = async (req, res, next) => {
  try {
    const drive = await AssessmentDrive.findOne({ tokenNo: req.params.tokenNo }).populate("employerId", "companyName");
    
    if (!drive) {
      return res.status(404).json({ success: false, message: "Invalid or expired assessment link" });
    }
    
    if (drive.status !== "active") {
      return res.status(400).json({ success: false, message: "This assessment drive is closed." });
    }

    res.status(200).json({ 
      success: true, 
      data: {
        id: drive._id,
        name: drive.name,
        companyName: drive.employerId?.companyName || "Employer",
        assessmentId: drive.assessmentId
      } 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register an applicant for a drive
// @route   POST /api/assessment/applicant/register
// @access  Public
export const registerApplicant = async (req, res, next) => {
  try {
    const { tokenNo, name, email, phone } = req.body;
    
    const drive = await AssessmentDrive.findOne({ tokenNo });
    if (!drive || drive.status !== "active") {
      return res.status(400).json({ success: false, message: "Invalid or inactive assessment drive." });
    }

    const emailLower = email.trim().toLowerCase();

    // Verify email is in allowed list
    const isAllowed = drive.allowedEmails.some((e) => e.toLowerCase() === emailLower);
    if (!isAllowed) {
      return res.status(403).json({ success: false, message: "This email is not authorized to take this assessment." });
    }

    // Check if they already completed it
    const existing = await ApplicantAssessment.findOne({ driveId: drive._id, email: emailLower });
    if (existing && existing.status === "completed") {
      return res.status(400).json({ success: false, message: "You have already completed this assessment." });
    }

    let applicant;
    if (existing) {
      // Just update details if they started but didn't finish
      applicant = await ApplicantAssessment.findByIdAndUpdate(
        existing._id,
        { name, phone },
        { new: true }
      );
    } else {
      // Create new
      applicant = await ApplicantAssessment.create({
        driveId: drive._id,
        name,
        email: emailLower,
        phone,
        status: "started"
      });
    }

    res.status(200).json({ success: true, data: { applicantId: applicant._id } });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit applicant assessment
// @route   POST /api/assessment/applicant/submit
// @access  Public
export const submitAssessment = async (req, res, next) => {
  try {
    const { applicantId, responses } = req.body;
    
    const applicant = await ApplicantAssessment.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ success: false, message: "Applicant not found" });
    }

    if (applicant.status === "completed") {
      return res.status(400).json({ success: false, message: "Assessment already submitted" });
    }

    // Fetch all questions to map options to personalities
    const questions = await AssessmentQuestion.find({});
    const questionsMap = {};
    questions.forEach((q) => {
      questionsMap[`${q.section}-${q.questionId}`] = q;
    });

    // Count options by personality category
    const categoryCounts = { Lion: 0, Owl: 0, Dove: 0, Butterfly: 0 };
    
    if (responses && Array.isArray(responses)) {
      responses.forEach((r) => {
        const q = questionsMap[`${r.section}-${r.questionId}`];
        if (q) {
          const option = q.options.find((o) => o.code === r.selected);
          if (option && categoryCounts[option.personality] !== undefined) {
            categoryCounts[option.personality]++;
          }
        }
      });
    }

    applicant.responses = responses;
    applicant.categoryCounts = categoryCounts;
    applicant.status = "completed";

    await applicant.save();

    res.status(200).json({ success: true, message: "Assessment submitted successfully" });
  } catch (error) {
    next(error);
  }
};
