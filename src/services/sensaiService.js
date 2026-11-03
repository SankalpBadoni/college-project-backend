import OpenAI from "openai";
import Student from "../models/Student.js";
import Program from "../models/Program.js";
import LiveProject from "../models/LiveProject.js";
import JobPosting from "../models/JobPosting.js";
import Enrollment from "../models/Enrollment.js";
import JobApplication from "../models/JobApplication.js";

let openaiClient = null;
const getClient = () => {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in the environment");
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

const MODEL = "gpt-4o-mini";

/* ------------------------------------------------------------------ */
/* 1. Student context — the full profile (Option A: send everything)   */
/* ------------------------------------------------------------------ */

export const buildStudentContext = async (studentId) => {
  const student = await Student.findById(studentId)
    .select("-password")
    .populate("competency.competency", "name type")
    .populate("strengths.technical", "name")
    .populate("strengths.behavioral", "name")
    .populate("weaknesses.technical", "name")
    .populate("weaknesses.behavioral", "name")
    .lean();

  if (!student) return null;

  const [enrollments, jobApplications, liveProjects] = await Promise.all([
    Enrollment.find({ student: studentId })
      .populate("program", "title type")
      .select("program status creditsUsed completionDate")
      .lean(),
    JobApplication.find({ student: studentId })
      .populate("jobPosting", "title companyName postingType")
      .select("jobPosting status")
      .lean(),
    LiveProject.find({
      $or: [{ "applicants.student": studentId }, { "enrolledStudents.student": studentId }]
    })
      .select("title status applicants enrolledStudents")
      .lean()
  ]);

  const liveProjectSummary = liveProjects.map((p) => {
    const enrolled = p.enrolledStudents?.find((e) => String(e.student) === String(studentId));
    const applicant = p.applicants?.find((a) => String(a.student) === String(studentId));
    return {
      title: p.title,
      projectStatus: p.status,
      myStatus: enrolled ? "enrolled" : applicant?.status || "applied",
      progress: enrolled?.progress ?? null,
      latestScore: enrolled?.latestScore ?? null
    };
  });

  return {
    fullName: student.fullName,
    yearOfCourse: student.profile?.yearOfCourse,
    stream: student.profile?.stream,
    courseName: student.profile?.courseName,
    collegeName: student.profile?.collegeName,
    semester: student.semester,
    credits: student.credits,
    preferredJobs: student.preferredJobs || [],
    competencyScores: (student.competency || []).map((c) => ({
      name: c.competency?.name,
      type: c.competency?.type,
      score: c.score
    })),
    strengths: {
      technical: (student.strengths?.technical || []).map((c) => c.name),
      behavioral: (student.strengths?.behavioral || []).map((c) => c.name)
    },
    weaknesses: {
      technical: (student.weaknesses?.technical || []).map((c) => c.name),
      behavioral: (student.weaknesses?.behavioral || []).map((c) => c.name)
    },
    personalityType: student.assessmentResult?.dominantType
      ? {
          dominant: student.assessmentResult.dominantType,
          secondary: student.assessmentResult.secondaryType
        }
      : null,
    communicationType: student.communicationResult?.dominantType
      ? {
          dominant: student.communicationResult.dominantType,
          secondary: student.communicationResult.secondaryType
        }
      : null,
    hasCompletedAssessment: Boolean(student.assessmentResult?.completedAt),
    enrollments: enrollments.map((e) => ({
      title: e.program?.title,
      type: e.program?.type,
      status: e.status,
      completionDate: e.completionDate
    })),
    jobsAndInternships: jobApplications.map((j) => ({
      title: j.jobPosting?.title,
      company: j.jobPosting?.companyName,
      type: j.jobPosting?.postingType,
      status: j.status
    })),
    liveProjects: liveProjectSummary
  };
};

/* ------------------------------------------------------------------ */
/* 2. Candidate catalog — real, eligible, open items the AI may pick   */
/* ------------------------------------------------------------------ */

export const buildCandidateCatalog = async (rawStudent) => {
  const year = rawStudent.profile?.yearOfCourse || 1;
  const stream = rawStudent.profile?.stream;

  const [courses, projects, postings] = await Promise.all([
    Program.find({
      status: "published",
      isActive: true,
      type: { $in: ["course", "live_course"] },
      minYearEligible: { $lte: year },
      maxYearEligible: { $gte: year }
    })
      .select(
        "title type coverImageUrl courseIntroduction.visualElements.coverImageUrl courseOverview.shortDescription " +
        "competencies durationWeeks durationHours creditCost priceInr faculty industry domain"
      )
      .populate("competencies", "name")
      .populate("faculty", "fullName")
      .populate("industry", "name")
      .populate("domain", "name")
      .limit(40)
      .lean(),
    LiveProject.find({ status: "open" })
      .select(
        "title shortDescription bannerImage skillsRequired duration projectType mode deadline " +
        "companyName employerLogo creatorRole"
      )
      .limit(40)
      .lean(),
    JobPosting.find({
      status: "open",
      isActive: true,
      $or: [
        { "restriction.minYear": { $exists: false } },
        { "restriction.minYear": { $lte: year } }
      ]
    })
      .select(
        "title companyName postingType location workMode requiredCompetencies requiredCount " +
        "compensationBenefits.salaryDetails salaryRange requiredQualifications.education " +
        "visualElements.bannerImageUrl visualElements.coverImageUrl applicationDeadline deadline restriction industry"
      )
      .populate("industry", "name")
      .limit(40)
      .lean()
  ]);

  const eligiblePostings = postings.filter((p) => {
    const streams = p.restriction?.streams;
    if (!streams || streams.length === 0) return true;
    return !stream || streams.includes(stream);
  });

  const catalogMap = new Map();

  const courseItems = courses.map((c) => {
    catalogMap.set(String(c._id), { itemType: "course", title: c.title });
    return {
      id: String(c._id),
      title: c.title,
      type: c.type,
      summary: c.courseOverview?.shortDescription || "",
      competencies: (c.competencies || []).map((x) => x.name),
      competency: c.competencies?.[0]?.name,
      durationWeeks: c.durationWeeks,
      durationHours: c.durationHours,
      creditCost: c.creditCost,
      coverImageUrl: c.coverImageUrl || c.courseIntroduction?.visualElements?.coverImageUrl,
      facultyName: c.faculty?.fullName,
      industry: c.industry?.name,
      domain: c.domain?.name
    };
  });

  const projectItems = projects.map((p) => {
    catalogMap.set(String(p._id), { itemType: "project", title: p.title });
    return {
      id: String(p._id),
      title: p.title,
      shortDescription: p.shortDescription,
      summary: p.shortDescription,
      skillsRequired: p.skillsRequired || [],
      skills: p.skillsRequired || [],
      duration: p.duration,
      mode: p.mode,
      coverImageUrl: p.bannerImage,
      companyName: p.companyName,
      employerLogo: p.employerLogo,
      creatorRole: p.creatorRole
    };
  });

  const postingItems = eligiblePostings.map((p) => {
    const itemType = p.postingType === "internship" ? "internship" : "job";
    catalogMap.set(String(p._id), { itemType, title: p.title });
    return {
      id: String(p._id),
      itemType,
      title: p.title,
      companyName: p.companyName,
      company: p.companyName,
      location: p.location,
      workMode: p.workMode,
      requiredCompetencies: p.requiredCompetencies || [],
      skills: p.requiredCompetencies || [],
      competencies: p.requiredCompetencies || [],
      requiredCount: p.requiredCount,
      openings: p.requiredCount,
      stipend: p.compensationBenefits?.salaryDetails || p.salaryRange?.text,
      eligibility: (p.requiredQualifications?.education || []).join(", "),
      bannerImageUrl: p.visualElements?.bannerImageUrl || p.visualElements?.coverImageUrl,
      deadline: p.applicationDeadline || p.deadline,
      applicationDeadline: p.applicationDeadline || p.deadline,
      postedAt: p.createdAt,
      industry: p.industry?.name
    };
  });

  return {
    catalogMap,
    catalogForPrompt: { courses: courseItems, liveProjects: projectItems, jobsAndInternships: postingItems }
  };
};

/* ------------------------------------------------------------------ */
/* 3. System prompt — SensAI persona, derived from the sensAI script   */
/* ------------------------------------------------------------------ */

const SYSTEM_PRINCIPLES = `You are SensAI, the personal AI career mentor inside EmployU, a platform where students build
employability through courses, live projects and internships/jobs posted by employers.

Your purpose: guide each student toward their stated or still-unstated career ambitions by
recommending the best-fit live projects, courses and internships/jobs available on EmployU, helping
them build real evidence of their capabilities and stand out among peers in interviews.

Interaction principles (follow these in every reply):
- Conversational, not interrogative: ask at most one or two questions at a time, and build on what
  the student has already told you.
- Exploratory, not prescriptive: treat early career preferences as hypotheses to explore, not fixed
  decisions. Never claim you can infer a student's hidden ambitions from a single assessment — form
  tentative hypotheses, ask thoughtful questions, and refine your understanding as you learn more.
- Personalized, not generic: always explain WHY you are recommending something, connecting it
  explicitly to the student's goals, assessment results, competency scores or current gaps.
- Action-oriented: end with a useful next step, not just information.
- Encouraging, not judgmental: never make a student feel inadequate for lacking a skill or clarity.
- Warm, human, concise. Use short paragraphs. Markdown is supported (use it sparingly: bold for
  emphasis, short bullet lists when comparing options).

RECOMMENDING ITEMS — CRITICAL RULES:
- You may only recommend items that appear in the CANDIDATE CATALOG provided below. Never invent a
  course, project, internship or job, and never recommend something not in the catalog.
- When you recommend a specific item, write a tag of the exact form [[rec:TYPE:ID]] immediately
  followed by a short sentence (in the same paragraph) explaining why it fits this student. TYPE is
  one of course, project, internship, job. ID is the exact id string from the catalog.
  Example: "[[rec:course:66f1a2b3c4d5e6f7a8b9c0d1]] This sharpens the Data Visualization competency
  your assessment flagged as a gap, directly relevant to the Analytics roles you're exploring."
- Recommend at most 3 items in a single reply unless the student explicitly asks for more options.
- Do not fabricate the tag format or IDs — copy IDs exactly as given in the catalog.

You will be given the STUDENT PROFILE (their competencies, assessment results, preferences, current
enrollments, applications and project history) and the CANDIDATE CATALOG (real, currently open items
they are eligible for). Use both to ground every response.`;

export const buildSystemPrompt = (studentContext, catalogForPrompt) => {
  return `${SYSTEM_PRINCIPLES}

STUDENT PROFILE:
${JSON.stringify(studentContext, null, 2)}

CANDIDATE CATALOG (only recommend from these):
${JSON.stringify(catalogForPrompt, null, 2)}`;
};

/* ------------------------------------------------------------------ */
/* 4. Touchpoint-1 greeting — scripted, not AI-generated (instant,      */
/*    deterministic, zero API cost on "new chat")                      */
/* ------------------------------------------------------------------ */

export const GREETING_OPTIONS = [
  { key: "projects", label: "Live projects for me" },
  { key: "courses", label: "Courses I should take up" },
  { key: "internships", label: "Internships toward my goals" }
];

/**
 * Scripted Touchpoint-1 opening, split into short messages that the client
 * reveals one by one. The last message asks where the student needs guidance
 * and carries three clickable options.
 */
export const buildGreetingMessages = (studentContext) => {
  const firstName = (studentContext.fullName || "there").split(" ")[0];
  const assessmentLine = studentContext.hasCompletedAssessment
    ? "Your assessment gives me a good first picture of you."
    : "I'll get to know you better as we talk.";

  return [
    { content: `Hi ${firstName}! I'm **SensAI**, your AI career mentor on EmployU.` },
    { content: assessmentLine },
    { content: "Together we'll find the live projects, courses and internships that move you toward your goals." },
    {
      content: "Where do you need my guidance in your journey?",
      options: GREETING_OPTIONS
    }
  ];
};


/* ------------------------------------------------------------------ */
/* 5. Streaming chat                                                   */
/* ------------------------------------------------------------------ */

export const streamChatCompletion = async function* ({ systemPrompt, history, userMessage }) {
  const client = getClient();

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage }
  ];

  const stream = await client.chat.completions.create({
    model: MODEL,
    messages,
    stream: true,
    temperature: 0.7,
    max_tokens: 900
  });

  for await (const chunk of stream) {
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) yield delta;
  }
};

/* ------------------------------------------------------------------ */
/* 6. Resolve [[rec:type:id]] tags against the catalog after streaming */
/* ------------------------------------------------------------------ */

const REC_TAG_REGEX = /\[\[rec:(course|project|internship|job):([a-fA-F0-9]{24})\]\]/g;

export const resolveRecommendations = (fullText, catalogMap) => {
  const recommendations = [];
  const seen = new Set();
  let match;

  while ((match = REC_TAG_REGEX.exec(fullText)) !== null) {
    const [fullTag, taggedType, id] = match;
    const catalogEntry = catalogMap.get(id);
    if (!catalogEntry) continue; // drop hallucinated / unknown ids
    if (seen.has(id)) continue;
    seen.add(id);

    const tailStart = match.index + fullTag.length;
    const tail = fullText.slice(tailStart, tailStart + 240);
    const reason = tail.split(/\n{2,}/)[0].split(/\[\[rec:/)[0].trim();

    recommendations.push({
      itemType: catalogEntry.itemType,
      itemId: id,
      title: catalogEntry.title,
      reason
    });
  }

  return recommendations;
};
