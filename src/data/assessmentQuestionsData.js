/**
 * Assessment Questions Seed Data
 * Contains all questions for both Strengths and Weaknesses sections
 */

export const assessmentQuestions = [
  // ============= STRENGTHS SECTION =============

  {
    questionId: 1,
    section: "strengths",
    questionText:
      "Which of the following best describes your professional strength?",
    options: [
      {
        code: "A",
        title: "Risk taker",
        description: "I readily explore new opportunities and challenges.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Flexible",
        description:
          "I adapt quickly if seniors ask me to, but the rules must be given in writing.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Enthusiastic",
        description: "I bring energy to new tasks and people.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Evaluator",
        description:
          "I take a lot of time to change and evaluate pros and cons before deciding.",
        personality: "Owl",
      },
    ],
  },
  {
    questionId: 2,
    section: "strengths",
    questionText: "How do you typically handle challenges at work?",
    options: [
      {
        code: "A",
        title: "I keep trying",
        description: "I persist even when work gets difficult.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Excited",
        description: "I show energy when starting new work.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Persuasive",
        description: "I influence others to consider my viewpoint.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Peaceful",
        description: "I stay calm during workplace disagreements.",
        personality: "Owl",
      },
    ],
  },
  {
    questionId: 3,
    section: "strengths",
    questionText: "What is your relationship with rules and guidelines?",
    options: [
      {
        code: "A",
        title: "Submissive to rules",
        description: "I follow rules and advice from seniors exactly.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Self-sacrificing",
        description: "I put team needs ahead of mine.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Sociable",
        description: "I enjoy interacting with colleagues and clients.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Strong-willed",
        description: "I firmly pursue what I believe is right.",
        personality: "Owl",
      },
    ],
  },
  {
    questionId: 4,
    section: "strengths",
    questionText: "How would colleagues describe your work approach?",
    options: [
      {
        code: "A",
        title: "Considerate",
        description: "I respect others' feelings while working together.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Controlled",
        description: "I manage my emotions in work situations.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Competitive",
        description: "I strive to perform better than others.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Convincing",
        description: "I explain ideas clearly to gain agreement.",
        personality: "Owl",
      },
    ],
  },
  {
    questionId: 5,
    section: "strengths",
    questionText: "How do you maintain personal integrity?",
    options: [
      {
        code: "A",
        title: "Humble",
        description: "I stay grounded even after success.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Optimistic",
        description: "I usually expect positive outcomes.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Outspoken",
        description: "I openly express my thoughts and opinions.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Systematic",
        description: "I follow organized methods to complete work.",
        personality: "Owl",
      },
    ],
  },
  {
    questionId: 6,
    section: "strengths",
    questionText: "What is your natural work pace?",
    options: [
      {
        code: "A",
        title: "Patient",
        description: "I remain calm while waiting for results.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Friendly",
        description: "I easily connect with people around me.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Confident",
        description: "I trust my decisions and abilities.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Careful",
        description: "I pay attention to details before acting.",
        personality: "Owl",
      },
    ],
  },
  {
    questionId: 7,
    section: "strengths",
    questionText: "How would you characterize your reliability?",
    options: [
      {
        code: "A",
        title: "Dependable",
        description: "People can rely on me to complete tasks.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Helpful",
        description: "I enjoy supporting others in their work.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Ambitious",
        description: "I continuously aim for bigger achievements.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Analytical",
        description: "I carefully analyze situations before deciding.",
        personality: "Owl",
      },
    ],
  },
  {
    questionId: 8,
    section: "strengths",
    questionText: "What drives your professional commitment?",
    options: [
      {
        code: "A",
        title: "Loyal",
        description: "I stay committed to my team and goals.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Supportive",
        description: "I encourage and motivate others.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Decisive",
        description: "I make decisions quickly and confidently.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Logical",
        description: "I rely on logic and facts while working.",
        personality: "Owl",
      },
    ],
  },

  // ============= WEAKNESSES SECTION =============

  {
    questionId: 1,
    section: "weaknesses",
    questionText: "Which of the following sometimes challenges you?",
    options: [
      {
        code: "A",
        title: "Indecisive",
        description: "I struggle to make quick decisions.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Too Emotional",
        description: "My emotions sometimes affect my judgment.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Dominating",
        description: "I can become overly controlling in teams.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Overthinking",
        description: "I spend too much time analyzing situations.",
        personality: "Owl",
      },
    ],
  },
  {
    questionId: 2,
    section: "weaknesses",
    questionText: "How do you respond to difficult interpersonal situations?",
    options: [
      {
        code: "A",
        title: "Avoids Conflict",
        description: "I try to escape difficult confrontations.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Overly Sensitive",
        description: "Criticism affects me deeply.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Impatient",
        description: "I get frustrated when things move slowly.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Perfectionist",
        description: "I expect everything to be flawless.",
        personality: "Owl",
      },
    ],
  },
  {
    questionId: 3,
    section: "weaknesses",
    questionText: "What is an area where you sometimes fall short?",
    options: [
      {
        code: "A",
        title: "Passive",
        description: "I sometimes hesitate to take initiative.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "People Pleaser",
        description: "I prioritize others over myself too much.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Aggressive",
        description: "I can become too forceful in discussions.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Detached",
        description: "I sometimes appear emotionally distant.",
        personality: "Owl",
      },
    ],
  },
  {
    questionId: 4,
    section: "weaknesses",
    questionText: "How do you experience self-doubt?",
    options: [
      {
        code: "A",
        title: "Uncertain",
        description: "I frequently doubt my choices.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Dependent",
        description: "I rely too much on others for reassurance.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Stubborn",
        description: "I resist changing my opinions.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Critical",
        description: "I can be overly judgmental of mistakes.",
        personality: "Owl",
      },
    ],
  },
  {
    questionId: 5,
    section: "weaknesses",
    questionText: "What limitation sometimes holds you back?",
    options: [
      {
        code: "A",
        title: "Fearful",
        description: "I hesitate due to fear of failure.",
        personality: "Butterfly",
      },
      {
        code: "B",
        title: "Overcommitted",
        description: "I take on too many responsibilities.",
        personality: "Dove",
      },
      {
        code: "C",
        title: "Controlling",
        description: "I try to manage everything myself.",
        personality: "Lion",
      },
      {
        code: "D",
        title: "Rigid",
        description: "I struggle to adapt to sudden changes.",
        personality: "Owl",
      },
    ],
  },
];
