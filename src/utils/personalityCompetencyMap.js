/**
 * Maps each personality type to a unique set of 6 competencies
 * and provides a dummy random score generator.
 *
 * NOTE: The competency names here must match those seeded in seed-competencies.js
 */

export const PERSONALITY_COMPETENCY_MAP = {
  Butterfly: [
    "Communication",
    "Creativity",
    "Adaptability",
    "Networking",
    "Ideation",
    "Multitasking",
  ],
  Dove: [
    "Teamwork",
    "Empathy",
    "Conflict Resolution",
    "Active Listening",
    "Patience",
    "Supportiveness",
  ],
  Lion: [
    "Leadership",
    "Decision Making",
    "Strategic Thinking",
    "Persuasion",
    "Initiative",
    "Competitiveness",
  ],
  Owl: [
    "Analytical Thinking",
    "Problem Solving",
    "Attention to Detail",
    "Research",
    "Data Literacy",
    "Systematic Planning",
  ],
};

/**
 * Generate random competency scores for a given personality type.
 * Returns an array of { name, score } objects.
 * Scores are random integers between 40 and 90.
 *
 * @param {string} personalityType - "Butterfly" | "Dove" | "Lion" | "Owl"
 * @returns {{ name: string, score: number }[]}
 */
export const generateRandomCompetencyScores = (personalityType) => {
  const competencies = PERSONALITY_COMPETENCY_MAP[personalityType];
  if (!competencies) return [];

  return competencies.map((name) => ({
    name,
    score: Math.floor(Math.random() * 51) + 40, // 40–90
  }));
};
