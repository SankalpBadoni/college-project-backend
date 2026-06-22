import express from "express";
import * as assessmentController from "../controllers/assessmentController.js";
import * as applicantAssessmentController from "../controllers/applicantAssessmentController.js";
import * as employerAssessmentController from "../controllers/employerAssessmentController.js";
import { protectAccount as protect } from "../middleware/auth.js";
import {
  validateAssessmentSubmission,
  validateQuestionsQuery,
} from "../middleware/assessmentValidator.js";

const router = express.Router();

/**
 * Public routes (no authentication required for questions)
 */

// GET /api/assessment/questions
// Fetch all assessment questions grouped by section
router.get(
  "/questions",
  validateQuestionsQuery,
  assessmentController.getAssessmentQuestions
);

/**
 * Protected routes (authentication required)
 */

// POST /api/assessment/submit
// Submit assessment responses and calculate results
router.post(
  "/submit",
  protect,
  validateAssessmentSubmission,
  assessmentController.submitAssessment
);

// GET /api/assessment/results/:userId
// Get user's latest assessment results
router.get(
  "/results/:userId",
  protect,
  assessmentController.getAssessmentResults
);

// GET /api/assessment/history/:userId
// Get user's assessment history (paginated)
router.get(
  "/history/:userId",
  protect,
  assessmentController.getAssessmentHistory
);

// GET /api/assessment/check-completion/:userId
// Check if user has completed assessment
router.get(
  "/check-completion/:userId",
  protect,
  assessmentController.checkAssessmentCompletion
);

// DELETE /api/assessment/results/:responseId
// Delete assessment result
router.delete(
  "/results/:responseId",
  protect,
  assessmentController.deleteAssessmentResult
);

/**
 * Admin routes
 */

// GET /api/assessment/statistics
// Get overall assessment statistics
router.get(
  "/statistics",
  protect,
  assessmentController.getAssessmentStatistics
);

// GET /api/assessment/personality/:personality
// Get all users with specific personality type
router.get(
  "/personality/:personality",
  protect,
  assessmentController.getUsersByPersonality
);

/**
 * Applicant (Public) Routes for Employer Assessments
 */
router.get("/applicant/drive/:tokenNo", applicantAssessmentController.getDriveByToken);
router.post("/applicant/register", applicantAssessmentController.registerApplicant);
router.post("/applicant/submit", applicantAssessmentController.submitAssessment);

/**
 * Employer Routes for managing Assessment Drives
 */
router.post("/employer/drives", protect, employerAssessmentController.createDrive);
router.get("/employer/drives", protect, employerAssessmentController.getDrives);
router.get("/employer/drives/:id", protect, employerAssessmentController.getDriveDetails);

export default router;
