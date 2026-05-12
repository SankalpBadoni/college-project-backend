import {
  PERSONALITY_ANALYSIS,
  PERSONALITY_CAREER_MAP,
} from "./personalityConstants.js";

/**
 * Generate comprehensive personality analysis
 * @param {String} dominantType - Dominant personality type
 * @param {String} secondaryType - Secondary personality type
 * @param {Object} percentages - Personality percentages
 * @returns {Object} Detailed analysis
 */
export const generatePersonalityAnalysis = (
  dominantType,
  secondaryType,
  percentages
) => {
  const analysis = {
    dominantPersonality: generatePersonalityProfile(dominantType),
    secondaryPersonality: generatePersonalityProfile(secondaryType),
    blendedProfile: generateBlendedAnalysis(dominantType, secondaryType),
    percentages,
  };

  return analysis;
};

/**
 * Get full profile for a personality type
 * @param {String} personalityType - Personality type name
 * @returns {Object} Full personality profile
 */
export const generatePersonalityProfile = (personalityType) => {
  const profile = PERSONALITY_ANALYSIS[personalityType];

  if (!profile) {
    return null;
  }

  return {
    type: personalityType,
    ...profile,
    careerRecommendations: PERSONALITY_CAREER_MAP[personalityType] || [],
  };
};

/**
 * Generate blended personality analysis
 * @param {String} dominantType - Dominant personality
 * @param {String} secondaryType - Secondary personality
 * @returns {Object} Combined analysis
 */
export const generateBlendedAnalysis = (dominantType, secondaryType) => {
  const blends = {
    "Butterfly-Dove":
      "Creative Compassionate - You balance creativity with empathy. You inspire others through innovation while maintaining genuine care for their well-being.",
    "Butterfly-Lion":
      "Creative Leader - You drive change through bold ideas and confident leadership. Your enthusiasm motivates teams to achieve ambitious goals.",
    "Butterfly-Owl":
      "Creative Analyst - You combine innovation with systematic thinking. You bring fresh ideas while ensuring thorough analysis and quality.",
    "Dove-Butterfly":
      "Compassionate Creator - You blend supportive nature with creative thinking. You create inclusive environments that encourage innovation.",
    "Dove-Lion":
      "Supportive Leader - You balance team care with achievement drive. You lead with both heart and ambition, achieving results while maintaining morale.",
    "Dove-Owl":
      "Supportive Analyst - You combine empathy with logical thinking. You make thoughtful decisions that consider both human impact and analytical rigor.",
    "Lion-Butterfly":
      "Leader Creator - You pursue ambitious goals through creative approaches. Your confidence enables others to take creative risks.",
    "Lion-Dove":
      "Leader with Heart - You drive results while genuinely caring about team members. You achieve success through both motivation and support.",
    "Lion-Owl":
      "Strategic Leader - You combine decisive action with thorough analysis. You make bold decisions backed by solid research and planning.",
    "Owl-Butterfly":
      "Analytical Creator - You add structure to creative thinking. Your systematic approach helps turn innovative ideas into practical solutions.",
    "Owl-Dove":
      "Analytical Supporter - You provide thoughtful, evidence-based support. Your care is expressed through careful consideration and reliable help.",
    "Owl-Lion":
      "Strategic Executor - You achieve goals through meticulous planning and confident execution. You balance caution with determination.",
  };

  const key = `${dominantType}-${secondaryType}`;
  const description =
    blends[key] ||
    `You blend the characteristics of ${dominantType} and ${secondaryType}`;

  return {
    dominantType,
    secondaryType,
    description,
    recommendations: generateBlendRecommendations(dominantType, secondaryType),
  };
};

/**
 * Generate specific recommendations for personality blend
 * @param {String} dominantType - Dominant type
 * @param {String} secondaryType - Secondary type
 * @returns {Object} Tailored recommendations
 */
export const generateBlendRecommendations = (dominantType, secondaryType) => {
  return {
    strengths: [
      "Leverage your unique combination of traits for competitive advantage",
      `Use your ${dominantType} qualities as your primary strength`,
      `Apply your ${secondaryType} qualities as a complementary skill`,
      "You can adapt to various situations better than pure types",
    ],
    challenges: [
      `Watch for conflicting impulses between ${dominantType} and ${secondaryType} traits`,
      "Sometimes one personality trait may dominate depending on the situation",
      "Be aware of when each type's weaknesses might emerge",
    ],
    development:
      [
        `Develop your ${dominantType} traits first as your foundation`,
        `Then strengthen your ${secondaryType} traits to enhance your capability`,
        "Practice recognizing which personality to lead with in different situations",
      ],
  };
};

/**
 * Generate detailed strength analysis
 * @param {String} dominantType - Dominant personality type
 * @param {String} secondaryType - Secondary personality type
 * @returns {String} Strength analysis text
 */
