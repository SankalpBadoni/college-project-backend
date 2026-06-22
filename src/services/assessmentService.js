import AssessmentQuestion from "../models/AssessmentQuestion.js";
import AssessmentResponse from "../models/AssessmentResponse.js";
import { ASSESSMENT_SECTIONS } from "../utils/assessmentConstants.js";

/**
 * Get all assessment questions, optionally filtered by section
 * @param {String} section - Optional section filter ("strengths" or "weaknesses")
 * @returns {Promise<Array>} Assessment questions
 */
export const getAllQuestions = async (section = null) => {
  try {
    let query = AssessmentQuestion.find({ isActive: true });

    if (section) {
      query = query.where("section").equals(section);
    }

    const questions = await query.sort({ section: 1, questionId: 1 }).lean();

    return {
      success: true,
      data: groupQuestionsBySection(questions),
      count: questions.length,
    };
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

/**
 * Get questions grouped by section
 * @param {Array} questions - Questions array
 * @returns {Object} Questions grouped by section
 */
const groupQuestionsBySection = (questions) => {
  const grouped = {
    strengths: [],
    weaknesses: [],
    communication: [],
  };

  questions.forEach((question) => {
    if (question.section === ASSESSMENT_SECTIONS.STRENGTHS) {
      grouped.strengths.push(question);
    } else if (question.section === ASSESSMENT_SECTIONS.WEAKNESSES) {
      grouped.weaknesses.push(question);
    } else if (question.section === ASSESSMENT_SECTIONS.COMMUNICATION || question.section === "communication") {
      grouped.communication.push(question);
    }
  });

  return grouped;
};

/**
 * Get single question by ID
 * @param {Number} questionId - Question ID
 * @param {String} section - Section
 * @returns {Promise<Object>} Question object
 */
export const getQuestionById = async (questionId, section) => {
  try {
    const question = await AssessmentQuestion.findOne({
      questionId,
      section,
      isActive: true,
    }).lean();

    return question;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

/**
 * Save assessment response
 * @param {Object} responseData - Response data with userId, answers, scores
 * @returns {Promise<Object>} Saved response
 */
export const saveAssessmentResponse = async (responseData) => {
  try {
    const response = new AssessmentResponse(responseData);
    const saved = await response.save();
    return saved;
  } catch (error) {
    console.error("Error saving assessment response:", error);
    throw error;
  }
};

/**
 * Get assessment response by ID
 * @param {String} responseId - Response ID
 * @returns {Promise<Object>} Assessment response
 */
export const getAssessmentResponseById = async (responseId) => {
  try {
    const response = await AssessmentResponse.findById(responseId)
      .populate("userId", "firstName lastName email")
      .lean();

    return response;
  } catch (error) {
    console.error("Error fetching assessment response:", error);
    throw error;
  }
};

/**
 * Get user's latest assessment response
 * @param {String} userId - User ID
 * @param {String} assessmentType - Assessment type (career-profiler or communication)
 * @returns {Promise<Object>} Latest assessment response
 */
export const getUserLatestResponse = async (userId, assessmentType = "career-profiler") => {
  try {
    const response = await AssessmentResponse.findOne({ userId, assessmentType })
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName email")
      .lean();

    return response;
  } catch (error) {
    console.error("Error fetching user assessment response:", error);
    throw error;
  }
};

/**
 * Get all user assessment responses
 * @param {String} userId - User ID
 * @param {Number} limit - Limit results
 * @param {String} assessmentType - Assessment type
 * @returns {Promise<Array>} Assessment responses
 */
export const getUserResponses = async (userId, limit = 10, assessmentType = "career-profiler") => {
  try {
    const responses = await AssessmentResponse.find({ userId, assessmentType })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("dominantType secondaryType scores percentages createdAt")
      .lean();

    return responses;
  } catch (error) {
    console.error("Error fetching user responses:", error);
    throw error;
  }
};

/**
 * Update assessment response
 * @param {String} responseId - Response ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated response
 */
export const updateAssessmentResponse = async (responseId, updateData) => {
  try {
    const response = await AssessmentResponse.findByIdAndUpdate(
      responseId,
      updateData,
      { new: true, runValidators: true }
    );

    return response;
  } catch (error) {
    console.error("Error updating assessment response:", error);
    throw error;
  }
};

/**
 * Delete assessment response
 * @param {String} responseId - Response ID
 * @returns {Promise<Object>} Deleted response
 */
export const deleteAssessmentResponse = async (responseId) => {
  try {
    const response = await AssessmentResponse.findByIdAndDelete(responseId);
    return response;
  } catch (error) {
    console.error("Error deleting assessment response:", error);
    throw error;
  }
};

/**
 * Get assessment statistics
 * @returns {Promise<Object>} Statistics
 */
export const getAssessmentStatistics = async () => {
  try {
    const totalResponses = await AssessmentResponse.countDocuments();
    const totalUsers = await AssessmentResponse.distinct("userId").length;
    const uniqueUsers = await AssessmentResponse.find().distinct("userId");

    const personalityDistribution = await AssessmentResponse.aggregate([
      {
        $group: {
          _id: "$dominantType",
          count: { $sum: 1 },
          percentage: {
            $divide: [
              { $sum: 1 },
              {
                $literal: totalResponses,
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          personality: "$_id",
          count: 1,
          percentage: {
            $multiply: ["$percentage", 100],
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const averageScores = await AssessmentResponse.aggregate([
      {
        $group: {
          _id: null,
          avgButterfly: { $avg: "$scores.butterfly" },
          avgDove: { $avg: "$scores.dove" },
          avgLion: { $avg: "$scores.lion" },
          avgOwl: { $avg: "$scores.owl" },
        },
      },
    ]);

    return {
      totalResponses,
      totalUniqueUsers: uniqueUsers.length,
      personalityDistribution: personalityDistribution.map((p) => ({
        ...p,
        percentage: parseFloat(p.percentage.toFixed(2)),
      })),
      averageScores: averageScores[0] || {},
    };
  } catch (error) {
    console.error("Error getting statistics:", error);
    throw error;
  }
};

/**
 * Check if user has already completed assessment
 * @param {String} userId - User ID
 * @param {String} assessmentType - Assessment type
 * @returns {Promise<Boolean>} True if completed
 */
export const hasUserCompletedAssessment = async (userId, assessmentType = "career-profiler") => {
  try {
    const response = await AssessmentResponse.findOne({
      userId,
      assessmentType,
      status: "completed",
    });

    return !!response;
  } catch (error) {
    console.error("Error checking assessment completion:", error);
    throw error;
  }
};

/**
 * Create or update assessment response
 * @param {String} userId - User ID
 * @param {Object} responseData - Response data
 * @returns {Promise<Object>} Saved response
 */
export const createOrUpdateResponse = async (userId, responseData) => {
  try {
    // Check if user has existing response for this assessmentType
    const assessmentType = responseData.assessmentType || "career-profiler";
    const existing = await AssessmentResponse.findOne({ userId, assessmentType });

    if (existing) {
      // Update existing
      return await AssessmentResponse.findByIdAndUpdate(
        existing._id,
        {
          ...responseData,
          userId,
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      return await saveAssessmentResponse({
        ...responseData,
        userId,
      });
    }
  } catch (error) {
    console.error("Error creating or updating response:", error);
    throw error;
  }
};
