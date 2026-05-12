export const PERSONALITY_TYPES = {
  BUTTERFLY: "Butterfly",
  DOVE: "Dove",
  LION: "Lion",
  OWL: "Owl",
};

export const PERSONALITY_COLORS = {
  Butterfly: "#FF6B9D",
  Dove: "#4ECDC4",
  Lion: "#FFE66D",
  Owl: "#95E1D3",
};

export const PERSONALITY_ANALYSIS = {
  Butterfly: {
    displayName: "Butterfly",
    emoji: "🦋",
    color: "#FF6B9D",
    summary:
      "The Creative Adventurer - Spontaneous, flexible, and always seeking new opportunities with enthusiasm and adaptability.",
    strengths: [
      "Creative and innovative thinking",
      "Adaptable to change",
      "Enthusiastic about new ideas",
      "Spontaneous and flexible",
      "Optimistic outlook",
      "Good at multitasking",
      "Risk-taking ability",
      "Natural networker",
    ],
    weaknesses: [
      "May lack focus and consistency",
      "Can be indecisive",
      "Struggles with structure",
      "May avoid difficult conflicts",
      "Can be scattered",
      "Fear of failure in new ventures",
      "Passive in leadership",
      "Uncertainty about direction",
    ],
    communicationStyle: {
      description:
        "Conversational, expressive, and enthusiastic. Prefers informal communication with room for creativity.",
      traits: [
        "Expressive and animated",
        "Uses lots of examples and stories",
        "Enjoys informal conversation",
        "Open to feedback",
        "Communicates feelings freely",
      ],
    },
    leadershipStyle: {
      description:
        "Inspirational but lacking structure. Good at getting people excited but may struggle with execution.",
      traits: [
        "Visionary and inspirational",
        "Encourages experimentation",
        "Flexible with rules",
        "Team-focused",
        "Can be indecisive",
        "Struggles with follow-through",
      ],
    },
    workEnvironment: {
      ideal: [
        "Creative and dynamic workplaces",
        "Roles with variety and new challenges",
        "Collaborative teams",
        "Minimal rigid structure",
        "Opportunities for innovation",
        "Supportive leadership",
      ],
      avoid: [
        "Highly rigid structures",
        "Repetitive tasks",
        "Isolated work",
        "Overly formal settings",
        "No room for creativity",
      ],
    },
    idealCareers: [
      "UX/UI Designer",
      "Creative Director",
      "Marketing Manager",
      "Event Planner",
      "Product Manager",
      "Brand Strategist",
      "Entrepreneur",
      "Content Creator",
      "Social Media Manager",
      "Innovation Consultant",
    ],
    teamworkBehavior: {
      description: "Brings energy and creativity to teams, builds relationships easily.",
      traits: [
        "Good team bonding member",
        "Brings energy to projects",
        "Quick to build relationships",
        "Shares ideas freely",
        "May not follow through on tasks",
      ],
    },
    stressBehavior: {
      description: "Becomes scattered and avoids difficult situations when stressed.",
      traits: [
        "Becomes more scattered",
        "Avoids confrontation",
        "May take on too many projects",
        "Loses focus",
        "Seeks distraction",
      ],
    },
    growthSuggestions: [
      "Work on follow-through and accountability",
      "Develop time management skills",
      "Practice saying 'no' to avoid overcommitment",
      "Learn to embrace structure when necessary",
      "Develop conflict resolution skills",
      "Build consistency in your work",
    ],
  },
  Dove: {
    displayName: "Dove",
    emoji: "🕊️",
    color: "#4ECDC4",
    summary:
      "The Compassionate Peacemaker - Empathetic, supportive, and focused on maintaining harmony and helping others succeed.",
    strengths: [
      "Excellent listener",
      "Highly empathetic",
      "Team player",
      "Supportive and encouraging",
      "Conflict resolution skills",
      "Loyal and dependable",
      "Calm under pressure",
      "People-focused",
    ],
    weaknesses: [
      "May avoid necessary conflicts",
      "Can be overly sensitive to criticism",
      "Tends to be passive in decision-making",
      "May prioritize others over themselves",
      "Struggles with assertiveness",
      "Can overcommit themselves",
      "Too dependent on others' approval",
      "May suppress own needs",
    ],
    communicationStyle: {
      description:
        "Gentle, considerate, and focused on building understanding. Prefers collaborative discussion.",
      traits: [
        "Soft-spoken and gentle",
        "Asks questions to understand",
        "Seeks consensus",
        "Avoids harsh language",
        "Emotional and intuitive",
      ],
    },
    leadershipStyle: {
      description:
        "Supportive and collaborative. Focuses on team well-being and harmony over results.",
      traits: [
        "Supportive mentor",
        "Creates safe spaces",
        "Values team input",
        "Avoids micromanagement",
        "May be too passive",
        "Struggles with difficult decisions",
      ],
    },
    workEnvironment: {
      ideal: [
        "Supportive team culture",
        "Clear communication",
        "Stable and predictable",
        "People-centric roles",
        "Collaborative environment",
        "Purpose-driven work",
      ],
      avoid: [
        "Highly competitive environments",
        "Aggressive colleagues",
        "Constant conflict",
        "Pressure to be ruthless",
        "Isolation",
      ],
    },
    idealCareers: [
      "Human Resources",
      "Psychology/Counseling",
      "Teaching",
      "Nursing/Healthcare",
      "Social Work",
      "Customer Success",
      "Training & Development",
      "Non-profit Leadership",
      "Team Coordinator",
      "Mediator",
    ],
    teamworkBehavior: {
      description:
        "Excellent team members who prioritize group harmony and others' well-being.",
      traits: [
        "Supports team members",
        "Puts team needs first",
        "Builds strong relationships",
        "Reliable team player",
        "May lack initiative",
      ],
    },
    stressBehavior: {
      description:
        "Becomes more withdrawn and emotional when stressed, may overcommit further.",
      traits: [
        "Becomes withdrawn",
        "More emotional",
        "Overcommits to help others",
        "Seeks reassurance",
        "May lose confidence",
      ],
    },
    growthSuggestions: [
      "Develop assertiveness skills",
      "Learn to set healthy boundaries",
      "Practice saying 'no' respectfully",
      "Build confidence in decision-making",
      "Embrace healthy competition",
      "Speak up for your own needs",
    ],
  },
  Lion: {
    displayName: "Lion",
    emoji: "🦁",
    color: "#FFE66D",
    summary:
      "The Bold Leader - Confident, ambitious, and driven to achieve results with energy and determination.",
    strengths: [
      "Confident and decisive",
      "Natural leader",
      "Ambitious and driven",
      "Energetic and enthusiastic",
      "Good at motivating others",
      "Takes initiative",
      "Competitive spirit",
      "Results-focused",
    ],
    weaknesses: [
      "Can be overly dominant",
      "Impatient with slower processes",
      "May dismiss others' opinions",
      "Can appear aggressive",
      "Struggles with listening",
      "Stubborn and resistant to change",
      "May burn out from overwork",
      "Can be insensitive",
    ],
    communicationStyle: {
      description:
        "Direct, confident, and commanding. Prefers clear action items and quick decisions.",
      traits: [
        "Direct and straightforward",
        "Commanding presence",
        "Action-oriented language",
        "Speaks with authority",
        "Quick to make points",
      ],
    },
    leadershipStyle: {
      description:
        "Commanding and results-driven. Inspires through confidence and sets high standards.",
      traits: [
        "Sets clear goals",
        "Motivates through challenge",
        "Quick decision-maker",
        "Drives results",
        "Can be dominating",
        "High expectations",
      ],
    },
    workEnvironment: {
      ideal: [
        "Competitive atmosphere",
        "Clear goals and metrics",
        "Opportunity for leadership",
        "Fast-paced environment",
        "Recognition of achievements",
        "Autonomy in decision-making",
      ],
      avoid: [
        "Passive team members",
        "Lack of progress",
        "Unclear objectives",
        "Bureaucracy",
        "Being told what to do",
      ],
    },
    idealCareers: [
      "Entrepreneur",
      "CEO/Executive",
      "Sales Manager",
      "Project Manager",
      "Business Development",
      "Military Officer",
      "Lawyer",
      "Real Estate",
      "Politician",
      "Investment Manager",
    ],
    teamworkBehavior: {
      description:
        "Leads from the front and expects others to keep up. Driven but can be demanding.",
      traits: [
        "Takes charge",
        "Drives team forward",
        "Expects high performance",
        "May dominate discussions",
        "Results-oriented",
      ],
    },
    stressBehavior: {
      description: "Becomes more aggressive and controlling when stressed.",
      traits: [
        "More aggressive",
        "Increased domination",
        "May work excessively",
        "Becomes impatient",
        "Dismisses concerns",
      ],
    },
    growthSuggestions: [
      "Practice active listening",
      "Develop empathy for others",
      "Learn to delegate more effectively",
      "Work on patience and timing",
      "Consider others' perspectives",
      "Balance ambition with well-being",
    ],
  },
  Owl: {
    displayName: "Owl",
    emoji: "🦉",
    color: "#95E1D3",
    summary:
      "The Thoughtful Analyst - Logical, detail-oriented, and committed to thorough analysis and systematic problem-solving.",
    strengths: [
      "Analytical and logical",
      "Detail-oriented",
      "Systematic thinker",
      "Strong problem-solver",
      "Thoughtful decision-maker",
      "Reliable and thorough",
      "Research-focused",
      "Quality-conscious",
    ],
    weaknesses: [
      "Can be overly analytical",
      "Perfectionist tendencies",
      "May appear detached",
      "Slow to make decisions",
      "Struggles with change",
      "Can be critical of others",
      "Difficulty expressing emotions",
      "May procrastinate on tasks",
    ],
    communicationStyle: {
      description:
        "Precise, logical, and focused on facts. Prefers written communication and detailed explanations.",
      traits: [
        "Precise and accurate",
        "Data-driven language",
        "Prefers written communication",
        "Logical flow",
        "Can be overly technical",
      ],
    },
    leadershipStyle: {
      description:
        "Strategic and systematic. Focuses on processes, systems, and long-term planning.",
      traits: [
        "Strategic thinker",
        "Process-focused",
        "Data-driven decisions",
        "Thorough planning",
        "Can be inflexible",
        "May struggle with quick pivots",
      ],
    },
    workEnvironment: {
      ideal: [
        "Structured environment",
        "Clear procedures and systems",
        "Time for analysis",
        "Data-rich information",
        "Intellectual challenges",
        "Quality-focused culture",
      ],
      avoid: [
        "Chaotic environments",
        "Rushed decisions",
        "Vague expectations",
        "Emotional work environments",
        "Constant change",
      ],
    },
    idealCareers: [
      "Data Scientist",
      "Software Engineer",
      "Accountant",
      "Research Scientist",
      "Financial Analyst",
      "Architect",
      "Surgeon/Medical Specialist",
      "Auditor",
      "Quality Assurance",
      "Systems Administrator",
    ],
    teamworkBehavior: {
      description:
        "Reliable and thorough team members who contribute quality work, but may seem distant.",
      traits: [
        "Reliable contributor",
        "Quality focused",
        "Detailed input",
        "May be reserved",
        "Prefers individual work",
      ],
    },
    stressBehavior: {
      description:
        "Becomes more rigid and critical when stressed, may completely withdraw.",
      traits: [
        "More rigid thinking",
        "Increased criticism",
        "Over-analysis paralysis",
        "Emotional withdrawal",
        "May shut down",
      ],
    },
    growthSuggestions: [
      "Learn to make decisions with incomplete data",
      "Develop emotional intelligence",
      "Practice flexibility and adaptability",
      "Work on expressing your thoughts verbally",
      "Balance analysis with action",
      "Build stronger interpersonal connections",
    ],
  },
};

export const PERSONALITY_CAREER_MAP = {
  Butterfly: [
    "UX/UI Designer",
    "Creative Director",
    "Marketing Manager",
    "Event Planner",
    "Product Manager",
    "Brand Strategist",
    "Entrepreneur",
    "Content Creator",
  ],
  Dove: [
    "Human Resources",
    "Psychology",
    "Teaching",
    "Nursing",
    "Social Work",
    "Customer Success",
    "Training & Development",
    "Non-profit Leadership",
  ],
  Lion: [
    "Entrepreneur",
    "CEO",
    "Sales Manager",
    "Project Manager",
    "Business Development",
    "Lawyer",
    "Real Estate",
    "Investment Manager",
  ],
  Owl: [
    "Data Scientist",
    "Software Engineer",
    "Accountant",
    "Research Scientist",
    "Financial Analyst",
    "Architect",
    "Surgeon",
    "Quality Assurance",
  ],
};

export const SECTION_TYPES = {
  STRENGTHS: "strengths",
  WEAKNESSES: "weaknesses",
};

export const RESPONSE_STATUS = {
  COMPLETED: "completed",
  INCOMPLETE: "incomplete",
  PENDING: "pending",
};
