import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import JobPosting from "./src/models/JobPosting.js";
import { Competency } from "./src/models/Competency.js";

dotenv.config();

const jobsData = [
  {
    title: "Software Engineer (Frontend)",
    companyName: "TechVibe Solutions",
    description: "Join our cutting-edge frontend engineering team to build the next generation of collaborative workspace web applications.",
    location: "Bangalore, India",
    workMode: "hybrid",
    postingType: "job",
    employmentType: "full-time",
    salaryRange: {
      min: 1200000,
      max: 1800000,
      currency: "INR",
      text: "₹12L - ₹18L per annum"
    },
    isUrgent: true,
    requiredCount: 3,
    aboutCompany: {
      companyDescription: "TechVibe is a fast-growing SaaS firm developing premium workspace productivity tools.",
      industry: "Information Technology",
      mission: "To elevate teamwork through beautifully designed digital tools.",
      website: "https://techvibe.example.com"
    },
    jobDescription: {
      roleSummary: "You will collaborate with designers and product managers to develop fully responsive, highly interactive web applications.",
      purpose: "Deliver sleek interface elements with micro-animations and optimize state management.",
      organizationalFit: "Best suited for passionate creators who value visual excellence and modular, clean code."
    },
    keyResponsibilities: [
      "Develop new user-facing features using React.js and TypeScript.",
      "Collaborate with UI/UX designers to translate Figma design tokens into pristine vanilla CSS.",
      "Build reusable components and front-end libraries for future use.",
      "Optimize applications for maximum speed and scalability."
    ],
    requiredQualifications: {
      education: ["B.Tech/B.E. in Computer Science or equivalent"],
      technicalSkills: ["Programming", "Data structures", "API development", "Version control"],
      softSkills: ["Logical thinking", "Collaboration", "Problem solving"],
      experienceLevel: "1-3 Years"
    },
    preferredQualifications: {
      niceToHaveSkills: ["Figma", "TailwindCSS", "Next.js"],
      certifications: ["React Developer Certification"],
      bonusExperience: ["Experience working in product-focused startups"]
    },
    compensationBenefits: {
      salaryDetails: "Competitive base salary with annual performance bonuses.",
      perks: ["Health Insurance", "MacBook Pro", "Annual Wellness Stipend"],
      growthOpportunities: ["Transition to Senior Frontend Engineer or Team Lead in 2 years"]
    },
    applicationProcess: {
      howToApply: "Apply directly through our portal or submit your LinkedIn profile.",
      requiredDocuments: ["Resume", "GitHub Profile Link", "Portfolio link"],
      hiringSteps: ["Resume Screening", "Technical Assignment", "System Design Interview", "HR Fit Interview"]
    },
    industry: "Information Technology",
    function: "Software Development",
    tagType: "employer_preferred",
    visualElements: {
      accentColor: "#3b82f6"
    }
  },
  {
    title: "Quality Assurance Engineer Intern",
    companyName: "Precision Manufacturing Corp",
    description: "Learn and contribute to physical safety and ISO standard maintenance in a high-tech manufacturing environment.",
    location: "Pune, India",
    workMode: "onsite",
    postingType: "internship",
    employmentType: "internship",
    salaryRange: {
      min: 25000,
      max: 35000,
      currency: "INR",
      text: "₹25k - ₹35k monthly stipend"
    },
    isUrgent: false,
    requiredCount: 2,
    aboutCompany: {
      companyDescription: "Precision Manufacturing Corp specializes in automotive engine component design.",
      industry: "Manufacturing",
      mission: "Zero-defect delivery using advanced mechanical analytics.",
      website: "https://precisioncorp.example.com"
    },
    jobDescription: {
      roleSummary: "Shadow the lead quality assurance engineers and assist in visual inspections, logging metrics, and auditing.",
      purpose: "Provide essential audit support for ISO certification renewals.",
      organizationalFit: "Fits organized individuals who follow work instructions with discipline."
    },
    keyResponsibilities: [
      "Perform regular visual quality inspections on the assembly line.",
      "Participate in root cause analysis for any defective production batches.",
      "Analyze process capability using statistical process control methods."
    ],
    requiredQualifications: {
      education: ["Pursuing B.Tech/Diploma in Mechanical/Production Engineering"],
      technicalSkills: ["Quality inspection", "Root cause analysis", "Statistical process control"],
      softSkills: ["Attention to detail", "Process discipline", "Problem solving"],
      experienceLevel: "Freshers"
    },
    preferredQualifications: {
      niceToHaveSkills: ["ISO standards awareness", "SolidWorks basics"],
      certifications: ["Six Sigma White Belt"],
      bonusExperience: ["Prior academic projects on manufacturing processes"]
    },
    compensationBenefits: {
      salaryDetails: "Fixed stipend with performance incentives.",
      perks: ["Company shuttle service", "Subsidized cafeteria meals"],
      growthOpportunities: ["PPO opportunity upon completion based on performance assessment"]
    },
    applicationProcess: {
      howToApply: "Submit your academic transcript and resume.",
      requiredDocuments: ["Resume", "College NOC certificate"],
      hiringSteps: ["Technical test", "F2F Interview"]
    },
    industry: "Manufacturing",
    function: "Quality Management",
    tagType: "normal",
    visualElements: {
      accentColor: "#f59e0b"
    }
  },
  {
    title: "Data Science & ML Intern",
    companyName: "Cognitive Labs",
    description: "Work remotely with a world-class AI/ML research team to train state-of-the-art Large Language Models and automate pipelines.",
    location: "Remote, India",
    workMode: "remote",
    postingType: "internship",
    employmentType: "internship",
    salaryRange: {
      min: 40000,
      max: 60000,
      currency: "INR",
      text: "₹40k - ₹60k monthly stipend"
    },
    isUrgent: true,
    requiredCount: 4,
    aboutCompany: {
      companyDescription: "Cognitive Labs is an AI-first venture building agentic AI layers for healthcare applications.",
      industry: "Artificial Intelligence & Machine Learning",
      mission: "Democratizing complex intelligence through generative computing.",
      website: "https://cognitivelabs.example.com"
    },
    jobDescription: {
      roleSummary: "Prepare custom datasets, perform data annotations, write feature engineering pipelines, and evaluate trained weights.",
      purpose: "Support raw dataset formatting for new clinical model iterations.",
      organizationalFit: "Perfect for research-focused minds who love high-dimensional optimization challenges."
    },
    keyResponsibilities: [
      "Collect, label, and cleanse diverse training datasets.",
      "Conduct experiment cycles with Python, PyTorch, and HuggingFace APIs.",
      "Create detailed documentation of model performance and bias evaluations."
    ],
    requiredQualifications: {
      education: ["Pursuing M.Tech/B.Tech in Computer Science, Data Science, or related field"],
      technicalSkills: ["Model development", "Feature engineering", "Model evaluation", "Python programming"],
      softSkills: ["Analytical thinking", "Curiosity", "Problem solving"],
      experienceLevel: "Freshers"
    },
    preferredQualifications: {
      niceToHaveSkills: ["Deep learning frameworks", "GPU memory optimization"],
      certifications: ["TensorFlow Developer Certificate"],
      bonusExperience: ["GitHub repositories showcasing ML project pipelines"]
    },
    compensationBenefits: {
      salaryDetails: "Highly competitive remote internship stipend.",
      perks: ["Remote Work Setup Kit", "Nvidia GPU compute credits"],
      growthOpportunities: ["Direct access to fully funded PhD sponsorships or permanent engineer positions"]
    },
    applicationProcess: {
      howToApply: "Provide links to your Kaggle or GitHub profile.",
      requiredDocuments: ["Resume", "GitHub link"],
      hiringSteps: ["Coding Assessment", "ML concepts interview", "HR review"]
    },
    industry: "Artificial Intelligence & Machine Learning",
    function: "Machine Learning Engineering",
    tagType: "hot_job_linked",
    visualElements: {
      accentColor: "#8b5cf6"
    }
  },
  {
    title: "Product Operations Intern",
    companyName: "SkillSurge EdTech",
    description: "Support user growth metrics, LMS systems admin, and digital content pipelines for our vocational training products.",
    location: "Gurugram, India",
    workMode: "hybrid",
    postingType: "internship",
    employmentType: "internship",
    salaryRange: {
      min: 20000,
      max: 30000,
      currency: "INR",
      text: "₹20k - ₹30k monthly stipend"
    },
    isUrgent: false,
    requiredCount: 1,
    aboutCompany: {
      companyDescription: "SkillSurge is India's leading gamified microlearning platform for engineering graduates.",
      industry: "EdTech",
      mission: "Bridge the gap between college education and industry-readiness.",
      website: "https://skillsurge.example.com"
    },
    jobDescription: {
      roleSummary: "You will collaborate with content creators and program managers to oversee course material publishing and evaluate customer metrics.",
      purpose: "Maintain operational readiness of the platform's career assessment engines.",
      organizationalFit: "Ideal for empathetic listeners who love analyzing student journeys."
    },
    keyResponsibilities: [
      "Assist in uploading course materials and assessments to the LMS.",
      "Track and compile weekly user behavior analytics and progress data.",
      "Gather user feedback and suggest feature tweaks to developers."
    ],
    requiredQualifications: {
      education: ["Any graduate degree or final year undergraduate student"],
      technicalSkills: ["LMS administration", "User analytics", "Content uploading", "Learning journey design"],
      softSkills: ["Learner empathy", "Problem solving", "Ownership"],
      experienceLevel: "Freshers"
    },
    preferredQualifications: {
      niceToHaveSkills: ["Excel macros", "SQL basics"],
      certifications: [],
      bonusExperience: ["Active volunteering roles in campus clubs"]
    },
    compensationBenefits: {
      salaryDetails: "Fixed stipend with potential conversion bonus.",
      perks: ["Free courses access", "SkillSurge branded hoodies"],
      growthOpportunities: ["Conversion to full-time Associate Product Manager in EdTech"]
    },
    applicationProcess: {
      howToApply: "Apply with a small statement of purpose on 'Why Edtech?'.",
      requiredDocuments: ["Resume", "SOP Document"],
      hiringSteps: ["Screening Interview", "Product Case assignment"]
    },
    industry: "EdTech",
    function: "Learning Platform Management",
    tagType: "normal",
    visualElements: {
      accentColor: "#10b981"
    }
  },
  {
    title: "Associate Cybersecurity Analyst",
    companyName: "SecureBlock Systems",
    description: "Secure and audit our client networks, configure firewall rules, monitor real-time threat dashboards, and mitigate active incursions.",
    location: "Remote, India",
    workMode: "remote",
    postingType: "job",
    employmentType: "full-time",
    salaryRange: {
      min: 800000,
      max: 1300000,
      currency: "INR",
      text: "₹8L - ₹13L per annum"
    },
    isUrgent: false,
    requiredCount: 2,
    aboutCompany: {
      companyDescription: "SecureBlock is a globally trusted managed security service provider (MSSP) handling multi-tenant SOCs.",
      industry: "Cybersecurity",
      mission: "Build unbreakable shields in a vulnerable digital world.",
      website: "https://secureblock.example.com"
    },
    jobDescription: {
      roleSummary: "Provide round-the-clock shift-based security monitoring, investigate alerts, analyze packets, and draft incident reports.",
      purpose: "Prevent unauthorized intrusion into customer payment networks.",
      organizationalFit: "Fits vigilant individuals with high ethical standards who remain calm under extreme pressure."
    },
    keyResponsibilities: [
      "Perform real-time threat monitoring and log analysis using SIEM tools.",
      "Respond immediately to security incidents and orchestrate initial triage.",
      "Perform routine secure-code scanning and vulnerability assessments."
    ],
    requiredQualifications: {
      education: ["B.E/B.Tech/B.Sc in Cyber Security, IT, or Computer Science"],
      technicalSkills: ["Threat monitoring", "SIEM tools", "Incident response", "Log analysis"],
      softSkills: ["Alertness", "Calm under pressure", "Analytical thinking", "Confidentiality"],
      experienceLevel: "1-2 Years"
    },
    preferredQualifications: {
      niceToHaveSkills: ["Penetration testing", "OWASP knowledge", "Linux shell scripting"],
      certifications: ["CEH (Certified Ethical Hacker)", "CompTIA Security+"],
      bonusExperience: ["Familiarity with containerized application security"]
    },
    compensationBenefits: {
      salaryDetails: "Fixed base with night shift allowances.",
      perks: ["Broadband internet reimbursement", "Home office stipend"],
      growthOpportunities: ["Promotion to Senior SOC Analyst or Security Architect"]
    },
    applicationProcess: {
      howToApply: "Apply online and complete a 30-minute CTF challenges link.",
      requiredDocuments: ["Resume", "CTF score report", "Certificates copy"],
      hiringSteps: ["CTF Round", "Technical panel interview", "HR discussion"]
    },
    industry: "Cybersecurity",
    function: "Security Operations",
    tagType: "exclusive",
    visualElements: {
      accentColor: "#ef4444"
    }
  },
  {
    title: "Investment Banking Analyst",
    companyName: "Acre & Capital Partners",
    description: "Support our transaction team in preparing corporate valuations, executing due diligence, and compiling deal decks.",
    location: "Mumbai, India",
    workMode: "onsite",
    postingType: "job",
    employmentType: "full-time",
    salaryRange: {
      min: 1500000,
      max: 2200000,
      currency: "INR",
      text: "₹15L - ₹22L per annum"
    },
    isUrgent: true,
    requiredCount: 5,
    aboutCompany: {
      companyDescription: "Acre & Capital Partners is a leading mid-market investment bank specialized in real estate and energy sectors.",
      industry: "Financial Services",
      mission: "Maximize value creation through rigorous quantitative clarity.",
      website: "https://acrecapital.example.com"
    },
    jobDescription: {
      roleSummary: "Construct three-statement financial models, run discounted cash flow simulations, and design deal pitches.",
      purpose: "Deliver valuation reports to facilitate high-value acquisition bids.",
      organizationalFit: "Perfect for detail-oriented, highly competitive individuals with strong commercial sense."
    },
    keyResponsibilities: [
      "Perform detailed financial statement analysis and corporate valuation models.",
      "Conduct industry and market sector research to identify potential targets.",
      "Compile comprehensive pitch books and due diligence checklists."
    ],
    requiredQualifications: {
      education: ["MBA Finance / CA / CFA Candidate"],
      technicalSkills: ["Financial modeling", "Valuation", "Due diligence", "Risk analysis"],
      softSkills: ["Numerical fluency", "Integrity", "Analytical thinking", "Client orientation"],
      experienceLevel: "0-2 Years"
    },
    preferredQualifications: {
      niceToHaveSkills: ["Excel VBA", "Bloomberg terminal basics"],
      certifications: ["CFA Level 1 or higher", "FMVA"],
      bonusExperience: ["Prior internship in private equity or valuation advisory"]
    },
    compensationBenefits: {
      salaryDetails: "Attractive fixed base salary + substantial performance-linked annual bonuses.",
      perks: ["Premium corporate health cover", "Cab facility", "Free executive lunches"],
      growthOpportunities: ["Move up to Investment Banking Associate in 2-3 years"]
    },
    applicationProcess: {
      howToApply: "Submit CA transcript or CFA certificate along with your resume.",
      requiredDocuments: ["Resume", "Academic transcripts", "Cover letter"],
      hiringSteps: ["Numerical test", "Financial Modeling test", "Case Interview", "Partner Round"]
    },
    industry: "Financial Services",
    function: "Capital Markets",
    tagType: "employer_preferred",
    visualElements: {
      accentColor: "#6366f1"
    }
  },
  {
    title: "Clinical Care Coordinator",
    companyName: "PrimeHealth Hospitals",
    description: "Manage patient care pathways, ensure clinical standards adherence, coordinate resource allocations, and handle compliance.",
    location: "Chennai, India",
    workMode: "onsite",
    postingType: "job",
    employmentType: "full-time",
    salaryRange: {
      min: 500000,
      max: 800000,
      currency: "INR",
      text: "₹5L - ₹8L per annum"
    },
    isUrgent: false,
    requiredCount: 2,
    aboutCompany: {
      companyDescription: "PrimeHealth is a premier super-specialty hospital chain providing advanced cardiology and neurology care.",
      industry: "Healthcare",
      mission: "Empathetic clinical excellence above all.",
      website: "https://primehealth.example.com"
    },
    jobDescription: {
      roleSummary: "Organize outpatient flows, maintain strict medical record compliance, audit safety measures, and resolve family complaints.",
      purpose: "Bridge patient needs with diagnostic availability to enhance clinical efficiency.",
      organizationalFit: "Designed for empathetic, organized caretakers who can handle complex schedules."
    },
    keyResponsibilities: [
      "Conduct initial patient intake flow and manage emergency triage queues.",
      "Audit medical files for strict compliance with NABH / JCI standards.",
      "Coordinate bed allocation and diagnostic scheduling between wards."
    ],
    requiredQualifications: {
      education: ["B.Sc Nursing / Masters in Healthcare Administration (MHA)"],
      technicalSkills: ["Patient assessment", "Clinical procedures", "Medical documentation", "Infection control"],
      softSkills: ["Empathy", "Composure", "Ethical judgment", "Team collaboration"],
      experienceLevel: "1-3 Years"
    },
    preferredQualifications: {
      niceToHaveSkills: ["Patient flow management", "Healthcare billing tools"],
      certifications: ["Infection Control Specialist"],
      bonusExperience: ["Working experience in super-specialty ICU environments"]
    },
    compensationBenefits: {
      salaryDetails: "Fixed salary with healthcare allowances.",
      perks: ["Free diagnostic checks", "Subsidized hospital boarding"],
      growthOpportunities: ["Promoted to Assistant Hospital Superintendent"]
    },
    applicationProcess: {
      howToApply: "Submit nursing registration number or MHA degree proof.",
      requiredDocuments: ["Resume", "Nursing registration copy"],
      hiringSteps: ["Clinical test", "Operational interview", "HR fit"]
    },
    industry: "Healthcare",
    function: "Clinical Care",
    tagType: "normal",
    visualElements: {
      accentColor: "#ec4899"
    }
  },
  {
    title: "UI/UX Designer",
    companyName: "DesignGrid Studio",
    description: "Design premium responsive interfaces, translate abstract ideas into gorgeous interactive wireframes, and govern design tokens.",
    location: "Bangalore, India",
    workMode: "hybrid",
    postingType: "job",
    employmentType: "full-time",
    salaryRange: {
      min: 1000000,
      max: 1600000,
      currency: "INR",
      text: "₹10L - ₹16L per annum"
    },
    isUrgent: false,
    requiredCount: 2,
    aboutCompany: {
      companyDescription: "DesignGrid is a design agency catering to high-end SaaS startups and luxury brands globally.",
      industry: "Design & Creative",
      mission: "To elevate interface aesthetics and humanize digital platforms.",
      website: "https://designgrid.example.com"
    },
    jobDescription: {
      roleSummary: "You will define visual identities, build modular design systems in Figma, conduct user tests, and present to clients.",
      purpose: "Deliver cinematic user interfaces that delight consumers at first glance.",
      organizationalFit: "Fits highly creative souls who obsess over typography, spacing, and micro-interactions."
    },
    keyResponsibilities: [
      "Construct robust design systems and library components in Figma.",
      "Conduct qualitative user research and map comprehensive personas.",
      "Design fluid web animations and interactive mockups."
    ],
    requiredQualifications: {
      education: ["Degree/Diploma in Interaction Design, Fine Arts, or related field"],
      technicalSkills: ["Wireframing & Prototyping", "User Research", "Typography", "Visual Branding"],
      softSkills: ["Empathy", "User-Centric Thinking", "Creativity", "Attention to detail"],
      experienceLevel: "2-4 Years"
    },
    preferredQualifications: {
      niceToHaveSkills: ["CSS/HTML basics", "Adobe AfterEffects"],
      certifications: ["Google UX Design Certificate"],
      bonusExperience: ["Successfully launching digital products on ProductHunt"]
    },
    compensationBenefits: {
      salaryDetails: "Excellent package with ESOP options.",
      perks: ["Figma Enterprise membership", "Ergonomic chair stipend"],
      growthOpportunities: ["Lead Designer or Head of UX role in 3 years"]
    },
    applicationProcess: {
      howToApply: "Provide a working case study link in your CV.",
      requiredDocuments: ["Resume", "Pristine Behance/Dribbble/Figma portfolio"],
      hiringSteps: ["Portfolio Review", "Live Wireframing Exercise", "Design Critique", "CEO Round"]
    },
    industry: "Design & Creative",
    function: "UI/UX Design",
    tagType: "hot_job_linked",
    visualElements: {
      accentColor: "#14b8a6"
    }
  },
  {
    title: "Supply Chain Analyst Intern",
    companyName: "LogiNext Global",
    description: "Deep dive into route planning, inventory tracking, WMS dashboard monitoring, and vendor negotiation cycles.",
    location: "Navi Mumbai, India",
    workMode: "hybrid",
    postingType: "internship",
    employmentType: "internship",
    salaryRange: {
      min: 18000,
      max: 25000,
      currency: "INR",
      text: "₹18k - ₹25k monthly stipend"
    },
    isUrgent: false,
    requiredCount: 3,
    aboutCompany: {
      companyDescription: "LogiNext Global provides cross-border third-party logistics (3PL) solutions.",
      industry: "Logistics & Supply Chain",
      mission: "Frictionless cargo movement using predictive route AI.",
      website: "https://loginext.example.com"
    },
    jobDescription: {
      roleSummary: "Analyze shipping costs, monitor daily warehouse pick rates, and coordinate between distributors and drivers.",
      purpose: "Optimize regional dispatch routing to reduce transit fuel costs.",
      organizationalFit: "Suit individuals who like structural scheduling and quick execution."
    },
    keyResponsibilities: [
      "Track shipment movements using our WMS and prepare delivery reports.",
      "Analyze regional inventory levels to prevent shipping backlogs.",
      "Review carrier pricing contracts to suggest cost comparison metrics."
    ],
    requiredQualifications: {
      education: ["Pursuing MBA/PGDM in Logistics/Operations or B.Tech graduate"],
      technicalSkills: ["Inventory management", "Route planning", "Fleet tracking", "Demand planning"],
      softSkills: ["Time management", "Problem solving", "Coordination", "Customer orientation"],
      experienceLevel: "Freshers"
    },
    preferredQualifications: {
      niceToHaveSkills: ["SQL query basics", "PowerBI"],
      certifications: ["CSCMP Certification basics"],
      bonusExperience: ["Active management of family retail inventory"]
    },
    compensationBenefits: {
      salaryDetails: "Fixed stipend with performance-based travel allowance.",
      perks: ["Laptops provided", "Hybrid work flexibility"],
      growthOpportunities: ["Direct eligibility for Operations executive recruitment program"]
    },
    applicationProcess: {
      howToApply: "Submit application with logistics research projects mentioned.",
      requiredDocuments: ["Resume", "No Objection letter"],
      hiringSteps: ["Aptitude test", "Panel interview"]
    },
    industry: "Logistics & Supply Chain",
    function: "Warehouse Operations",
    tagType: "normal",
    visualElements: {
      accentColor: "#eab308"
    }
  },
  {
    title: "Renewable Energy Consultant",
    companyName: "Zenith Solar Systems",
    description: "Design solar PV site layouts, perform solar yield analysis, coordinate project permits, and write client energy feasibility audits.",
    location: "Jaipur, India",
    workMode: "hybrid",
    postingType: "job",
    employmentType: "full-time",
    salaryRange: {
      min: 700000,
      max: 1100000,
      currency: "INR",
      text: "₹7L - ₹11L per annum"
    },
    isUrgent: false,
    requiredCount: 2,
    aboutCompany: {
      companyDescription: "Zenith Solar Systems constructs commercial solar grids and high-yield rooftop PV systems.",
      industry: "Renewable Energy",
      mission: "Accelerate standard energy grid transition to 100% clean solar.",
      website: "https://zenithsolar.example.com"
    },
    jobDescription: {
      roleSummary: "Evaluate site specs using PVsyst, verify solar grid inverter setups, inspect panels, and draft financial ROI projections.",
      purpose: "Deliver technical proposals to secure high-value industrial client approvals.",
      organizationalFit: "Perfect for sustainability-driven analytical thinkers who enjoy site visits and design."
    },
    keyResponsibilities: [
      "Perform PV solar installation site assessments and yield calculations.",
      "Conduct energy efficiency audits for industrial factory sites.",
      "Create detailed technical CAD diagrams for solar mounting arrays."
    ],
    requiredQualifications: {
      education: ["B.E/B.Tech in Electrical / Energy Engineering or related degree"],
      technicalSkills: ["Solar PV installation", "Inverter systems", "Site assessment", "Performance monitoring"],
      softSkills: ["Adaptability", "Safety focus", "Customer orientation", "Ownership"],
      experienceLevel: "1-3 Years"
    },
    preferredQualifications: {
      niceToHaveSkills: ["AutoCAD", "PVsyst simulator software"],
      certifications: ["Certified Energy Auditor (BEE India)"],
      bonusExperience: ["Handling rooftop grid installations above 100kW"]
    },
    compensationBenefits: {
      salaryDetails: "Fixed package + performance-based site execution incentives.",
      perks: ["Travel reimbursements", "Site safety equipment kit"],
      growthOpportunities: ["Elevated to Principal Project Manager - Solar Operations"]
    },
    applicationProcess: {
      howToApply: "Apply with your solar layout design samples.",
      requiredDocuments: ["Resume", "AutoCAD Portfolio"],
      hiringSteps: ["Technical test", "CAD round", "F2F interview"]
    },
    industry: "Renewable Energy",
    function: "Solar Energy",
    tagType: "normal",
    visualElements: {
      accentColor: "#f97316"
    }
  },
  {
    title: "Digital Marketing Specialist",
    companyName: "EchoMedia Agency",
    description: "Plan and execute performance marketing campaigns, optimize organic SEO presence, govern SEM ad spend, and coordinate design briefs.",
    location: "Remote, India",
    workMode: "remote",
    postingType: "job",
    employmentType: "full-time",
    salaryRange: {
      min: 600000,
      max: 950000,
      currency: "INR",
      text: "₹6L - ₹9.5L per annum"
    },
    isUrgent: false,
    requiredCount: 2,
    aboutCompany: {
      companyDescription: "EchoMedia is a premier remote advertising firm specialized in e-commerce brand growth marketing.",
      industry: "Advertising & Marketing",
      mission: "Transform ad impressions into loyal client communities.",
      website: "https://echomedia.example.com"
    },
    jobDescription: {
      roleSummary: "Manage Meta/Google ad budgets, analyze conversion funnels, execute A/B creative tests, and communicate with clients.",
      purpose: "Scale client acquisition and lower cost-per-purchase (CPA) metrics.",
      organizationalFit: "Fits energetic, data-driven creative thinkers who love testing new concepts."
    },
    keyResponsibilities: [
      "Formulate digital marketing strategy and execute performance ad sets.",
      "Conduct extensive A/B tests on landing pages and copy designs.",
      "Draft comprehensive campaign analytics dashboards using Looker Studio."
    ],
    requiredQualifications: {
      education: ["BBA / MBA Marketing or equivalent degree / experience"],
      technicalSkills: ["SEO", "Performance marketing", "Campaign analytics", "Conversion optimization"],
      softSkills: ["Creativity", "Data orientation", "Experimentation", "Adaptability"],
      experienceLevel: "2+ Years"
    },
    preferredQualifications: {
      niceToHaveSkills: ["Photoshop basics", "Google Analytics certification"],
      certifications: ["Google Ads Search Certification"],
      bonusExperience: ["Having managed ad spend of over ₹5 Lakhs monthly"]
    },
    compensationBenefits: {
      salaryDetails: "Fixed salary with ad performance bonuses.",
      perks: ["Flexible working hours", "Home workstation upgrade allowances"],
      growthOpportunities: ["Promoted to Growth Account Director in 2 years"]
    },
    applicationProcess: {
      howToApply: "Submit CV along with performance campaign case studies.",
      requiredDocuments: ["Resume", "Ad campaign metrics report (masked)"],
      hiringSteps: ["Initial Screening", "Growth Case presentation", "Client servicing review"]
    },
    industry: "Advertising & Marketing",
    function: "Digital Marketing",
    tagType: "employer_preferred",
    visualElements: {
      accentColor: "#db2777"
    }
  },
  {
    title: "Content Creator & Videographer",
    companyName: "VlogFlow Media",
    description: "Write highly engaging video scripts, shoot cinematic social media reels, edit video content, and manage dynamic YouTube channels.",
    location: "Mumbai, India",
    workMode: "hybrid",
    postingType: "job",
    employmentType: "full-time",
    salaryRange: {
      min: 500000,
      max: 850000,
      currency: "INR",
      text: "₹5L - ₹8.5L per annum"
    },
    isUrgent: false,
    requiredCount: 2,
    aboutCompany: {
      companyDescription: "VlogFlow is a modern creator hub producing high-yield finance and tech content for GenZ audiences.",
      industry: "Creator Economy",
      mission: "Inform and entertain through dynamic visual storytelling.",
      website: "https://vlogflow.example.com"
    },
    jobDescription: {
      roleSummary: "Tackle complete video pipelines from scripting to advanced video editing, handle studio equipment, and track audience trends.",
      purpose: "Produce high-retention vertical videos to expand brand channel reach.",
      organizationalFit: "Perfect for trend-savvy filmmakers who communicate clearly and thrive on rapid iteration."
    },
    keyResponsibilities: [
      "Script and storyboard weekly vertical/horizontal video segments.",
      "Record clean audio and high-resolution video in our studio or outdoor locations.",
      "Edit files using Premiere Pro / DaVinci Resolve with pacing, sound design, and text graphics."
    ],
    requiredQualifications: {
      education: ["No formal degree requirement. Strong portfolio is key."],
      technicalSkills: ["Video editing", "Scripting", "Platform optimization", "Content scheduling"],
      softSkills: ["Creativity", "Consistency", "Audience empathy", "Storytelling"],
      experienceLevel: "1-2 Years"
    },
    preferredQualifications: {
      niceToHaveSkills: ["Adobe AfterEffects", "Lighting setup design"],
      certifications: [],
      bonusExperience: ["Managing a personal social channel with over 10k followers"]
    },
    compensationBenefits: {
      salaryDetails: "Base salary + performance bonuses based on video view growth.",
      perks: ["Premium Sony camera gears provided", "Free access to creator workshops"],
      growthOpportunities: ["Move up to Lead Channel Producer or Creative Director"]
    },
    applicationProcess: {
      howToApply: "Provide a link to a folder with your edited videos/reels.",
      requiredDocuments: ["Resume", "Video Portfolio link"],
      hiringSteps: ["Portfolio screening", "Editing trial assignment", "F2F brainstorming interview"]
    },
    industry: "Creator Economy",
    function: "Content Creation",
    tagType: "normal",
    visualElements: {
      accentColor: "#e11d48"
    }
  },
  {
    title: "Blockchain Engineer (Smart Contracts)",
    companyName: "SolidityLabs Web3",
    description: "Write security-first Solidity smart contracts, deploy secure token systems, build DeFi dApp protocols, and coordinate tokenomics.",
    location: "Remote, India",
    workMode: "remote",
    postingType: "job",
    employmentType: "full-time",
    salaryRange: {
      min: 1800000,
      max: 3000000,
      currency: "INR",
      text: "₹18L - ₹30L per annum"
    },
    isUrgent: true,
    requiredCount: 1,
    aboutCompany: {
      companyDescription: "SolidityLabs develops audited decentralized protocols and tokenized security solutions for enterprise clients.",
      industry: "Blockchain & Web3",
      mission: "Build resilient decentralized backbones for secure global trade.",
      website: "https://soliditylabs.example.com"
    },
    jobDescription: {
      roleSummary: "You will draft Solidity code, orchestrate tokenomic structures, conduct unit tests, and arrange smart contract audits.",
      purpose: "Deploy audited contracts to secure millions in liquidity.",
      organizationalFit: "Designed for detail-oriented, highly logical coders who value rigorous unit-testing."
    },
    keyResponsibilities: [
      "Design and deploy secure, gas-optimized Solidity smart contracts.",
      "Conduct extensive automated unit testing and manual code audits.",
      "Coordinate frontend integration with web3.js and Ethers.js."
    ],
    requiredQualifications: {
      education: ["B.Tech/M.Tech in CS or equal mathematics background"],
      technicalSkills: ["Smart contracts", "Distributed ledgers", "Cryptographic basics", "Token standards"],
      softSkills: ["Logical thinking", "Ethical judgment", "Learning agility", "Problem solving"],
      experienceLevel: "2+ Years"
    },
    preferredQualifications: {
      niceToHaveSkills: ["Rust programming", "Solidity audit templates"],
      certifications: ["Certified Blockchain Developer"],
      bonusExperience: ["Having successfully deployed contracts to Ethereum mainnet"]
    },
    compensationBenefits: {
      salaryDetails: "Very high base salary + optional token allocation pools.",
      perks: ["Remote office budget", "Web3 conference pass allowance"],
      growthOpportunities: ["Promoted to Blockchain Architect or Web3 CTO Partner"]
    },
    applicationProcess: {
      howToApply: "Provide verified Etherscan smart contract addresses that you authored.",
      requiredDocuments: ["Resume", "GitHub solidity repos"],
      hiringSteps: ["Technical smart contract quiz", "Live coding audit assignment", "Partner interview"]
    },
    industry: "Blockchain & Web3",
    function: "Blockchain Development",
    tagType: "exclusive",
    visualElements: {
      accentColor: "#2563eb"
    }
  },
  {
    title: "Customer Support Specialist",
    companyName: "CallLink Global BPO",
    description: "Manage inbound client voice channels, utilize ticketing systems, coordinate with product support, and resolve SLA issues.",
    location: "Noida, India",
    workMode: "onsite",
    postingType: "job",
    employmentType: "full-time",
    salaryRange: {
      min: 300000,
      max: 450000,
      currency: "INR",
      text: "₹3L - ₹4.5L per annum"
    },
    isUrgent: false,
    requiredCount: 5,
    aboutCompany: {
      companyDescription: "CallLink is a premium BPO firm handling technical helpdesks for global telecom giants.",
      industry: "BPO & Customer Service",
      mission: "Resolve customer concerns with zero friction and high courtesy.",
      website: "https://calllink.example.com"
    },
    jobDescription: {
      roleSummary: "Answering client tickets, analyzing recurring telecom subscription faults, using CRM tools, and logging service issues.",
      purpose: "Deliver warm, swift resolution paths to retain high client satisfaction scores (CSAT).",
      organizationalFit: "Suits highly patient, clear communicators who stay calm during client escalations."
    },
    keyResponsibilities: [
      "Handle incoming telephone queries with high empathy and script discipline.",
      "Log detailed customer accounts using Salesforce CRM.",
      "Escalate unresolved complex network billing issues to internal tech teams."
    ],
    requiredQualifications: {
      education: ["Any graduate or 12th pass with excellent verbal fluency"],
      technicalSkills: ["Call handling", "CRM usage", "Script adherence", "Escalation management"],
      softSkills: ["Patience", "Listening", "Clarity", "Resilience"],
      experienceLevel: "0-2 Years"
    },
    preferredQualifications: {
      niceToHaveSkills: ["Excel basics", "Telecom domain knowledge"],
      certifications: [],
      bonusExperience: ["Prior calling experience in international voice processes"]
    },
    compensationBenefits: {
      salaryDetails: "Fixed salary + attendance incentives.",
      perks: ["Free meals", "Shift pick & drop cabs", "Medical cover"],
      growthOpportunities: ["Promoted to Team Leader or Quality Coach in 2 years"]
    },
    applicationProcess: {
      howToApply: "Walk-in directly or apply with a voice clip intro.",
      requiredDocuments: ["Resume", "ID Proof copies"],
      hiringSteps: ["Fluency check round", "SVAT voice test", "Manager round"]
    },
    industry: "BPO & Customer Service",
    function: "Voice Process",
    tagType: "normal",
    visualElements: {
      accentColor: "#059669"
    }
  },
  {
    title: "Precision Farming Analytics Intern",
    companyName: "GreenAgri Tech",
    description: "Deep dive into IoT sensor logs, GIS drone maps, crop soil data analysis, and assist in drafting farm advisory dashboards.",
    location: "Pune, India",
    workMode: "hybrid",
    postingType: "internship",
    employmentType: "internship",
    salaryRange: {
      min: 20000,
      max: 28000,
      currency: "INR",
      text: "₹20k - ₹28k monthly stipend"
    },
    isUrgent: false,
    requiredCount: 2,
    aboutCompany: {
      companyDescription: "GreenAgri Tech builds IoT smart sensor arrays to optimize soil nutrition and forecast crop yields.",
      industry: "AgriTech",
      mission: "Increase national crop yields through real-time soil analytics.",
      website: "https://greenagri.example.com"
    },
    jobDescription: {
      roleSummary: "You will analyze incoming IoT moisture sensor feeds, GIS map overlays, compile soil test reports, and support the farm advisor team.",
      purpose: "Deliver actionable yield advice to regional farmers.",
      organizationalFit: "Ideal for adaptive, research-oriented individuals who enjoy data-analysis and agriculture."
    },
    keyResponsibilities: [
      "Monitor real-time farm sensor feeds and log data fluctuations.",
      "Assist in GIS remote sensing map analysis using mapping tools.",
      "Draft simplified crop advisory notes based on soil analytics reports."
    ],
    requiredQualifications: {
      education: ["Pursuing B.Sc/M.Sc Agriculture or B.Tech Bio-Systems/Agri Engineering"],
      technicalSkills: ["IoT sensors", "Drone-based monitoring", "Soil analytics", "Farm data interpretation"],
      softSkills: ["Learning agility", "Innovation mindset", "Analytical thinking", "Adaptability"],
      experienceLevel: "Freshers"
    },
    preferredQualifications: {
      niceToHaveSkills: ["Python basics", "GIS mapping software"],
      certifications: [],
      bonusExperience: ["Academic research project on soil health analysis"]
    },
    compensationBenefits: {
      salaryDetails: "Fixed monthly stipend + travel allowance for field visits.",
      perks: ["Mobile bill reimbursement", "Free onsite lodging during field trips"],
      growthOpportunities: ["Elevated to full-time Junior Farm Analyst upon graduation"]
    },
    applicationProcess: {
      howToApply: "Apply with academic transcripts and brief summary of farming/IoT projects.",
      requiredDocuments: ["Resume", "College authorization letter"],
      hiringSteps: ["Technical test", "Agriculture domain round", "HR check"]
    },
    industry: "AgriTech",
    function: "Precision Farming",
    tagType: "normal",
    visualElements: {
      accentColor: "#15803d"
    }
  }
];

