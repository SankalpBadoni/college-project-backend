import { ERROR_MESSAGES, ASSESSMENT_CONFIG } from "../utils/assessmentConstants.js";

/**
 * Validate assessment submission request
 */
export const validateAssessmentSubmission = (req, res, next) => {
  const { userId, assessmentType } = req.body;

  // Check required fields
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  // ── Technical assessment branch ──
  if (assessmentType === "technical") {
    const { technicalResponses } = req.body;

    if (!technicalResponses || !Array.isArray(technicalResponses)) {
      return res.status(400).json({
        success: false,
        message: "technicalResponses must be an array",
      });
    }

    if (technicalResponses.length !== 30) {
      return res.status(400).json({
        success: false,
        message: "All 30 technical questions must be answered",
        answered: technicalResponses.length,
        required: 30,
      });
    }

    // Validate individual responses
    const techIds = new Set();
    for (const response of technicalResponses) {
      if (!response.questionId || response.questionId === undefined) {
        return res.status(400).json({
          success: false,
          message: "Each response must have questionId",
        });
      }

      if (!response.selected || !response.selected.trim()) {
        return res.status(400).json({
          success: false,
          message: "Each response must have selected option (A, B, C, or D)",
        });
      }

      if (!ASSESSMENT_CONFIG.OPTIONS.includes(response.selected.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_OPTION,
        });
      }

      if (techIds.has(response.questionId)) {
        return res.status(400).json({
          success: false,
          message: `Duplicate technical response for question ${response.questionId}`,
        });
      }
      techIds.add(response.questionId);
    }

    return next();
  }

  // ── Behavioral / Communication assessment branch (existing logic) ──
  const { strengthResponses, weaknessResponses } = req.body;

  if (!strengthResponses || !Array.isArray(strengthResponses)) {
    return res.status(400).json({
      success: false,
      message: "strengthResponses must be an array",
    });
  }

  if (!weaknessResponses || !Array.isArray(weaknessResponses)) {
    return res.status(400).json({
      success: false,
      message: "weaknessResponses must be an array",
    });
  }

  // Validate individual responses
  const allResponses = [...strengthResponses, ...weaknessResponses];

  for (const response of allResponses) {
    if (!response.questionId || response.questionId === undefined) {
      return res.status(400).json({
        success: false,
        message: "Each response must have questionId",
      });
    }

    if (!response.selected || !response.selected.trim()) {
      return res.status(400).json({
        success: false,
        message: "Each response must have selected option (A, B, C, or D)",
      });
    }

    if (!ASSESSMENT_CONFIG.OPTIONS.includes(response.selected.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_OPTION,
      });
    }
  }

  // Validate completeness
  if (strengthResponses.length !== ASSESSMENT_CONFIG.TOTAL_STRENGTHS_QUESTIONS) {
    return res.status(400).json({
      success: false,
      message: `All ${ASSESSMENT_CONFIG.TOTAL_STRENGTHS_QUESTIONS} strength questions must be answered`,
      answered: strengthResponses.length,
      required: ASSESSMENT_CONFIG.TOTAL_STRENGTHS_QUESTIONS,
    });
  }

  if (weaknessResponses.length !== ASSESSMENT_CONFIG.TOTAL_WEAKNESSES_QUESTIONS) {
    return res.status(400).json({
      success: false,
      message: `All ${ASSESSMENT_CONFIG.TOTAL_WEAKNESSES_QUESTIONS} weakness questions must be answered`,
      answered: weaknessResponses.length,
      required: ASSESSMENT_CONFIG.TOTAL_WEAKNESSES_QUESTIONS,
    });
  }

  // Validate no duplicate question IDs within the same section
  const strengthIds = new Set();
  const weaknessIds = new Set();

  for (const response of strengthResponses) {
    if (strengthIds.has(response.questionId)) {
      return res.status(400).json({
        success: false,
        message: `Duplicate strength response for question ${response.questionId}`,
      });
    }
    strengthIds.add(response.questionId);
  }

  for (const response of weaknessResponses) {
    if (weaknessIds.has(response.questionId)) {
      return res.status(400).json({
        success: false,
        message: `Duplicate weakness response for question ${response.questionId}`,
      });
    }
    weaknessIds.add(response.questionId);
  }

  next();
};

/**
 * Validate question fetching query parameters
 */
export const validateQuestionsQuery = (req, res, next) => {
  const { section } = req.query;

  if (section && !["strengths", "weaknesses", "communication", "technical"].includes(section)) {
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_SECTION,
    });
  }

  next();
};

/**
 * Validate ObjectId
 */
export const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Generic error handler for assessment routes
 */
export const assessmentErrorHandler = (err, req, res, next) => {
  console.error("Assessment Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
