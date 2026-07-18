import AssessmentResponse from "../models/AssessmentResponse.js";
import AssessmentQuestion from "../models/AssessmentQuestion.js";
import Student from "../models/Student.js";
import { Competency } from "../models/Competency.js";
import * as assessmentService from "../services/assessmentService.js";
import {
  calculateScores,
  calculatePercentages,
  determineDominantTypes,
  isMixedPersonality,
} from "../utils/scoringUtil.js";
import {
  generatePersonalityAnalysis,
  getCareerRecommendations,
  generateExecutiveSummary,
} from "../utils/personalityAnalysis.js";
import {
  PERSONALITY_COMPETENCY_MAP,
  generateRandomCompetencyScores,
} from "../utils/personalityCompetencyMap.js";

/**
 * GET /api/assessment/questions
 * Fetch all assessment questions grouped by section
 */
export const getAssessmentQuestions = async (req, res, next) => {
  try {
    const { section } = req.query;

    const result = await assessmentService.getAllQuestions(section);

    res.status(200).json({
      success: true,
      message: "Assessment questions retrieved successfully",
      data: result.data,
      totalQuestions: result.count,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/assessment/submit
 * Submit assessment responses and calculate results
 */
export const submitAssessment = async (req, res, next) => {
  try {
    const { userId, assessmentType = "career-profiler" } = req.body;

    // ══════════════════════════════════════════════
    // ──── TECHNICAL ASSESSMENT BRANCH ────
    // ══════════════════════════════════════════════
    if (assessmentType === "technical") {
      const { technicalResponses } = req.body;

      // 1. Fetch all active technical questions
      const techQuestions = await AssessmentQuestion.find({
        section: "technical",
        isActive: true,
      }).lean();

      // Build a lookup map: questionId → question
      const questionMap = {};
      techQuestions.forEach((q) => {
        questionMap[q.questionId] = q;
      });

      // 2. Grade responses and group by competencyTag
      const segmentStats = {}; // { "API Development": { correct: 0, total: 0 } }

      technicalResponses.forEach((r) => {
        const q = questionMap[r.questionId];
        if (!q) return;

        const tag = q.competencyTag || "Unknown";
        if (!segmentStats[tag]) {
          segmentStats[tag] = { correct: 0, total: 0 };
        }
        segmentStats[tag].total++;

        if (q.correctAnswer && r.selected.toUpperCase() === q.correctAnswer.toUpperCase()) {
          segmentStats[tag].correct++;
        }
      });

      // 3. Calculate percentage for each segment
      const technicalScoresMap = {};
      const competencyScoresArr = [];

      for (const [tag, stats] of Object.entries(segmentStats)) {
        const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        technicalScoresMap[tag] = pct;
        competencyScoresArr.push({ name: tag, score: pct });
      }

      // 4. Check if this is the student's FIRST technical assessment (for credits)
      const isFirstAssessment =
        !(await assessmentService.hasUserCompletedAssessment(userId, "technical"));

      // 5. Save to AssessmentResponse
      const responseData = {
        userId,
        assessmentType: "technical",
        technicalResponses,
        technicalScores: technicalScoresMap,
        status: "completed",
      };

      const savedResponse = await assessmentService.createOrUpdateResponse(
        userId,
        responseData
      );

      // 6. Award 1000 credits on FIRST technical assessment
      let creditsAwarded = 0;
      if (isFirstAssessment) {
        await Student.findByIdAndUpdate(userId, { $inc: { credits: 1000 } });
        creditsAwarded = 1000;
      }

      // 7. Merge competency scores into student.competency (non-destructive)
      const competencyNames = competencyScoresArr.map((c) => c.name);
      const competencyDocs = await Competency.find({
        name: { $in: competencyNames },
      }).lean();

      for (const cs of competencyScoresArr) {
        const doc = competencyDocs.find((d) => d.name === cs.name);
        if (!doc) continue;

        // Try to update existing competency entry
        const updateResult = await Student.updateOne(
          { _id: userId, "competency.competency": doc._id },
          { $set: { "competency.$.score": cs.score, "competency.$.lastUpdated": new Date() } }
        );

        // If no existing entry matched, push a new one
        if (updateResult.matchedCount === 0) {
          await Student.updateOne(
            { _id: userId },
            { $push: { competency: { competency: doc._id, score: cs.score, lastUpdated: new Date() } } }
          );
        }
      }

      // 8. Return structured response
      return res.status(200).json({
        success: true,
        message: "Technical assessment submitted successfully",
        data: {
          assessmentId: savedResponse._id,
          technicalScores: technicalScoresMap,
          competencyScores: competencyScoresArr,
          creditsAwarded,
          submittedAt: savedResponse.createdAt,
        },
      });
    }

    // ══════════════════════════════════════════════
    // ──── BEHAVIORAL / COMMUNICATION BRANCH ────
    // ══════════════════════════════════════════════
    const { strengthResponses, weaknessResponses } = req.body;

    // Calculate scores
    const scores = calculateScores(strengthResponses, weaknessResponses);

    // Calculate percentages
    const percentages = calculatePercentages(scores);

    // Determine dominant types
    const dominantInfo = determineDominantTypes(scores);
    const isMixed = isMixedPersonality(scores);

    // Generate analysis
    const analysis = generatePersonalityAnalysis(
      dominantInfo.dominantType,
      dominantInfo.secondaryType,
      percentages
    );

    // Get career recommendations
    const careerRecommendations = getCareerRecommendations(
      dominantInfo.dominantType,
      dominantInfo.secondaryType
    );

    // Prepare response data for storage
    const responseData = {
      userId,
      strengthResponses,
      weaknessResponses,
      scores,
      percentages,
      dominantType: dominantInfo.dominantType,
      secondaryType: dominantInfo.secondaryType,
      careerSuggestions: careerRecommendations.recommended,
      analysisDetails: {
        strengthAnalysis: analysis.dominantPersonality.summary,
        weaknessAnalysis: `Your secondary type is ${dominantInfo.secondaryType}, which provides balance.`,
        combinedAnalysis: analysis.blendedProfile.description,
      },
      status: "completed",
      assessmentType,
    };

    // Check if this is the student's FIRST assessment (for credits)
    const isFirstAssessment =
      !(await assessmentService.hasUserCompletedAssessment(userId, assessmentType));

    // Save to database
    const savedResponse = await assessmentService.createOrUpdateResponse(
      userId,
      responseData
    );

    // --- Award 1000 credits on FIRST assessment ---
    let creditsAwarded = 0;
    if (isFirstAssessment) {
      await Student.findByIdAndUpdate(userId, { $inc: { credits: 1000 } });
      creditsAwarded = 1000;
    }

    // --- Assign competency scores based on dominant personality ---
    const competencyScores = generateRandomCompetencyScores(
      dominantInfo.dominantType
    );
    const competencyNames = competencyScores.map((c) => c.name);
    const competencyDocs = await Competency.find({
      name: { $in: competencyNames },
    }).lean();

    const studentUpdatePayload = {};

    if (assessmentType === "communication") {
      studentUpdatePayload.communicationResult = {
        dominantType: dominantInfo.dominantType,
        secondaryType: dominantInfo.secondaryType,
        completedAt: new Date()
      };
    } else {
      studentUpdatePayload.assessmentResult = {
        dominantType: dominantInfo.dominantType,
        secondaryType: dominantInfo.secondaryType,
        completedAt: new Date()
      };
    }

    await Student.findByIdAndUpdate(userId, studentUpdatePayload);

    // Merge competency scores (non-destructive) instead of overwriting
    for (const cs of competencyScores) {
      const doc = competencyDocs.find((d) => d.name === cs.name);
      if (!doc) continue;

      const updateResult = await Student.updateOne(
        { _id: userId, "competency.competency": doc._id },
        { $set: { "competency.$.score": cs.score, "competency.$.lastUpdated": new Date() } }
      );

      if (updateResult.matchedCount === 0) {
        await Student.updateOne(
          { _id: userId },
          { $push: { competency: { competency: doc._id, score: cs.score, lastUpdated: new Date() } } }
        );
      }
    }

    // Generate executive summary
    const executiveSummary = generateExecutiveSummary(
      dominantInfo.dominantType,
      dominantInfo.secondaryType,
      percentages
    );

    res.status(200).json({
      success: true,
      message: "Assessment submitted successfully",
      data: {
        assessmentId: savedResponse._id,
        scores,
        percentages,
        dominantType: dominantInfo.dominantType,
        secondaryType: dominantInfo.secondaryType,
        isMixed,
        personalityAnalysis: {
          dominant: {
            type: analysis.dominantPersonality.type,
            summary: analysis.dominantPersonality.summary,
            strengths: analysis.dominantPersonality.strengths,
            weaknesses: analysis.dominantPersonality.weaknesses,
          },
          secondary: {
            type: analysis.secondaryPersonality.type,
            summary: analysis.secondaryPersonality.summary,
          },
          blend: analysis.blendedProfile,
        },
        careerSuggestions: careerRecommendations,
        executiveSummary,
        competencyScores,
        creditsAwarded,
        submittedAt: savedResponse.createdAt,
      },
    });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    next(error);
  }
};

/**
 * GET /api/assessment/results/:userId
 * Get user's latest assessment results
 */
export const getAssessmentResults = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { assessmentType = "career-profiler" } = req.query;

    // Check authorization (user can only access their own results)
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access this assessment",
      });
    }

    const response = await assessmentService.getUserLatestResponse(userId, assessmentType);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "No assessment found for this user",
      });
    }

    // Fetch student to get competency scores
    const student = await Student.findById(userId).populate("competency.competency");
    const competencyScores = student?.competency?.map(c => ({
      name: c.competency?.name || "",
      score: c.score
    })).filter(c => c.name) || [];

    if (response.assessmentType === "technical" || assessmentType === "technical") {
      const resultsData = {
        assessmentId: response._id,
        technicalScores: response.technicalScores || {},
        competencyScores,
        creditsAwarded: 0,
        submittedAt: response.createdAt,
        assessmentType: "technical"
      };

      return res.status(200).json({
        success: true,
        message: "Technical assessment results retrieved successfully",
        data: resultsData,
      });
    }

    // Generate personality analysis on the fly
    const analysis = generatePersonalityAnalysis(
      response.dominantType,
      response.secondaryType,
      response.percentages
    );

    // Build the formatted results matching the submit endpoint structure exactly!
    const resultsData = {
      assessmentId: response._id,
      scores: response.scores,
      percentages: response.percentages,
      dominantType: response.dominantType,
      secondaryType: response.secondaryType,
      personalityAnalysis: {
        dominant: {
          type: analysis.dominantPersonality.type,
          summary: analysis.dominantPersonality.summary,
          strengths: analysis.dominantPersonality.strengths,
          weaknesses: analysis.dominantPersonality.weaknesses,
        },
        secondary: {
          type: analysis.secondaryPersonality.type,
          summary: analysis.secondaryPersonality.summary,
        },
        blend: analysis.blendedProfile,
      },
      careerSuggestions: {
        recommended: response.careerSuggestions
      },
      competencyScores,
      creditsAwarded: 0,
      submittedAt: response.createdAt,
    };

    res.status(200).json({
      success: true,
      message: "Assessment results retrieved successfully",
      data: resultsData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assessment/history/:userId
 * Get user's assessment history
 */
export const getAssessmentHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 10, assessmentType = "career-profiler" } = req.query;

    // Check authorization
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access this assessment",
      });
    }

    const responses = await assessmentService.getUserResponses(userId, limit, assessmentType);

    res.status(200).json({
      success: true,
      message: "Assessment history retrieved successfully",
      data: responses,
      count: responses.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assessment/statistics
 * Get overall assessment statistics (admin only)
 */
export const getAssessmentStatistics = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can access statistics",
      });
    }

    const stats = await assessmentService.getAssessmentStatistics();

    res.status(200).json({
      success: true,
      message: "Assessment statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assessment/check-completion/:userId
 * Check if user has completed assessment
 */
export const checkAssessmentCompletion = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { assessmentType = "career-profiler" } = req.query;

    // Check authorization
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const completed =
      await assessmentService.hasUserCompletedAssessment(userId, assessmentType);

    res.status(200).json({
      success: true,
      data: {
        completed,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/assessment/results/:responseId
 * Delete assessment result (admin or owner only)
 */
export const deleteAssessmentResult = async (req, res, next) => {
  try {
    const { responseId } = req.params;

    // Get the response to check ownership
    const response = await assessmentService.getAssessmentResponseById(
      responseId
    );

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Assessment result not found",
      });
    }

    // Check authorization
    if (
      response.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this assessment",
      });
    }

    await assessmentService.deleteAssessmentResponse(responseId);

    res.status(200).json({
      success: true,
      message: "Assessment result deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assessment/personality/:personality
 * Get all users with a specific dominant personality (admin only)
 */
export const getUsersByPersonality = async (req, res, next) => {
  try {
    const { personality } = req.params;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can access this endpoint",
      });
    }

    const users = await AssessmentResponse.find({ dominantType: personality })
      .select("userId dominantType secondaryType scores createdAt")
      .populate("userId", "firstName lastName email")
      .limit(100);

    res.status(200).json({
      success: true,
      message: `Users with ${personality} personality type retrieved successfully`,
      data: users,
      count: users.length,
    });
  } catch (error) {
    next(error);
  }
};
