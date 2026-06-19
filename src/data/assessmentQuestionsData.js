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

/**
 * Assessment Questions Seed Data
 * Contains 40 Pairs (80 total attributes) based on the Communication Styles Assessment
 */

export const communicationQuestions = [
  {
    questionId: 1,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "When facing a problem, I like to carry out action, rather than think too much about it", personality: "Lion" },
      { code: "B", title: "Process", description: "I deal with problems in a systematic, well thought out way", personality: "Owl" }
    ]
  },
  {
    questionId: 2,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "I believe that solving a problem together or collaboratively is more effective than solving it alone", personality: "Dove" },
      { code: "B", title: "Idea", description: "I enjoy doing things in a new way, or experimenting with new solutions", personality: "Butterfly" }
    ]
  },
  {
    questionId: 3,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Idea", description: "I think about life, work, clients and their progress, in the future than about past happenings", personality: "Butterfly" },
      { code: "B", title: "People", description: "I enjoy dealing with, communicating with and interfacing with new people", personality: "Dove" }
    ]
  },
  {
    questionId: 4,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Process", description: "I like to be well organized", personality: "Owl" },
      { code: "B", title: "Action", description: "Deadlines are important to me, I ensure I don’t miss them", personality: "Lion" }
    ]
  },
  {
    questionId: 5,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "I cannot stand procrastination – putting off for later, what we can do today", personality: "Lion" },
      { code: "B", title: "Process", description: "I believe new ideas have to be tested before being put to use", personality: "Owl" }
    ]
  },
  {
    questionId: 6,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "I enjoy the stimulation of interaction with new people", personality: "Dove" },
      { code: "B", title: "Idea", description: "I am always looking for new possibilities, new avenues, new thoughts", personality: "Butterfly" }
    ]
  },
  {
    questionId: 7,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "I want to set up my own objectives, I like to be self-made", personality: "Lion" },
      { code: "B", title: "Process", description: "When I start something, I go through till the end, do not like to leave it unfinished", personality: "Owl" }
    ]
  },
  {
    questionId: 8,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "I basically try to understand other people’s emotions, and find out why they are saying what they are saying", personality: "Dove" },
      { code: "B", title: "Idea", description: "I do challenge people around me, don’t agree easily unless convinced, and sometimes put them under pressure", personality: "Butterfly" }
    ]
  },
  {
    questionId: 9,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "I look forward to receiving feedback on myself, how I am doing, how am I coming across to people", personality: "Lion" },
      { code: "B", title: "Process", description: "I like to plan my next steps in a logical process", personality: "Owl" }
    ]
  },
  {
    questionId: 10,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "I think I am good at understanding people", personality: "Dove" },
      { code: "B", title: "Idea", description: "I like creative problem solving, tackling problems that others are not able to solve", personality: "Butterfly" }
    ]
  },
  {
    questionId: 11,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Idea", description: "I think about the future", personality: "Butterfly" },
      { code: "B", title: "People", description: "I am sensitive to others needs, and am careful about what I say, so I don’t hurt others", personality: "Dove" }
    ]
  },
  {
    questionId: 12,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Process", description: "Planning is the key to success", personality: "Owl" },
      { code: "B", title: "Action", description: "I become impatient with long discussions. I like action and quick decisions", personality: "Lion" }
    ]
  },
  {
    questionId: 13,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Process", description: "I am cool under pressure", personality: "Owl" },
      { code: "B", title: "Action", description: "I value the experience of others very much", personality: "Lion" }
    ]
  },
  {
    questionId: 14,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "I listen to people and then offer my thoughts", personality: "Dove" },
      { code: "B", title: "Idea", description: "People say I am quick thinker", personality: "Butterfly" }
    ]
  },
  {
    questionId: 15,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "Cooperation is a key word for me", personality: "Dove" },
      { code: "B", title: "Process", description: "I use logical methods to test alternatives", personality: "Owl" }
    ]
  },
  {
    questionId: 16,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "I like to handle many things at the same time", personality: "Lion" },
      { code: "B", title: "Idea", description: "I always question myself, whether I am on the right track", personality: "Butterfly" }
    ]
  },
  {
    questionId: 17,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "I learn by doing, not by theory, or just because somebody believes it is the right way", personality: "Lion" },
      { code: "B", title: "Process", description: "I believe that my head rules my heart, I don't take impulsive or emotional decisions", personality: "Owl" }
    ]
  },
  {
    questionId: 18,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "I can predict how others will react to a certain action", personality: "Dove" },
      { code: "B", title: "Idea", description: "I do not like details, I like to quickly take action", personality: "Butterfly" }
    ]
  },
  {
    questionId: 19,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Process", description: "Analysis should always precede action", personality: "Owl" },
      { code: "B", title: "People", description: "I am able to assess the climate and feelings of a group of people", personality: "Dove" }
    ]
  },
  {
    questionId: 20,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Idea", description: "I have a tendency to start things up and not finishing them up", personality: "Butterfly" },
      { code: "B", title: "Action", description: "I perceive myself as decisive, someone who takes decisions quickly", personality: "Lion" }
    ]
  },
  {
    questionId: 21,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "I search for challenging tasks", personality: "Lion" },
      { code: "B", title: "Process", description: "I rely on careful observation, feedback, data, others advise before taking a decision", personality: "Owl" }
    ]
  },
  {
    questionId: 22,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "I can express my feelings openly", personality: "Dove" },
      { code: "B", title: "Idea", description: "I like to do new things", personality: "Butterfly" }
    ]
  },
  {
    questionId: 23,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Idea", description: "I enjoy reading very much", personality: "Butterfly" },
      { code: "B", title: "People", description: "I perceive myself as a someone who can help other take their decision", personality: "Dove" }
    ]
  },
  {
    questionId: 24,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Process", description: "I like to focus on one issue at a time", personality: "Owl" },
      { code: "B", title: "Action", description: "I like to achieve a lot, I am ambitious and I would like to utilize my time in achieving many things", personality: "Lion" }
    ]
  },
  {
    questionId: 25,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "I enjoy learning about others", personality: "Dove" },
      { code: "B", title: "Action", description: "I like variety and change", personality: "Lion" }
    ]
  },
  {
    questionId: 26,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Process", description: "Facts speak for themselves, there is no need to explain deeply", personality: "Owl" },
      { code: "B", title: "Idea", description: "I use my imagination as much as possible", personality: "Butterfly" }
    ]
  },
  {
    questionId: 27,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "I am impatient with long slow, repetitive work", personality: "Lion" },
      { code: "B", title: "Idea", description: "My mind never stops working, I am always thinking and analyzing", personality: "Butterfly" }
    ]
  },
  {
    questionId: 28,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Process", description: "Key decisions have to be made in a slow, cautious way after deep analysis", personality: "Owl" },
      { code: "B", title: "People", description: "I strongly feel that people need each other to get things done", personality: "Dove" }
    ]
  },
  {
    questionId: 29,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "I usually take decisions without thinking too much", personality: "Lion" },
      { code: "B", title: "Process", description: "Emotions create problem", personality: "Owl" }
    ]
  },
  {
    questionId: 30,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "I need to be liked by others", personality: "Dove" },
      { code: "B", title: "Idea", description: "I can put two and two together very quickly, and understand the depth of an issue", personality: "Butterfly" }
    ]
  },
  {
    questionId: 31,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Idea", description: "I try out my new ideas with people", personality: "Butterfly" },
      { code: "B", title: "Process", description: "I believe in the scientific approach, where detailed experimentation leads to the right results", personality: "Owl" }
    ]
  },
  {
    questionId: 32,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "I like to get things done quickly, don’t like wasting time in detailed explanation", personality: "Lion" },
      { code: "B", title: "People", description: "Good relationships are essential", personality: "Dove" }
    ]
  },
  {
    questionId: 33,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "I am impulsive", personality: "Lion" },
      { code: "B", title: "Process", description: "I accept that different people have different outlook and thought process", personality: "Owl" }
    ]
  },
  {
    questionId: 34,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "Communicating with people is an end in itself, I enjoy doing it", personality: "Dove" },
      { code: "B", title: "Idea", description: "I like to be intellectually stimulated, I like challenges which brings out the best in my thinking ability", personality: "Butterfly" }
    ]
  },
  {
    questionId: 35,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Process", description: "I like to organize, do detailed planning, take leadership", personality: "Owl" },
      { code: "B", title: "Action", description: "I usually jump from one task to the other", personality: "Lion" }
    ]
  },
  {
    questionId: 36,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "People", description: "Talking and working with people is a creative art", personality: "Dove" },
      { code: "B", title: "Idea", description: "Self actualization is a key word for me – achieving my top most potential", personality: "Butterfly" }
    ]
  },
  {
    questionId: 37,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Idea", description: "I enjoy playing with new ideas", personality: "Butterfly" },
      { code: "B", title: "Action", description: "I dislike wasting my time", personality: "Lion" }
    ]
  },
  {
    questionId: 38,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Process", description: "I enjoy doing what I am good at", personality: "Owl" },
      { code: "B", title: "People", description: "I learn by interacting with others", personality: "Dove" }
    ]
  },
  {
    questionId: 39,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Idea", description: "I find abstractions, complex ideas, interesting and enjoyable", personality: "Butterfly" },
      { code: "B", title: "Process", description: "I am patient with others", personality: "Owl" }
    ]
  },
  {
    questionId: 40,
    section: "communication",
    questionText: "Choose the statement that is most typical of your personality:",
    options: [
      { code: "A", title: "Action", description: "I like brief and to-the-point statements", personality: "Lion" },
      { code: "B", title: "People", description: "I feel confident about myself, and my abilities, and I am confident of doing things alone", personality: "Dove" }
    ]
  }
];
