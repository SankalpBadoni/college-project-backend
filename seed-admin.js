import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

// Import Models
import Admin from "./src/models/Admin.js";
import Student from "./src/models/Student.js";
import Faculty from "./src/models/Faculty.js";
import Employer from "./src/models/Employer.js";
import Program from "./src/models/Program.js";
import Enrollment from "./src/models/Enrollment.js";
import MailCampaign from "./src/models/MailCampaign.js";

dotenv.config();

const seedAdmins = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding admin and portal data...");

    // 1. Clear existing admin and portal data
    await Admin.deleteMany();
    await MailCampaign.deleteMany();
    
    // We can also clear and reseed students, enrollments, faculty, employers to have controlled mock records
    await Student.deleteMany();
    await Faculty.deleteMany();
    await Employer.deleteMany();
    await Program.deleteMany();
    await Enrollment.deleteMany();

    console.log("Cleared Admin, MailCampaign, Student, Faculty, Employer, Program, and Enrollment collections.");

    // 2. Create Hashed Passwords
    const hashedPassword = await bcrypt.hash("password123", 10);

    // 3. Seed Admins
    console.log("Seeding Admins...");
    const dean = await Admin.create({
      name: "Dr. Meera Iyer",
      email: "dean@employu.com",
      password: hashedPassword,
      role: "dean",
      college: "Delhi Technological University"
    });

    const uniAdmin = await Admin.create({
      name: "Ayush Sharma",
      email: "admin@employu.com",
      password: hashedPassword,
      role: "university_admin",
      college: "Delhi Technological University"
    });

    const superAdmin = await Admin.create({
      name: "Sameer Sen",
      email: "superadmin@employu.com",
      password: hashedPassword,
      role: "employu_team",
      college: "EmployU HQ"
    });

    console.log("Admins seeded: Dean, Uni Admin, Super Admin.");

    // 4. Seed Faculty
    console.log("Seeding Faculty...");
    const faculty1 = await Faculty.create({
      fullName: "Dr. Sarah Jenkins",
      email: "sarah.j@college.edu",
      password: hashedPassword,
      phone: "+91 9876543210",
      gender: "Female",
      professionalProfile: {
        describesBest: "Industry Expert",
        otherDescription: "12 years in UX Design"
      },
      profile: {
        headline: "Lead UX Researcher at Google & Professor",
        bio: "Specializing in design systems, accessibility, and user research methodologies.",
        linkedinUrl: "https://linkedin.com/in/sarah-jenkins"
      },
      isApproved: true,
      approvedAt: new Date()
    });

    const faculty2 = await Faculty.create({
      fullName: "Prof. Rajesh Kumar",
      email: "rajesh.k@college.edu",
      password: hashedPassword,
      phone: "+91 9812345678",
      gender: "Male",
      professionalProfile: {
        describesBest: "Retired Academician",
        otherDescription: "Former HOD Computer Science"
      },
      profile: {
        headline: "Algorithms Researcher & Author",
        bio: "Published over 40 papers in competitive programming and graph theory.",
        linkedinUrl: "https://linkedin.com/in/rajesh-kumar"
      },
      isApproved: false // Awaiting approval
    });

    const faculty3 = await Faculty.create({
      fullName: "Amit Verma",
      email: "amit.v@college.edu",
      password: hashedPassword,
      phone: "+91 9999888877",
      gender: "Male",
      professionalProfile: {
        describesBest: "Others",
        otherDescription: "Product Lead at InnovateX"
      },
      profile: {
        headline: "Product Management Consultant",
        bio: "Building enterprise software and teaching scalable product practices.",
        linkedinUrl: "https://linkedin.com/in/amit-verma"
      },
      isApproved: false // Awaiting approval
    });

    console.log("Faculty seeded.");

    // 5. Seed Employers
    console.log("Seeding Employers...");
    const employer1 = await Employer.create({
      companyName: "TechCorp India",
      divisionDept: "Engineering Division",
      approvingAuthority: { name: "Rohan Das", dept: "HR Global" },
      contactPerson: {
        name: "Rahul Kapoor",
        dept: "Talent Acquisition",
        email: "rahul@techcorp.com",
        phone: "+91 9555123456"
      },
      password: hashedPassword,
      tier: "premium",
      industry: "IT & Software",
      website: "https://techcorp.com",
      logoUrl: "https://logo.clearbit.com/techcorp.com",
      isApproved: true,
      approvedAt: new Date()
    });

    const employer2 = await Employer.create({
      companyName: "InnovateX Labs",
      divisionDept: "Product Innovations",
      approvingAuthority: { name: "Sneha Reddy", dept: "Operations" },
      contactPerson: {
        name: "Vikram Malhotra",
        dept: "People Ops",
        email: "vikram@innovatex.co",
        phone: "+91 9222333444"
      },
      password: hashedPassword,
      tier: "normal",
      industry: "AI & Consulting",
      website: "https://innovatex.co",
      logoUrl: "https://logo.clearbit.com/innovatex.co",
      isApproved: false // Pending approval
    });

    const employer3 = await Employer.create({
      companyName: "Credo Edutech",
      divisionDept: "Content & Pedagogy",
      approvingAuthority: { name: "Dr. K. Raghavan", dept: "Board" },
      contactPerson: {
        name: "Riya Sen",
        dept: "University Relations",
        email: "riya@credo.edu",
        phone: "+91 9111222333"
      },
      password: hashedPassword,
      tier: "normal",
      industry: "Ed-Tech",
      website: "https://credo.edu",
      logoUrl: "https://logo.clearbit.com/credo.edu",
      isApproved: false // Pending approval
    });

    console.log("Employers seeded.");

    // 6. Seed Programs (Courses)
    console.log("Seeding Programs/Courses...");
    const course1 = await Program.create({
      title: "Advanced React Patterns & Performance",
      description: "Master advanced React hooks, concurrent rendering, virtual DOM optimization, and design patterns for building scalable client applications.",
      type: "course",
      status: "published",
      faculty: faculty1._id,
      creditCost: 150,
      priceInr: 2500,
      durationHours: 36,
      maxStudents: 150,
      courseOverview: {
        shortDescription: "MASTER REACT HOOKS, PERFORMANCE TUNING, AND COMPONENT ARCHITECTURE.",
        targetAudience: ["2nd Year Students", "3rd Year Students", "4th Year Students"],
        learningOutcomes: ["Master Custom Hooks & Context", "Optimize Render Performance", "Understand React Concurrent Mode"],
        numberOfModules: 6,
        numberOfLessons: 24
      },
      placementStats: {
        successfulPlacementsCount: 48,
        companies: ["TechCorp India", "Amazon", "InnovateX"]
      }
    });

    const course2 = await Program.create({
      title: "Data Structures & Competitive Algorithms",
      description: "A comprehensive deep dive into binary trees, graphs, sorting, searching, dynamic programming, and visual problem solving.",
      type: "course",
      status: "published",
      faculty: faculty2._id,
      creditCost: 250,
      priceInr: 4000,
      durationHours: 60,
      maxStudents: 200,
      courseOverview: {
        shortDescription: "CRACK CODING INTERVIEWS WITH CORE PROBLEM SOLVING CAPABILITIES.",
        targetAudience: ["1st Year Students", "2nd Year Students", "3rd Year Students"],
        learningOutcomes: ["Master Trees & Graphs", "Excel in Dynamic Programming", "Optimize Time Complexity"],
        numberOfModules: 10,
        numberOfLessons: 50
      },
      placementStats: {
        successfulPlacementsCount: 72,
        companies: ["Google", "Microsoft", "Global Systems"]
      }
    });

    const course3 = await Program.create({
      title: "UI/UX Design Systems & Figma Workflow",
      description: "Learn to build comprehensive, responsive design libraries in Figma, apply typography scales, and conduct usability testing.",
      type: "live_course",
      status: "published",
      faculty: faculty1._id,
      creditCost: 200,
      priceInr: 3000,
      durationHours: 40,
      maxStudents: 80,
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      courseOverview: {
        shortDescription: "BUILD PRODUCTION-READY DESIGN SYSTEMS IN FIGMA AND WIREFRAME COMPLEX APPLICATIONS.",
        targetAudience: ["All Students"],
        learningOutcomes: ["Create Responsive Design Systems", "Conduct User Research Sessions", "Export Interactive Prototypes"],
        numberOfModules: 8,
        numberOfLessons: 32
      },
      placementStats: {
        successfulPlacementsCount: 30,
        companies: ["DesignWorks", "Credo Ed", "InnovateX"]
      }
    });

    const course4 = await Program.create({
      title: "Product Management Strategy & Launch",
      description: "Learn market research, metrics analysis, customer personas, agile development, and release methodologies.",
      type: "live_project",
      status: "published",
      employer: employer1._id,
      creditCost: 350,
      priceInr: 5000,
      durationHours: 48,
      maxStudents: 50,
      courseOverview: {
        shortDescription: "LIVE ON-THE-JOB PRODUCT SPECIFICATIONS AND STRATEGIC MARKETING FEASIBILITY.",
        targetAudience: ["3rd Year Students", "4th Year Students", "Postgraduates"],
        learningOutcomes: ["Formulate Product PRDs", "Establish Agile Scrum Sprints", "Define AARRR Pirate Metrics"],
        numberOfModules: 4,
        numberOfLessons: 16
      },
      placementStats: {
        successfulPlacementsCount: 15,
        companies: ["TechCorp India", "InnovateX Labs"]
      }
    });

    console.log("Programs/Courses seeded.");

    // 7. Seed Students
    console.log("Seeding Students...");
    const student1 = await Student.create({
      fullName: "Arjun Sharma",
      email: "arjun@college.edu",
      password: hashedPassword,
      phone: "+91 9988776655",
      profile: {
        collegeName: "Delhi Technological University",
        collegeId: "DTU/2023/CS/104",
        studentId: "STU001",
        courseName: "B.Tech Computer Science",
        yearOfCourse: 3,
        stream: "Science",
        gender: "Male"
      },
      credits: 240
    });

    const student2 = await Student.create({
      fullName: "Priya Patel",
      email: "priya@college.edu",
      password: hashedPassword,
      phone: "+91 9988776644",
      profile: {
        collegeName: "Delhi Technological University",
        collegeId: "DTU/2023/IT/042",
        studentId: "STU002",
        courseName: "B.Tech Information Technology",
        yearOfCourse: 3,
        stream: "Science",
        gender: "Female"
      },
      credits: 310
    });

    const student3 = await Student.create({
      fullName: "Rohan Gupta",
      email: "rohan@college.edu",
      password: hashedPassword,
      phone: "+91 9988776633",
      profile: {
        collegeName: "Delhi Technological University",
        collegeId: "DTU/2024/SE/098",
        studentId: "STU003",
        courseName: "B.Tech Software Engineering",
        yearOfCourse: 2,
        stream: "Science",
        gender: "Male"
      },
      credits: 150
    });

    const student4 = await Student.create({
      fullName: "Anjali Rao",
      email: "anjali@college.edu",
      password: hashedPassword,
      phone: "+91 9988776622",
      profile: {
        collegeName: "Netaji Subhas University of Tech",
        collegeId: "NSUT/2023/ECE/205",
        studentId: "STU004",
        courseName: "B.Tech Electronics & Comm",
        yearOfCourse: 3,
        stream: "Science",
        gender: "Female"
      },
      credits: 420
    });

    console.log("Students seeded.");

    // 8. Seed Enrollments
    console.log("Seeding Enrollments...");
    
    // Enrollments for Student 1
    await Enrollment.create({
      student: student1._id,
      program: course1._id,
      status: "ongoing",
      enrollmentMode: "credits",
      creditsUsed: 150
    });

    await Enrollment.create({
      student: student1._id,
      program: course2._id,
      status: "booked",
      enrollmentMode: "payment",
      amountPaidInr: 4000
    });

    // Enrollments for Student 2
    await Enrollment.create({
      student: student2._id,
      program: course1._id,
      status: "completed",
      enrollmentMode: "credits",
      creditsUsed: 150,
      completionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    });

    await Enrollment.create({
      student: student2._id,
      program: course3._id,
      status: "ongoing",
      enrollmentMode: "payment",
      amountPaidInr: 3000
    });

    // Enrollments for Student 3
    await Enrollment.create({
      student: student3._id,
      program: course2._id,
      status: "ongoing",
      enrollmentMode: "credits",
      creditsUsed: 250
    });

    // Enrollments for Student 4
    await Enrollment.create({
      student: student4._id,
      program: course1._id,
      status: "completed",
      enrollmentMode: "payment",
      amountPaidInr: 2500,
      completionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    await Enrollment.create({
      student: student4._id,
      program: course4._id,
      status: "ongoing",
      enrollmentMode: "credits",
      creditsUsed: 350
    });

    console.log("Enrollments seeded.");

    // 9. Seed MailCampaigns
    console.log("Seeding MailCampaigns...");
    await MailCampaign.create({
      title: "Upcoming Placement Drive",
      subject: "Apply to TechCorp's Premium Software Engineering Roles",
      content: "<h1>EmployU Placement Drive</h1><p>We are excited to announce TechCorp's premium placement hiring starting next Monday. Make sure your profile scores are updated!</p>",
      recipientGroup: "Students",
      templateType: "Placement Drives",
      status: "Sent",
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      recipientCount: 542
    });

    await MailCampaign.create({
      title: "New Courses Alert",
      subject: "Hot & Live Learning Pathways Released for May 2026",
      content: "<h1>New Advanced Courses Available</h1><p>Discover new self-paced and live modules in React Performance and PM Strategy.</p>",
      recipientGroup: "All Users",
      templateType: "New Courses This Fortnight",
      status: "Sent",
      sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      recipientCount: 1205
    });

    await MailCampaign.create({
      title: "Faculty Workshop Invites",
      subject: "Interactive Pedagogy Masterclass - Scheduled",
      content: "<h1>Faculty Professional Development</h1><p>Join our curriculum panel next Friday for an interactive syllabus mapping session.</p>",
      recipientGroup: "Faculty",
      templateType: "Upcoming Courses",
      status: "Scheduled",
      scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      recipientCount: 24
    });

    console.log("MailCampaigns seeded.");

    console.log("\n=======================================================");
    console.log("ALL DATA SEEDED SUCCESSFULLY IN MONGODB ATLAS!");
    console.log("=======================================================");
    console.log("Dean login: dean@employu.com / password123");
    console.log("Uni Admin login: admin@employu.com / password123");
    console.log("EmployU Team login: superadmin@employu.com / password123");
    console.log("=======================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding admins & portal data failed:", error);
    process.exit(1);
  }
};

seedAdmins();
