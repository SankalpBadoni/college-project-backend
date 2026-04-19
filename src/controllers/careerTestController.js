import CareerTestTemplate from "../models/CareerTestTemplate.js";
import CareerTestAttempt from "../models/CareerTestAttempt.js";
import Student from "../models/Student.js";
import { computeCompetencyScores } from "../utils/careerTest.js";

export const getActiveCareerTest = async (req, res, next) => {
  try {
    const test = await CareerTestTemplate.findOne({ active: true });
    if (!test) {
      return res.status(404).json({ message: "No active career test found" });
    }

    return res.json(test);
  } catch (error) {
    return next(error);
  }
};

export const submitCareerTest = async (req, res, next) => {
  try {
    const { templateId, answers } = req.body;
    const template = await CareerTestTemplate.findById(templateId);

    if (!template) {
      return res.status(404).json({ message: "Career test template not found" });
    }

    const result = computeCompetencyScores(template, answers || []);

    const attempt = await CareerTestAttempt.create({
      student: req.student._id,
      template: template._id,
      answers: answers || [],
      competencyScores: result.scores,
      spiderWebData: result.spiderWebData
    });

    await Student.findByIdAndUpdate(req.student._id, { careerTestLatestAttempt: attempt._id });

    return res.status(201).json({
      message: "Career test submitted",
      attemptId: attempt._id,
      competencyScores: result.scores,
      spiderWebData: result.spiderWebData
    });
  } catch (error) {
    return next(error);
  }
};

export const getMyCareerAnalysis = async (req, res, next) => {
  try {
    const attempts = await CareerTestAttempt.find({ student: req.student._id }).sort({ createdAt: -1 });
    if (!attempts.length) {
      return res.status(404).json({ message: "No career test attempts found" });
    }

    const latest = attempts[0];
    const rawScores = latest.competencyScores;
    const scoreObject =
      rawScores && typeof rawScores.entries === "function"
        ? Object.fromEntries(rawScores.entries())
        : rawScores || {};
    const entries = Object.entries(scoreObject);

    const strong = [...entries].sort((a, b) => b[1] - a[1]).slice(0, 3);
    const weak = [...entries].sort((a, b) => a[1] - b[1]).slice(0, 3);

    return res.json({
      latestAttempt: latest,
      strengths: strong,
      weaknesses: weak,
      spiderWebData: latest.spiderWebData
    });
  } catch (error) {
    return next(error);
  }
};