const seedJobs = async () => {
  try {
    await connectDB();
    console.log("Connected to DB, starting job seeding...");

    console.log("🗑️ Clearing existing job postings...");
    await JobPosting.deleteMany({});
    console.log("✅ Cleared job postings collection.");

    console.log("🔍 Fetching competencies from database to map references...");
    const allCompetencies = await Competency.find({});
    console.log(`✅ Loaded ${allCompetencies.length} competencies from DB.`);

    // Build a map of competency name -> Competency document
    const competencyMap = {};
    for (const comp of allCompetencies) {
      competencyMap[comp.name.toLowerCase().trim()] = comp;
    }

    let seededCount = 0;

    for (const job of jobsData) {
      const requiredLinks = [];
      const preferredLinks = [];

      // Map technical skills to requiredCompetencyLinks
      if (job.requiredQualifications.technicalSkills) {
        for (const skill of job.requiredQualifications.technicalSkills) {
          const compDoc = competencyMap[skill.toLowerCase().trim()];
          if (compDoc) {
            requiredLinks.push(compDoc._id);
          }
        }
      }

      // Map soft skills to requiredCompetencyLinks
      if (job.requiredQualifications.softSkills) {
        for (const skill of job.requiredQualifications.softSkills) {
          const compDoc = competencyMap[skill.toLowerCase().trim()];
          if (compDoc) {
            requiredLinks.push(compDoc._id);
          }
        }
      }

      // Map nice-to-have skills to preferredCompetencyLinks
      if (job.preferredQualifications.niceToHaveSkills) {
        for (const skill of job.preferredQualifications.niceToHaveSkills) {
          const compDoc = competencyMap[skill.toLowerCase().trim()];
          if (compDoc) {
            preferredLinks.push(compDoc._id);
          }
        }
      }

      // Consolidate simple string arrays for compatibility with visual lists
      const reqCompetencies = [
        ...job.requiredQualifications.technicalSkills,
        ...job.requiredQualifications.softSkills
      ];

      // Assemble final document
      const jobDocument = {
        ...job,
        requiredCompetencies: reqCompetencies,
        requiredCompetencyLinks: requiredLinks,
        preferredCompetencyLinks: preferredLinks
      };

      await JobPosting.create(jobDocument);
      seededCount++;
      console.log(`💼 Seeded Job: "${job.title}" at "${job.companyName}" (${job.postingType}) - Links: ${requiredLinks.length} req, ${preferredLinks.length} pref.`);
    }

    console.log(`\n🎉 Successfully seeded ${seededCount} highly-detailed jobs & internships in the database!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding jobs:", error);
    process.exit(1);
  }
};

seedJobs();
