import {
  ASSESSMENT_CONFIG,
  ASSESSMENT_SECTIONS,
} from "./assessmentConstants.js";

/**
 * Calculate personality scores based on user responses
 * @param {Array} strengthResponses - Array of strength question responses
 * @param {Array} weaknessResponses - Array of weakness question responses
 * @returns {Object} Scores object with counts for each personality
 */
export const calculateScores = (strengthResponses, weaknessResponses) => {
  const scores = {
    butterfly: 0,
    dove: 0,
    lion: 0,
    owl: 0,
  };

  // Process strength responses
  strengthResponses.forEach((response) => {
    const personality = mapOptionToPersonality(response.selected);
    scores[personality.toLowerCase()]++;
  });

  // Process weakness responses
  weaknessResponses.forEach((response) => {
    const personality = mapOptionToPersonality(response.selected);
    scores[personality.toLowerCase()]++;
  });

  return scores;
};

/**
 * Map option code (A, B, C, D) to personality type
 * @param {String} option - Option code
 * @returns {String} Personality type
 */
export const mapOptionToPersonality = (option) => {
  const mapping = {
    A: "Butterfly",
    B: "Dove",
    C: "Lion",
    D: "Owl",
  };
  return mapping[option] || null;
};

/**
 * Calculate percentages for each personality
 * @param {Object} scores - Scores object
 * @returns {Object} Percentages for each personality
 */
export const calculatePercentages = (scores) => {
  const total =
    scores.butterfly + scores.dove + scores.lion + scores.owl;

  if (total === 0) {
    return {
      butterfly: 0,
      dove: 0,
      lion: 0,
      owl: 0,
    };
  }

  return {
    butterfly: parseFloat(((scores.butterfly / total) * 100).toFixed(2)),
    dove: parseFloat(((scores.dove / total) * 100).toFixed(2)),
    lion: parseFloat(((scores.lion / total) * 100).toFixed(2)),
    owl: parseFloat(((scores.owl / total) * 100).toFixed(2)),
  };
};

/**
 * Determine dominant and secondary personality types
 * @param {Object} scores - Scores object
 * @returns {Object} Contains dominantType and secondaryType
 */
export const determineDominantTypes = (scores) => {
  const personalities = [
    { type: "Butterfly", score: scores.butterfly },
    { type: "Dove", score: scores.dove },
    { type: "Lion", score: scores.lion },
    { type: "Owl", score: scores.owl },
  ];

  // Sort by score in descending order
  personalities.sort((a, b) => b.score - a.score);

  return {
    dominantType: personalities[0].type,
    secondaryType: personalities[1].type,
    allRanked: personalities,
  };
};

/**
 * Detect if personality scores are mixed/balanced
 * @param {Object} scores - Scores object
 * @returns {Boolean} True if scores are balanced (no clear dominant)
 */
export const isMixedPersonality = (scores) => {
  const sorted = Object.values(scores).sort((a, b) => b - a);
  const difference = sorted[0] - sorted[1];

  // If top two scores are within 2 points, consider it mixed
  return difference <= 2;
};

/**
 * Generate personality strength summary
 * @param {Object} percentages - Personality percentages
 * @returns {String} Summary text
 */
export const generatePersonalitySummary = (
  dominantType,
  secondaryType,
  isMixed
) => {
  let summary = `Your dominant personality type is ${dominantType}`;

  if (isMixed) {
    summary += `, with significant influence from ${secondaryType}. You exhibit a balanced blend of both types.`;
  } else {
    summary += `, with ${secondaryType} as your secondary type.`;
  }

  return summary;
};

/**
 * Validate response completeness
 * @param {Array} strengthResponses - Strength responses
 * @param {Array} weaknessResponses - Weakness responses
 * @returns {Object} Validation result with isValid and missing info
 */
export const validateResponseCompleteness = (
  strengthResponses,
  weaknessResponses
) => {
  const expectedStrengths = ASSESSMENT_CONFIG.TOTAL_STRENGTHS_QUESTIONS;
  const expectedWeaknesses = ASSESSMENT_CONFIG.TOTAL_WEAKNESSES_QUESTIONS;

  const isValid =
    strengthResponses.length === expectedStrengths &&
    weaknessResponses.length === expectedWeaknesses;

  return {
    isValid,
    strengthsAnswered: strengthResponses.length,
    strengthsExpected: expectedStrengths,
    weaknessesAnswered: weaknessResponses.length,
    weaknessesExpected: expectedWeaknesses,
    missingStrengths:
      expectedStrengths - strengthResponses.length,
    missingWeaknesses:
      expectedWeaknesses - weaknessResponses.length,
  };
};

/**
 * Get personality type ranking from highest to lowest score
 * @param {Object} scores - Scores object
 * @returns {Array} Ranked personality types with scores
 */
export const getRankedPersonalities = (scores) => {
  const ranked = [
    { personality: "Butterfly", score: scores.butterfly },
    { personality: "Dove", score: scores.dove },
    { personality: "Lion", score: scores.lion },
    { personality: "Owl", score: scores.owl },
  ];

  return ranked.sort((a, b) => b.score - a.score);
};

/**
 * Calculate score statistics
 * @param {Object} scores - Scores object
 * @returns {Object} Statistics including mean, median, std deviation
 */
export const calculateScoreStatistics = (scores) => {
  const values = Object.values(scores);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;

  const median = (() => {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  })();

  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const stdDeviation = Math.sqrt(variance);

  return {
    mean: parseFloat(mean.toFixed(2)),
    median,
    stdDeviation: parseFloat(stdDeviation.toFixed(2)),
    min: Math.min(...values),
    max: Math.max(...values),
    range: Math.max(...values) - Math.min(...values),
  };
};
