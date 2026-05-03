import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import Program from "./src/models/Program.js";
import Faculty from "./src/models/Faculty.js";
import JobPosting from "./src/models/JobPosting.js";

dotenv.config();

const courses = [
  {
    title: 'Advanced React patterns & Performance',
    facultyName: 'Dr. Meera Iyer',
    type: 'course',
    competency: 'Technical Skills',
    creditCost: 150,
  },
  {
    title: 'Product Management Fundamentals',
    facultyName: 'Rahul Singh',
    type: 'live_project',
    competency: 'Business',
    creditCost: 300,
  },
  {
    title: 'UI/UX Design Systems',
    facultyName: 'Sarah Jenna',
    type: 'course',
    competency: 'Design',
    creditCost: 200,
  },
  {
    title: 'Effective Business Communication',
    facultyName: 'Dr. John Doe',
    type: 'course',
    competency: 'Communication',
    creditCost: 100,
  },
  {
    title: 'Data Structures and Algorithms',
    facultyName: 'Anil Gupta',
    type: 'course',
    competency: 'Problem Solving',
    creditCost: 250,
  },
  {
    title: 'Leadership in Tech',
    facultyName: 'Dr. Meera Iyer',
    type: 'live_project',
    competency: 'Leadership',
    creditCost: 400,
  }
];

const jobs = [
  {
    title: 'Frontend React Developer',
    companyName: 'TechCorp India',
    industry: 'IT',
    function: 'Development',
    description: 'Great frontend job.',
    requiredCompetencies: ['React', 'TypeScript', 'Problem Solving'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Junior Product Manager',
    companyName: 'InnovateX',
    industry: 'Product',
    function: 'Management',
    description: 'Product manager track.',
    requiredCompetencies: ['Communication', 'Analytical Thinking', 'Business'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'UI/UX Designer',
    companyName: 'DesignWorks',
    industry: 'Design',
    function: 'UI/UX',
    description: 'Design role.',
    requiredCompetencies: ['Figma', 'User Research', 'Design Systems'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Software Development Engineer',
    companyName: 'Global Systems',
    industry: 'IT',
    function: 'Backend',
    description: 'Core engineering.',
    requiredCompetencies: ['Java', 'Spring Boot', 'System Design'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing DB...");
    await Program.deleteMany();
    await Faculty.deleteMany();
    await JobPosting.deleteMany();

    console.log("Creating Faculty...");
    const facultyMap = {};
    const facultyNames = [...new Set(courses.map(c => c.facultyName))];
    for (const name of facultyNames) {
      const fac = await Faculty.create({
        fullName: name,
        email: `${name.replace(/\s+/g, '').toLowerCase()}@example.com`,
        bio: `${name} is an experienced instructor.`,
        expertise: ['General']
      });
      facultyMap[name] = fac._id;
    }

    console.log("Creating Programs...");
    for (const c of courses) {
      await Program.create({
        title: c.title,
        description: c.title + " comprehensive description.",
        type: c.type,
        faculty: facultyMap[c.facultyName],
        competencies: [c.competency],
        creditCost: c.creditCost,
        isActive: true
      });
    }

    console.log("Creating Jobs...");
    for (const j of jobs) {
      await JobPosting.create(j);
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed", error);
    process.exit(1);
  }
};

seedData();