export const generateStrengthAnalysis = (dominantType, secondaryType) => {
  const dominantProfile = PERSONALITY_ANALYSIS[dominantType];
  const secondaryProfile = PERSONALITY_ANALYSIS[secondaryType];

  let analysis = `### Your Key Strengths\n\n`;
  analysis += `**As a ${dominantType}:**\n`;
  analysis += dominantProfile.strengths
    .slice(0, 4)
    .map((s) => `- ${s}`)
    .join("\n");
  analysis += `\n\n**Enhanced by your ${secondaryType} side:**\n`;
  analysis += secondaryProfile.strengths
    .slice(0, 3)
    .map((s) => `- ${s}`)
    .join("\n");

  return analysis;
};

/**
 * Generate detailed weakness analysis
 * @param {String} dominantType - Dominant personality type
 * @param {String} secondaryType - Secondary personality type
 * @returns {String} Weakness analysis text
 */
export const generateWeaknessAnalysis = (dominantType, secondaryType) => {
  const dominantProfile = PERSONALITY_ANALYSIS[dominantType];
  const secondaryProfile = PERSONALITY_ANALYSIS[secondaryType];

  let analysis = `### Areas for Growth\n\n`;
  analysis += `**Potential ${dominantType} challenges:**\n`;
  analysis += dominantProfile.weaknesses
    .slice(0, 3)
    .map((w) => `- ${w}`)
    .join("\n");
  analysis += `\n\n**${secondaryType} perspective for balance:**\n`;
  analysis += `Consider how ${secondaryType} traits could help mitigate ${dominantType} challenges:\n`;
  analysis += secondaryProfile.strengths
    .slice(0, 2)
    .map((s) => `- ${s}`)
    .join("\n");

  return analysis;
};

/**
 * Get growth suggestions tailored to personality type
 * @param {String} dominantType - Dominant personality type
 * @param {String} secondaryType - Secondary personality type
 * @returns {Array} Growth suggestions
 */
export const getGrowthSuggestions = (dominantType, secondaryType) => {
  const dominantProfile = PERSONALITY_ANALYSIS[dominantType];
  const secondaryProfile = PERSONALITY_ANALYSIS[secondaryType];

  const suggestions = [
    ...dominantProfile.growthSuggestions.slice(0, 3),
    `Leverage your ${secondaryType} traits to address ${dominantType} weaknesses`,
  ];

  return suggestions;
};

/**
 * Get career recommendations
 * @param {String} dominantType - Dominant personality type
 * @param {String} secondaryType - Secondary personality type
 * @returns {Array} Career suggestions
 */
export const getCareerRecommendations = (dominantType, secondaryType) => {
  const dominantCareers = PERSONALITY_CAREER_MAP[dominantType] || [];
  const secondaryCareers = PERSONALITY_CAREER_MAP[secondaryType] || [];

  // Combine and deduplicate
  const allCareers = [...new Set([...dominantCareers, ...secondaryCareers])];

  return {
    recommended: allCareers.slice(0, 8),
    dominantTypeCareers: dominantCareers,
    secondaryTypeCareers: secondaryCareers,
    description: `Based on your ${dominantType} (primary) and ${secondaryType} (secondary) personality types, these careers align well with your natural strengths and preferences.`,
  };
};

/**
 * Generate work style summary
 * @param {String} dominantType - Dominant personality type
 * @returns {Object} Work style information
 */
export const getWorkStyle = (dominantType) => {
  const profile = PERSONALITY_ANALYSIS[dominantType];
  if (!profile) return null;

  return {
    communicationStyle: profile.communicationStyle,
    leadershipStyle: profile.leadershipStyle,
    workEnvironment: profile.workEnvironment,
    teamworkBehavior: profile.teamworkBehavior,
    stressBehavior: profile.stressBehavior,
  };
};

/**
 * Generate one-page summary
 * @param {String} dominantType - Dominant type
 * @param {String} secondaryType - Secondary type
 * @param {Object} percentages - Personality percentages
 * @returns {String} Executive summary
 */
export const generateExecutiveSummary = (
  dominantType,
  secondaryType,
  percentages
) => {
  const profile = PERSONALITY_ANALYSIS[dominantType];
  const percentage = percentages[dominantType.toLowerCase()];

  return {
    headline: `You are a ${dominantType} (${percentage}%)`,
    summary: profile.summary,
    coreStrengths: profile.strengths.slice(0, 4),
    primaryChallenges: profile.weaknesses.slice(0, 3),
    idealRoles: PERSONALITY_CAREER_MAP[dominantType].slice(0, 5),
    nextSteps: [
      "Review your detailed personality profile",
      "Explore recommended careers and roles",
      "Identify development areas to focus on",
      "Create an action plan for personal growth",
    ],
  };
};
