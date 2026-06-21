export const ASSESSMENT_CONFIG = {
  TOTAL_STRENGTHS_QUESTIONS: 20,
  TOTAL_WEAKNESSES_QUESTIONS: 20,
  TOTAL_QUESTIONS: 40,
  PERSONALITIES: ["Butterfly", "Dove", "Lion", "Owl"],
  OPTIONS: ["A", "B", "C", "D"],
  PERSONALITY_CODES: {
    A: "Butterfly",
    B: "Dove",
    C: "Lion",
    D: "Owl",
  },
  CODE_TO_PERSONALITY: {
    A: "Butterfly",
    B: "Dove",
    C: "Lion",
    D: "Owl",
  },
};

export const ASSESSMENT_SECTIONS = {
  STRENGTHS: "strengths",
  WEAKNESSES: "weaknesses",
};

export const VALIDATION_RULES = {
  MIN_RESPONSE_LENGTH: 8, // At least one response
  MAX_RESPONSE_LENGTH: 13,
};

export const ERROR_MESSAGES = {
  INVALID_SECTION: "Invalid section. Must be 'strengths' or 'weaknesses'",
  INVALID_OPTION: "Invalid option. Must be A, B, C, or D",
  INVALID_QUESTION_ID: "Invalid question ID",
  QUESTIONS_NOT_FOUND: "Assessment questions not found",
  DUPLICATE_RESPONSE: "Duplicate response for the same question",
  INCOMPLETE_RESPONSES: "Incomplete responses. All questions must be answered",
  INVALID_USER_ID: "Invalid user ID",
  RESPONSE_NOT_FOUND: "Assessment response not found",
  UNAUTHORIZED: "Unauthorized to access this assessment",
};
