import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { Industry, Domain, Competency } from "./src/models/Competency.js";

dotenv.config();

const seedData = {
    "industries": [
        {
            "industry": "Manufacturing",
            "domains": [
                {
                    "domain": "Quality Management",
                    "competencies": {
                        "technical": ["Quality inspection", "Root cause analysis", "Statistical process control", "ISO standards awareness"],
                        "behavioral": ["Attention to detail", "Process discipline", "Problem solving", "Ownership"]
                    }
                },
                {
                    "domain": "Assembly Line Operations",
                    "competencies": {
                        "technical": ["Machine operation", "Production sequencing", "Tool handling", "Work instruction adherence"],
                        "behavioral": ["Time discipline", "Team coordination", "Safety consciousness", "Consistency"]
                    }
                },
                {
                    "domain": "Procurement",
                    "competencies": {
                        "technical": ["Vendor evaluation", "Purchase order management", "Cost comparison", "Inventory planning"],
                        "behavioral": ["Negotiation", "Commercial judgment", "Stakeholder management", "Integrity"]
                    }
                }
            ]
        },
        {
            "industry": "Automotive",
            "domains": [
                {
                    "domain": "Vehicle Assembly",
                    "competencies": {
                        "technical": ["Assembly process knowledge", "Torque tool usage", "Line balancing", "Defect identification"],
                        "behavioral": ["Precision", "Safety orientation", "Teamwork", "Accountability"]
                    }
                },
                {
                    "domain": "Automotive Design",
                    "competencies": {
                        "technical": ["CAD modeling", "Component design", "Material selection", "Design validation"],
                        "behavioral": ["Innovation", "Analytical thinking", "Collaboration", "Detail orientation"]
                    }
                },
                {
                    "domain": "Service & Maintenance",
                    "competencies": {
                        "technical": ["Vehicle diagnostics", "Repair procedures", "Electrical systems", "Preventive maintenance"],
                        "behavioral": ["Customer focus", "Troubleshooting mindset", "Patience", "Reliability"]
                    }
                }
            ]
        },
        {
            "industry": "Aerospace & Defense",
            "domains": [
                {
                    "domain": "Aircraft Engineering",
                    "competencies": {
                        "technical": ["Aerodynamics", "Structural analysis", "Systems integration", "Compliance documentation"],
                        "behavioral": ["Precision", "Risk awareness", "Systems thinking", "Quality focus"]
                    }
                },
                {
                    "domain": "Defense Systems",
                    "competencies": {
                        "technical": ["Embedded systems", "Radar systems", "Weapon platform integration", "Security protocols"],
                        "behavioral": ["Confidentiality", "Discipline", "Critical thinking", "Mission orientation"]
                    }
                },
                {
                    "domain": "Maintenance, Repair & Overhaul",
                    "competencies": {
                        "technical": ["Aircraft inspection", "Component replacement", "Maintenance logs", "Regulatory compliance"],
                        "behavioral": ["Accountability", "Attention to detail", "Safety mindset", "Process compliance"]
                    }
                }
            ]
        },
        {
            "industry": "Construction",
            "domains": [
                {
                    "domain": "Civil Construction",
                    "competencies": {
                        "technical": ["Site execution", "Concrete technology", "Drawing interpretation", "Quantity estimation"],
                        "behavioral": ["Site discipline", "Coordination", "Problem solving", "Safety awareness"]
                    }
                },
                {
                    "domain": "Project Management",
                    "competencies": {
                        "technical": ["Scheduling", "Budget tracking", "Contract management", "Resource planning"],
                        "behavioral": ["Leadership", "Stakeholder management", "Decision making", "Conflict resolution"]
                    }
                },
                {
                    "domain": "Health, Safety & Environment",
                    "competencies": {
                        "technical": ["Risk assessment", "Permit-to-work systems", "Incident reporting", "Safety audits"],
                        "behavioral": ["Safety leadership", "Vigilance", "Compliance mindset", "Assertiveness"]
                    }
                }
            ]
        },
        {
            "industry": "Oil & Gas",
            "domains": [
                {
                    "domain": "Exploration & Drilling",
                    "competencies": {
                        "technical": ["Geological interpretation", "Drilling operations", "Well control", "Equipment monitoring"],
                        "behavioral": ["Risk awareness", "Resilience", "Decision making under pressure", "Team coordination"]
                    }
                },
                {
                    "domain": "Refining Operations",
                    "competencies": {
                        "technical": ["Process plant operations", "Distillation knowledge", "Control room monitoring", "Maintenance coordination"],
                        "behavioral": ["Process discipline", "Alertness", "Safety focus", "Accountability"]
                    }
                },
                {
                    "domain": "Pipeline & Distribution",
                    "competencies": {
                        "technical": ["Pipeline monitoring", "Leak detection", "Pressure control", "Regulatory compliance"],
                        "behavioral": ["Responsiveness", "Coordination", "Integrity", "Problem solving"]
                    }
                }
            ]
        },
        {
            "industry": "Mining & Metals",
            "domains": [
                {
                    "domain": "Mining Operations",
                    "competencies": {
                        "technical": ["Mine planning", "Heavy equipment operation", "Blasting basics", "Ore extraction"],
                        "behavioral": ["Safety consciousness", "Endurance", "Discipline", "Situational awareness"]
                    }
                },
                {
                    "domain": "Mineral Processing",
                    "competencies": {
                        "technical": ["Crushing and screening", "Material handling", "Process control", "Sampling techniques"],
                        "behavioral": ["Attention to detail", "Process orientation", "Reliability", "Problem solving"]
                    }
                },
                {
                    "domain": "Metallurgy",
                    "competencies": {
                        "technical": ["Metal testing", "Heat treatment", "Alloy selection", "Failure analysis"],
                        "behavioral": ["Analytical thinking", "Precision", "Documentation discipline", "Curiosity"]
                    }
                }
            ]
        },
        {
            "industry": "Power & Energy",
            "domains": [
                {
                    "domain": "Power Generation",
                    "competencies": {
                        "technical": ["Plant operations", "Turbine systems", "Boiler operations", "Load management"],
                        "behavioral": ["Alertness", "Responsibility", "Safety mindset", "Process discipline"]
                    }
                },
                {
                    "domain": "Transmission & Distribution",
                    "competencies": {
                        "technical": ["Grid operations", "Substation maintenance", "Fault detection", "Electrical protection systems"],
                        "behavioral": ["Responsiveness", "Team coordination", "Risk awareness", "Accountability"]
                    }
                },
                {
                    "domain": "Energy Efficiency",
                    "competencies": {
                        "technical": ["Energy auditing", "Consumption analysis", "Optimization methods", "Reporting"],
                        "behavioral": ["Analytical thinking", "Sustainability orientation", "Influencing", "Problem solving"]
                    }
                }
            ]
        },
        {
            "industry": "Renewable Energy",
            "domains": [
                {
                    "domain": "Solar Energy",
                    "competencies": {
                        "technical": ["Solar PV installation", "Inverter systems", "Site assessment", "Performance monitoring"],
                        "behavioral": ["Adaptability", "Safety focus", "Customer orientation", "Ownership"]
                    }
                },
                {
                    "domain": "Wind Energy",
                    "competencies": {
                        "technical": ["Turbine maintenance", "Blade inspection", "SCADA monitoring", "Electrical systems"],
                        "behavioral": ["Courage", "Risk awareness", "Teamwork", "Reliability"]
                    }
                },
                {
                    "domain": "Energy Storage",
                    "competencies": {
                        "technical": ["Battery systems", "Thermal management", "Power electronics", "Lifecycle analysis"],
                        "behavioral": ["Innovation mindset", "Analytical thinking", "Detail orientation", "Learning agility"]
                    }
                }
            ]
        },
        {
            "industry": "Information Technology",
            "domains": [
                {
                    "domain": "Software Development",
                    "competencies": {
                        "technical": ["Programming", "Data structures", "API development", "Version control"],
                        "behavioral": ["Logical thinking", "Collaboration", "Learning agility", "Problem solving"]
                    }
                },
                {
                    "domain": "Cloud Computing",
                    "competencies": {
                        "technical": ["Cloud architecture", "DevOps pipelines", "Containerization", "Infrastructure automation"],
                        "behavioral": ["Systems thinking", "Ownership", "Adaptability", "Continuous learning"]
                    }
                },
                {
                    "domain": "IT Support",
                    "competencies": {
                        "technical": ["Troubleshooting", "Network basics", "Ticket management", "Hardware support"],
                        "behavioral": ["Customer empathy", "Patience", "Responsiveness", "Communication"]
                    }
                }
            ]
        },
        {
            "industry": "Artificial Intelligence & Machine Learning",
            "domains": [
                {
                    "domain": "Machine Learning Engineering",
                    "competencies": {
                        "technical": ["Model development", "Feature engineering", "Model evaluation", "Python programming"],
                        "behavioral": ["Analytical thinking", "Experimentation mindset", "Curiosity", "Problem solving"]
                    }
                },
                {
                    "domain": "Data Annotation & Model Training",
                    "competencies": {
                        "technical": ["Data labeling", "Annotation guidelines", "Quality validation", "Dataset management"],
                        "behavioral": ["Attention to detail", "Consistency", "Patience", "Process adherence"]
                    }
                },
                {
                    "domain": "AI Product Management",
                    "competencies": {
                        "technical": ["AI use-case design", "Model lifecycle awareness", "Data strategy", "Ethical AI basics"],
                        "behavioral": ["Business judgment", "Stakeholder alignment", "Innovation", "Responsible decision making"]
                    }
                }
            ]
        },
        {
            "industry": "Cybersecurity",
            "domains": [
                {
                    "domain": "Security Operations",
                    "competencies": {
                        "technical": ["Threat monitoring", "SIEM tools", "Incident response", "Log analysis"],
                        "behavioral": ["Alertness", "Calm under pressure", "Analytical thinking", "Confidentiality"]
                    }
                },
                {
                    "domain": "Application Security",
                    "competencies": {
                        "technical": ["Secure coding", "Vulnerability assessment", "Penetration testing", "OWASP knowledge"],
                        "behavioral": ["Detail orientation", "Ethical judgment", "Persistence", "Problem solving"]
                    }
                },
                {
                    "domain": "Governance, Risk & Compliance",
                    "competencies": {
                        "technical": ["Security policies", "Risk assessment", "Audit readiness", "Compliance frameworks"],
                        "behavioral": ["Integrity", "Documentation discipline", "Influencing", "Stakeholder management"]
                    }
                }
            ]
        },
        {
            "industry": "Telecommunications",
            "domains": [
                {
                    "domain": "Network Operations",
                    "competencies": {
                        "technical": ["Network monitoring", "Routing and switching", "Fault management", "SLA tracking"],
                        "behavioral": ["Responsiveness", "Analytical thinking", "Coordination", "Accountability"]
                    }
                },
                {
                    "domain": "5G & Wireless Systems",
                    "competencies": {
                        "technical": ["RF planning", "Spectrum management", "Cell site optimization", "Wireless protocols"],
                        "behavioral": ["Learning agility", "Systems thinking", "Precision", "Collaboration"]
                    }
                },
                {
                    "domain": "Customer Service Operations",
                    "competencies": {
                        "technical": ["CRM usage", "Service diagnostics", "Complaint tracking", "Plan/product knowledge"],
                        "behavioral": ["Customer empathy", "Patience", "Clear communication", "Conflict handling"]
                    }
                }
            ]
        },
        {
            "industry": "Banking",
            "domains": [
                {
                    "domain": "Retail Banking",
                    "competencies": {
                        "technical": ["Account opening", "KYC documentation", "Banking products", "Transaction processing"],
                        "behavioral": ["Customer orientation", "Trustworthiness", "Sales orientation", "Accuracy"]
                    }
                },
                {
                    "domain": "Credit & Lending",
                    "competencies": {
                        "technical": ["Credit assessment", "Financial statement analysis", "Loan documentation", "Risk scoring"],
                        "behavioral": ["Judgment", "Analytical thinking", "Integrity", "Decision making"]
                    }
                },
                {
                    "domain": "Branch Operations",
                    "competencies": {
                        "technical": ["Cash management", "Reconciliation", "Regulatory compliance", "Operational controls"],
                        "behavioral": ["Process discipline", "Attention to detail", "Accountability", "Customer handling"]
                    }
                }
            ]
        },
        {
            "industry": "Financial Services",
            "domains": [
                {
                    "domain": "Wealth Management",
                    "competencies": {
                        "technical": ["Investment products", "Portfolio analysis", "Risk profiling", "Financial planning"],
                        "behavioral": ["Trust building", "Consultative selling", "Client empathy", "Ethical judgment"]
                    }
                },
                {
                    "domain": "Capital Markets",
                    "competencies": {
                        "technical": ["Market analysis", "Trading platforms", "Derivatives basics", "Regulatory awareness"],
                        "behavioral": ["Decision making under pressure", "Numerical fluency", "Risk awareness", "Composure"]
                    }
                },
                {
                    "domain": "Risk Management",
                    "competencies": {
                        "technical": ["Risk modeling", "Control testing", "Scenario analysis", "Compliance reporting"],
                        "behavioral": ["Critical thinking", "Integrity", "Objectivity", "Attention to detail"]
                    }
                }
            ]
        },
        {
            "industry": "Insurance",
            "domains": [
                {
                    "domain": "Underwriting",
                    "competencies": {
                        "technical": ["Risk evaluation", "Policy terms", "Premium calculation", "Documentation review"],
                        "behavioral": ["Judgment", "Analytical thinking", "Attention to detail", "Fairness"]
                    }
                },
                {
                    "domain": "Claims Management",
                    "competencies": {
                        "technical": ["Claims assessment", "Policy interpretation", "Fraud detection", "Settlement processing"],
                        "behavioral": ["Empathy", "Objectivity", "Conflict resolution", "Process discipline"]
                    }
                },
                {
                    "domain": "Insurance Sales",
                    "competencies": {
                        "technical": ["Product knowledge", "Needs analysis", "Proposal creation", "Regulatory disclosure"],
                        "behavioral": ["Persuasion", "Trust building", "Resilience", "Customer focus"]
                    }
                }
            ]
        },
        {
            "industry": "Healthcare",
            "domains": [
                {
                    "domain": "Clinical Care",
                    "competencies": {
                        "technical": ["Patient assessment", "Clinical procedures", "Medical documentation", "Infection control"],
                        "behavioral": ["Empathy", "Composure", "Ethical judgment", "Team collaboration"]
                    }
                },
                {
                    "domain": "Hospital Administration",
                    "competencies": {
                        "technical": ["Patient flow management", "Healthcare billing", "Resource allocation", "Compliance"],
                        "behavioral": ["Coordination", "Service orientation", "Problem solving", "Stakeholder management"]
                    }
                },
                {
                    "domain": "Diagnostics",
                    "competencies": {
                        "technical": ["Sample handling", "Diagnostic equipment usage", "Report interpretation", "Quality control"],
                        "behavioral": ["Accuracy", "Attention to detail", "Confidentiality", "Process discipline"]
                    }
                }
            ]
        },
        {
            "industry": "Pharmaceuticals",
            "domains": [
                {
                    "domain": "Drug Manufacturing",
                    "competencies": {
                        "technical": ["GMP compliance", "Batch processing", "Cleanroom practices", "Quality documentation"],
                        "behavioral": ["Discipline", "Accuracy", "Compliance mindset", "Ownership"]
                    }
                },
                {
                    "domain": "Research & Development",
                    "competencies": {
                        "technical": ["Formulation development", "Clinical trial basics", "Lab techniques", "Data interpretation"],
                        "behavioral": ["Curiosity", "Scientific thinking", "Persistence", "Ethical conduct"]
                    }
                },
                {
                    "domain": "Medical Sales",
                    "competencies": {
                        "technical": ["Product knowledge", "Therapeutic area understanding", "Doctor engagement", "Sales reporting"],
                        "behavioral": ["Influencing", "Relationship building", "Communication", "Resilience"]
                    }
                }
            ]
        },
        {
            "industry": "Biotechnology",
            "domains": [
                {
                    "domain": "Bioprocessing",
                    "competencies": {
                        "technical": ["Cell culture", "Fermentation", "Bioreactor operations", "Process validation"],
                        "behavioral": ["Precision", "Patience", "Scientific curiosity", "Process discipline"]
                    }
                },
                {
                    "domain": "Genomics",
                    "competencies": {
                        "technical": ["DNA sequencing", "Bioinformatics basics", "Sample preparation", "Data analysis"],
                        "behavioral": ["Analytical thinking", "Attention to detail", "Learning agility", "Ethical awareness"]
                    }
                },
                {
                    "domain": "Regulatory Affairs",
                    "competencies": {
                        "technical": ["Submission documentation", "Regulatory guidelines", "Quality systems", "Clinical compliance"],
                        "behavioral": ["Documentation discipline", "Integrity", "Stakeholder management", "Detail orientation"]
                    }
                }
            ]
        },
        {
            "industry": "Education",
            "domains": [
                {
                    "domain": "Teaching & Instruction",
                    "competencies": {
                        "technical": ["Lesson planning", "Pedagogy", "Assessment design", "Classroom technology"],
                        "behavioral": ["Empathy", "Communication", "Patience", "Adaptability"]
                    }
                },
                {
                    "domain": "Curriculum Development",
                    "competencies": {
                        "technical": ["Learning outcomes design", "Content structuring", "Instructional design", "Rubric creation"],
                        "behavioral": ["Creativity", "Learner focus", "Analytical thinking", "Collaboration"]
                    }
                },
                {
                    "domain": "Student Counseling",
                    "competencies": {
                        "technical": ["Career guidance", "Psychometric interpretation", "Student profiling", "Referral protocols"],
                        "behavioral": ["Active listening", "Empathy", "Confidentiality", "Trust building"]
                    }
                }
            ]
        },
        {
            "industry": "EdTech",
            "domains": [
                {
                    "domain": "Learning Platform Management",
                    "competencies": {
                        "technical": ["LMS administration", "User analytics", "Content uploading", "Learning journey design"],
                        "behavioral": ["Learner empathy", "Problem solving", "Adaptability", "Ownership"]
                    }
                },
                {
                    "domain": "Digital Content Creation",
                    "competencies": {
                        "technical": ["Video scripting", "Instructional design", "Assessment creation", "Microlearning design"],
                        "behavioral": ["Creativity", "Clarity", "Audience orientation", "Storytelling"]
                    }
                },
                {
                    "domain": "Student Success",
                    "competencies": {
                        "technical": ["Progress tracking", "Engagement analytics", "Intervention planning", "CRM usage"],
                        "behavioral": ["Coaching mindset", "Persistence", "Communication", "Service orientation"]
                    }
                }
            ]
        },
        {
            "industry": "Retail",
            "domains": [
                {
                    "domain": "Store Operations",
                    "competencies": {
                        "technical": ["POS handling", "Inventory checks", "Visual merchandising", "Stock replenishment"],
                        "behavioral": ["Customer focus", "Energy", "Discipline", "Teamwork"]
                    }
                },
                {
                    "domain": "Retail Sales",
                    "competencies": {
                        "technical": ["Product demonstration", "Customer need identification", "Billing process", "Upselling"],
                        "behavioral": ["Persuasion", "Patience", "Listening", "Confidence"]
                    }
                },
                {
                    "domain": "Merchandising",
                    "competencies": {
                        "technical": ["Category planning", "Demand forecasting", "Pricing basics", "Display planning"],
                        "behavioral": ["Commercial sense", "Creativity", "Analytical thinking", "Customer orientation"]
                    }
                }
            ]
        },
        {
            "industry": "E-commerce",
            "domains": [
                {
                    "domain": "Marketplace Operations",
                    "competencies": {
                        "technical": ["Seller onboarding", "Catalog management", "Order tracking", "Platform analytics"],
                        "behavioral": ["Process orientation", "Coordination", "Problem solving", "Customer focus"]
                    }
                },
                {
                    "domain": "Digital Marketing",
                    "competencies": {
                        "technical": ["SEO", "Performance marketing", "Campaign analytics", "Conversion optimization"],
                        "behavioral": ["Creativity", "Data orientation", "Experimentation mindset", "Adaptability"]
                    }
                },
                {
                    "domain": "Customer Experience",
                    "competencies": {
                        "technical": ["CRM tools", "Complaint resolution", "Return management", "Service metrics tracking"],
                        "behavioral": ["Empathy", "Responsiveness", "Conflict handling", "Ownership"]
                    }
                }
            ]
        },
        {
            "industry": "Logistics & Supply Chain",
            "domains": [
                {
                    "domain": "Warehouse Operations",
                    "competencies": {
                        "technical": ["Inventory management", "Picking and packing", "WMS usage", "Material handling"],
                        "behavioral": ["Accuracy", "Physical discipline", "Team coordination", "Safety awareness"]
                    }
                },
                {
                    "domain": "Transportation Management",
                    "competencies": {
                        "technical": ["Route planning", "Fleet tracking", "Delivery scheduling", "Cost optimization"],
                        "behavioral": ["Time management", "Problem solving", "Coordination", "Customer orientation"]
                    }
                },
                {
                    "domain": "Supply Planning",
                    "competencies": {
                        "technical": ["Demand planning", "MRP basics", "Vendor coordination", "Forecasting"],
                        "behavioral": ["Analytical thinking", "Proactiveness", "Stakeholder management", "Decision making"]
                    }
                }
            ]
        },
        {
            "industry": "Transportation",
            "domains": [
                {
                    "domain": "Public Transport Operations",
                    "competencies": {
                        "technical": ["Route operations", "Passenger safety", "Ticketing systems", "Schedule adherence"],
                        "behavioral": ["Service orientation", "Patience", "Responsibility", "Crisis handling"]
                    }
                },
                {
                    "domain": "Fleet Operations",
                    "competencies": {
                        "technical": ["Vehicle tracking", "Maintenance planning", "Fuel monitoring", "Driver allocation"],
                        "behavioral": ["Coordination", "Discipline", "Accountability", "Problem solving"]
                    }
                },
                {
                    "domain": "Transport Safety",
                    "competencies": {
                        "technical": ["Safety audits", "Accident reporting", "Compliance checks", "Driver training"],
                        "behavioral": ["Vigilance", "Assertiveness", "Ethical judgment", "Process discipline"]
                    }
                }
            ]
        },
        {
            "industry": "Hospitality",
            "domains": [
                {
                    "domain": "Front Office",
                    "competencies": {
                        "technical": ["Reservation systems", "Check-in procedures", "Billing", "Guest profiling"],
                        "behavioral": ["Warmth", "Communication", "Problem solving", "Service orientation"]
                    }
                },
                {
                    "domain": "Food & Beverage Service",
                    "competencies": {
                        "technical": ["Table service", "Menu knowledge", "Order taking", "Hygiene standards"],
                        "behavioral": ["Courtesy", "Speed", "Teamwork", "Customer focus"]
                    }
                },
                {
                    "domain": "Housekeeping",
                    "competencies": {
                        "technical": ["Room cleaning standards", "Laundry coordination", "Chemical handling", "Inspection checklist usage"],
                        "behavioral": ["Attention to detail", "Discipline", "Integrity", "Consistency"]
                    }
                }
            ]
        },
        {
            "industry": "Travel & Tourism",
            "domains": [
                {
                    "domain": "Travel Operations",
                    "competencies": {
                        "technical": ["Itinerary planning", "Ticketing systems", "Visa process knowledge", "Vendor coordination"],
                        "behavioral": ["Customer empathy", "Coordination", "Responsiveness", "Problem solving"]
                    }
                },
                {
                    "domain": "Tour Guiding",
                    "competencies": {
                        "technical": ["Destination knowledge", "Group handling", "Safety protocols", "Cultural interpretation"],
                        "behavioral": ["Storytelling", "Confidence", "Patience", "Adaptability"]
                    }
                },
                {
                    "domain": "Travel Sales",
                    "competencies": {
                        "technical": ["Package selling", "CRM usage", "Pricing knowledge", "Customer profiling"],
                        "behavioral": ["Persuasion", "Relationship building", "Listening", "Resilience"]
                    }
                }
            ]
        },
        {
            "industry": "Food & Beverage",
            "domains": [
                {
                    "domain": "Food Production",
                    "competencies": {
                        "technical": ["Recipe execution", "Food safety", "Ingredient handling", "Kitchen equipment usage"],
                        "behavioral": ["Hygiene discipline", "Speed", "Consistency", "Teamwork"]
                    }
                },
                {
                    "domain": "Quality & Hygiene",
                    "competencies": {
                        "technical": ["HACCP basics", "Temperature control", "Sanitation checks", "Food sampling"],
                        "behavioral": ["Attention to detail", "Compliance mindset", "Integrity", "Alertness"]
                    }
                },
                {
                    "domain": "Restaurant Operations",
                    "competencies": {
                        "technical": ["Order management", "Inventory control", "Shift planning", "POS usage"],
                        "behavioral": ["Customer focus", "Leadership", "Coordination", "Conflict handling"]
                    }
                }
            ]
        },
        {
            "industry": "Agriculture",
            "domains": [
                {
                    "domain": "Crop Production",
                    "competencies": {
                        "technical": ["Soil preparation", "Irrigation methods", "Seed selection", "Pest management"],
                        "behavioral": ["Patience", "Observation", "Resilience", "Planning"]
                    }
                },
                {
                    "domain": "Farm Equipment Operations",
                    "competencies": {
                        "technical": ["Tractor operation", "Equipment maintenance", "Harvesting machinery", "Safety procedures"],
                        "behavioral": ["Responsibility", "Safety awareness", "Discipline", "Problem solving"]
                    }
                },
                {
                    "domain": "Agri Supply Chain",
                    "competencies": {
                        "technical": ["Cold chain basics", "Grading and sorting", "Market linkage", "Inventory handling"],
                        "behavioral": ["Commercial awareness", "Coordination", "Negotiation", "Reliability"]
                    }
                }
            ]
        },
        {
            "industry": "AgriTech",
            "domains": [
                {
                    "domain": "Precision Farming",
                    "competencies": {
                        "technical": ["IoT sensors", "Drone-based monitoring", "Soil analytics", "Farm data interpretation"],
                        "behavioral": ["Learning agility", "Innovation mindset", "Analytical thinking", "Adaptability"]
                    }
                },
                {
                    "domain": "Farm Advisory Platforms",
                    "competencies": {
                        "technical": ["Crop advisory tools", "Farmer data collection", "Mobile app usage", "Weather data interpretation"],
                        "behavioral": ["Empathy", "Communication", "Trust building", "Patience"]
                    }
                },
                {
                    "domain": "Agri Marketplace",
                    "competencies": {
                        "technical": ["Digital transactions", "Seller onboarding", "Product cataloging", "Logistics coordination"],
                        "behavioral": ["Commercial sense", "Customer orientation", "Coordination", "Problem solving"]
                    }
                }
            ]
        },
        {
            "industry": "Textiles & Apparel",
            "domains": [
                {
                    "domain": "Garment Manufacturing",
                    "competencies": {
                        "technical": ["Pattern cutting", "Stitching operations", "Machine handling", "Finishing inspection"],
                        "behavioral": ["Precision", "Speed", "Consistency", "Process discipline"]
                    }
                },
                {
                    "domain": "Textile Processing",
                    "competencies": {
                        "technical": ["Dyeing", "Printing", "Fabric testing", "Shrinkage control"],
                        "behavioral": ["Attention to detail", "Quality focus", "Patience", "Discipline"]
                    }
                },
                {
                    "domain": "Fashion Merchandising",
                    "competencies": {
                        "technical": ["Trend analysis", "Range planning", "Vendor coordination", "Costing"],
                        "behavioral": ["Creativity", "Commercial awareness", "Negotiation", "Collaboration"]
                    }
                }
            ]
        },
        {
            "industry": "Media & Entertainment",
            "domains": [
                {
                    "domain": "Content Production",
                    "competencies": {
                        "technical": ["Scriptwriting", "Video production", "Editing", "Production planning"],
                        "behavioral": ["Creativity", "Storytelling", "Collaboration", "Time management"]
                    }
                },
                {
                    "domain": "Broadcast Operations",
                    "competencies": {
                        "technical": ["Studio operations", "Live switching", "Audio-video systems", "Transmission basics"],
                        "behavioral": ["Composure", "Attention to detail", "Team coordination", "Responsiveness"]
                    }
                },
                {
                    "domain": "Audience Engagement",
                    "competencies": {
                        "technical": ["Social media analytics", "Campaign planning", "Community management", "Content scheduling"],
                        "behavioral": ["Audience empathy", "Creativity", "Adaptability", "Communication"]
                    }
                }
            ]
        },
        {
            "industry": "Advertising & Marketing",
            "domains": [
                {
                    "domain": "Brand Strategy",
                    "competencies": {
                        "technical": ["Consumer research", "Positioning", "Campaign planning", "Market segmentation"],
                        "behavioral": ["Strategic thinking", "Creativity", "Client orientation", "Storytelling"]
                    }
                },
                {
                    "domain": "Performance Marketing",
                    "competencies": {
                        "technical": ["Paid ads", "Conversion tracking", "A/B testing", "Marketing analytics"],
                        "behavioral": ["Data orientation", "Experimentation", "Agility", "Problem solving"]
                    }
                },
                {
                    "domain": "Client Servicing",
                    "competencies": {
                        "technical": ["Brief taking", "Project coordination", "Campaign reporting", "Presentation skills"],
                        "behavioral": ["Relationship management", "Communication", "Responsiveness", "Conflict resolution"]
                    }
                }
            ]
        },
        {
            "industry": "Real Estate",
            "domains": [
                {
                    "domain": "Property Sales",
                    "competencies": {
                        "technical": ["Property knowledge", "Lead qualification", "Site visit management", "Sales documentation"],
                        "behavioral": ["Persuasion", "Trust building", "Negotiation", "Customer focus"]
                    }
                },
                {
                    "domain": "Property Management",
                    "competencies": {
                        "technical": ["Lease administration", "Maintenance coordination", "Tenant management", "Vendor management"],
                        "behavioral": ["Responsiveness", "Conflict handling", "Ownership", "Coordination"]
                    }
                },
                {
                    "domain": "Real Estate Development",
                    "competencies": {
                        "technical": ["Land acquisition basics", "Project approvals", "Construction coordination", "Financial feasibility"],
                        "behavioral": ["Stakeholder management", "Commercial judgment", "Risk awareness", "Decision making"]
                    }
                }
            ]
        },
        {
            "industry": "PropTech",
            "domains": [
                {
                    "domain": "Property Platform Operations",
                    "competencies": {
                        "technical": ["Listing management", "Broker onboarding", "CRM usage", "Lead routing"],
                        "behavioral": ["Process orientation", "Customer focus", "Coordination", "Ownership"]
                    }
                },
                {
                    "domain": "Digital Sales",
                    "competencies": {
                        "technical": ["Online demos", "Subscription selling", "Sales funnel tracking", "ROI articulation"],
                        "behavioral": ["Consultative selling", "Confidence", "Objection handling", "Resilience"]
                    }
                },
                {
                    "domain": "Data & Valuation",
                    "competencies": {
                        "technical": ["Market data analysis", "Price benchmarking", "Demand mapping", "Property analytics"],
                        "behavioral": ["Analytical thinking", "Commercial sense", "Objectivity", "Attention to detail"]
                    }
                }
            ]
        },
        {
            "industry": "Legal Services",
            "domains": [
                {
                    "domain": "Corporate Law",
                    "competencies": {
                        "technical": ["Contract drafting", "Company law basics", "Due diligence", "Regulatory filings"],
                        "behavioral": ["Analytical thinking", "Confidentiality", "Precision", "Ethical judgment"]
                    }
                },
                {
                    "domain": "Litigation Support",
                    "competencies": {
                        "technical": ["Case research", "Document preparation", "Court procedure awareness", "Evidence organization"],
                        "behavioral": ["Persistence", "Composure", "Attention to detail", "Communication"]
                    }
                },
                {
                    "domain": "Compliance Advisory",
                    "competencies": {
                        "technical": ["Policy review", "Regulatory interpretation", "Audit coordination", "Risk documentation"],
                        "behavioral": ["Integrity", "Objectivity", "Stakeholder management", "Process discipline"]
                    }
                }
            ]
        },
        {
            "industry": "Professional Services & Consulting",
            "domains": [
                {
                    "domain": "Management Consulting",
                    "competencies": {
                        "technical": ["Business analysis", "Market research", "Operating model design", "Presentation building"],
                        "behavioral": ["Structured thinking", "Client management", "Problem solving", "Communication"]
                    }
                },
                {
                    "domain": "HR Consulting",
                    "competencies": {
                        "technical": ["Competency mapping", "Assessment design", "HR process design", "Organization diagnosis"],
                        "behavioral": ["Empathy", "Facilitation", "Stakeholder management", "Objectivity"]
                    }
                },
                {
                    "domain": "Financial Advisory",
                    "competencies": {
                        "technical": ["Financial modeling", "Valuation", "Due diligence", "Risk analysis"],
                        "behavioral": ["Numerical fluency", "Integrity", "Analytical thinking", "Client orientation"]
                    }
                }
            ]
        },
        {
            "industry": "Government & Public Administration",
            "domains": [
                {
                    "domain": "Public Service Delivery",
                    "competencies": {
                        "technical": ["Scheme implementation", "Citizen service processes", "Documentation", "Grievance handling"],
                        "behavioral": ["Service orientation", "Integrity", "Patience", "Accountability"]
                    }
                },
                {
                    "domain": "Policy Implementation",
                    "competencies": {
                        "technical": ["Policy interpretation", "Program monitoring", "Stakeholder coordination", "Impact reporting"],
                        "behavioral": ["Judgment", "Communication", "Collaboration", "Public accountability"]
                    }
                },
                {
                    "domain": "Regulatory Enforcement",
                    "competencies": {
                        "technical": ["Inspection procedures", "Compliance checks", "Violation reporting", "Legal documentation"],
                        "behavioral": ["Fairness", "Assertiveness", "Ethical conduct", "Attention to detail"]
                    }
                }
            ]
        },
        {
            "industry": "Non-Profit & Social Impact",
            "domains": [
                {
                    "domain": "Program Management",
                    "competencies": {
                        "technical": ["Program design", "Beneficiary tracking", "Impact measurement", "Grant reporting"],
                        "behavioral": ["Empathy", "Ownership", "Community orientation", "Collaboration"]
                    }
                },
                {
                    "domain": "Fundraising",
                    "competencies": {
                        "technical": ["Donor research", "Proposal writing", "Campaign management", "CRM usage"],
                        "behavioral": ["Persuasion", "Storytelling", "Relationship building", "Resilience"]
                    }
                },
                {
                    "domain": "Community Mobilization",
                    "competencies": {
                        "technical": ["Field data collection", "Stakeholder mapping", "Awareness campaigns", "Training facilitation"],
                        "behavioral": ["Trust building", "Communication", "Cultural sensitivity", "Patience"]
                    }
                }
            ]
        },
        {
            "industry": "Chemicals",
            "domains": [
                {
                    "domain": "Chemical Production",
                    "competencies": {
                        "technical": ["Process chemistry", "Reactor operations", "Material handling", "Batch control"],
                        "behavioral": ["Safety focus", "Process discipline", "Alertness", "Accountability"]
                    }
                },
                {
                    "domain": "Quality Control",
                    "competencies": {
                        "technical": ["Lab testing", "Instrument calibration", "Sample analysis", "Documentation"],
                        "behavioral": ["Accuracy", "Attention to detail", "Integrity", "Consistency"]
                    }
                },
                {
                    "domain": "Hazard Management",
                    "competencies": {
                        "technical": ["MSDS interpretation", "Chemical storage", "Emergency response", "PPE usage"],
                        "behavioral": ["Risk awareness", "Discipline", "Composure", "Responsibility"]
                    }
                }
            ]
        },
        {
            "industry": "Electronics & Semiconductors",
            "domains": [
                {
                    "domain": "Electronics Manufacturing",
                    "competencies": {
                        "technical": ["PCB assembly", "Soldering", "Component testing", "ESD safety"],
                        "behavioral": ["Precision", "Patience", "Quality focus", "Process adherence"]
                    }
                },
                {
                    "domain": "Semiconductor Fabrication",
                    "competencies": {
                        "technical": ["Cleanroom operations", "Wafer processing", "Lithography basics", "Defect analysis"],
                        "behavioral": ["Attention to detail", "Discipline", "Learning agility", "Reliability"]
                    }
                },
                {
                    "domain": "Product Testing",
                    "competencies": {
                        "technical": ["Test equipment usage", "Circuit analysis", "Failure diagnosis", "Data logging"],
                        "behavioral": ["Analytical thinking", "Problem solving", "Accuracy", "Persistence"]
                    }
                }
            ]
        },
        {
            "industry": "Consumer Goods",
            "domains": [
                {
                    "domain": "Product Development",
                    "competencies": {
                        "technical": ["Consumer research", "Packaging design", "Product testing", "Costing"],
                        "behavioral": ["Creativity", "Customer orientation", "Commercial thinking", "Collaboration"]
                    }
                },
                {
                    "domain": "Sales & Distribution",
                    "competencies": {
                        "technical": ["Distributor management", "Route-to-market planning", "Sales forecasting", "Trade schemes"],
                        "behavioral": ["Negotiation", "Execution focus", "Relationship building", "Resilience"]
                    }
                },
                {
                    "domain": "Brand Management",
                    "competencies": {
                        "technical": ["Brand positioning", "Campaign planning", "Market analysis", "P&L tracking"],
                        "behavioral": ["Strategic thinking", "Creativity", "Influencing", "Decision making"]
                    }
                }
            ]
        },
        {
            "industry": "Beauty & Wellness",
            "domains": [
                {
                    "domain": "Salon Services",
                    "competencies": {
                        "technical": ["Hair care", "Skin care basics", "Nail care", "Sanitation practices"],
                        "behavioral": ["Customer sensitivity", "Attention to detail", "Patience", "Professionalism"]
                    }
                },
                {
                    "domain": "Fitness & Wellness Coaching",
                    "competencies": {
                        "technical": ["Exercise planning", "Nutrition basics", "Progress tracking", "Injury prevention"],
                        "behavioral": ["Motivation", "Empathy", "Discipline", "Communication"]
                    }
                },
                {
                    "domain": "Spa Operations",
                    "competencies": {
                        "technical": ["Therapy techniques", "Product knowledge", "Hygiene standards", "Appointment management"],
                        "behavioral": ["Calmness", "Service orientation", "Trust building", "Professional conduct"]
                    }
                }
            ]
        },
        {
            "industry": "Sports",
            "domains": [
                {
                    "domain": "Sports Coaching",
                    "competencies": {
                        "technical": ["Training planning", "Performance analysis", "Skill correction", "Injury prevention"],
                        "behavioral": ["Motivation", "Discipline", "Leadership", "Patience"]
                    }
                },
                {
                    "domain": "Sports Management",
                    "competencies": {
                        "technical": ["Event planning", "Sponsorship management", "Athlete coordination", "Budgeting"],
                        "behavioral": ["Coordination", "Negotiation", "Communication", "Decision making"]
                    }
                },
                {
                    "domain": "Sports Analytics",
                    "competencies": {
                        "technical": ["Performance data analysis", "Video analysis", "Statistical modeling", "Reporting"],
                        "behavioral": ["Analytical thinking", "Objectivity", "Attention to detail", "Curiosity"]
                    }
                }
            ]
        },
        {
            "industry": "Gaming",
            "domains": [
                {
                    "domain": "Game Development",
                    "competencies": {
                        "technical": ["Game engines", "Programming", "Gameplay mechanics", "Debugging"],
                        "behavioral": ["Creativity", "Problem solving", "Collaboration", "Persistence"]
                    }
                },
                {
                    "domain": "Game Design",
                    "competencies": {
                        "technical": ["Level design", "User experience design", "Narrative design", "Balancing mechanics"],
                        "behavioral": ["Imagination", "User empathy", "Experimentation", "Storytelling"]
                    }
                },
                {
                    "domain": "Esports Operations",
                    "competencies": {
                        "technical": ["Tournament management", "Streaming platforms", "Community tools", "Event logistics"],
                        "behavioral": ["Coordination", "Composure", "Community orientation", "Responsiveness"]
                    }
                }
            ]
        },
        {
            "industry": "Creator Economy",
            "domains": [
                {
                    "domain": "Content Creation",
                    "competencies": {
                        "technical": ["Video editing", "Scripting", "Platform optimization", "Content scheduling"],
                        "behavioral": ["Creativity", "Consistency", "Audience empathy", "Storytelling"]
                    }
                },
                {
                    "domain": "Community Management",
                    "competencies": {
                        "technical": ["Engagement tracking", "Moderation tools", "Social listening", "Feedback analysis"],
                        "behavioral": ["Empathy", "Responsiveness", "Conflict handling", "Authenticity"]
                    }
                },
                {
                    "domain": "Monetization",
                    "competencies": {
                        "technical": ["Brand partnerships", "Affiliate marketing", "Subscription models", "Revenue analytics"],
                        "behavioral": ["Commercial sense", "Negotiation", "Relationship building", "Entrepreneurial mindset"]
                    }
                }
            ]
        },
        {
            "industry": "Space Technology",
            "domains": [
                {
                    "domain": "Satellite Systems",
                    "competencies": {
                        "technical": ["Satellite design basics", "Payload integration", "Orbital mechanics", "Telemetry systems"],
                        "behavioral": ["Systems thinking", "Precision", "Risk awareness", "Collaboration"]
                    }
                },
                {
                    "domain": "Launch Operations",
                    "competencies": {
                        "technical": ["Mission planning", "Propulsion basics", "Ground systems", "Safety protocols"],
                        "behavioral": ["Composure", "Process discipline", "Team coordination", "Decision making under pressure"]
                    }
                },
                {
                    "domain": "Space Data Applications",
                    "competencies": {
                        "technical": ["Remote sensing", "GIS analysis", "Image processing", "Data modeling"],
                        "behavioral": ["Analytical thinking", "Curiosity", "Problem solving", "Innovation"]
                    }
                }
            ]
        },
        {
            "industry": "Robotics & Automation",
            "domains": [
                {
                    "domain": "Industrial Automation",
                    "competencies": {
                        "technical": ["PLC programming", "SCADA systems", "Sensor integration", "Control systems"],
                        "behavioral": ["Problem solving", "Precision", "Systems thinking", "Learning agility"]
                    }
                },
                {
                    "domain": "Robotics Engineering",
                    "competencies": {
                        "technical": ["Robot kinematics", "Embedded systems", "Mechatronics", "Motion control"],
                        "behavioral": ["Innovation", "Analytical thinking", "Persistence", "Collaboration"]
                    }
                },
                {
                    "domain": "Maintenance Automation",
                    "competencies": {
                        "technical": ["Predictive maintenance", "Condition monitoring", "Automation troubleshooting", "Data logging"],
                        "behavioral": ["Alertness", "Ownership", "Problem solving", "Reliability"]
                    }
                }
            ]
        },
        {
            "industry": "Internet of Things",
            "domains": [
                {
                    "domain": "IoT Device Development",
                    "competencies": {
                        "technical": ["Sensor integration", "Embedded programming", "Connectivity protocols", "Power management"],
                        "behavioral": ["Curiosity", "Problem solving", "Precision", "Learning agility"]
                    }
                },
                {
                    "domain": "IoT Platform Management",
                    "competencies": {
                        "technical": ["Device management", "Data ingestion", "Cloud integration", "Dashboard configuration"],
                        "behavioral": ["Systems thinking", "Ownership", "Analytical thinking", "Adaptability"]
                    }
                },
                {
                    "domain": "Smart Operations",
                    "competencies": {
                        "technical": ["Real-time monitoring", "Automation rules", "Alert management", "Predictive analytics"],
                        "behavioral": ["Responsiveness", "Process orientation", "Decision making", "Continuous improvement"]
                    }
                }
            ]
        },
        {
            "industry": "Blockchain & Web3",
            "domains": [
                {
                    "domain": "Blockchain Development",
                    "competencies": {
                        "technical": ["Smart contracts", "Distributed ledgers", "Cryptographic basics", "Token standards"],
                        "behavioral": ["Logical thinking", "Ethical judgment", "Learning agility", "Problem solving"]
                    }
                },
                {
                    "domain": "Web3 Product Management",
                    "competencies": {
                        "technical": ["Tokenomics", "Wallet flows", "Community governance", "Protocol awareness"],
                        "behavioral": ["Strategic thinking", "Community orientation", "Risk awareness", "Adaptability"]
                    }
                },
                {
                    "domain": "Blockchain Security",
                    "competencies": {
                        "technical": ["Smart contract auditing", "Threat modeling", "Key management", "Vulnerability testing"],
                        "behavioral": ["Attention to detail", "Integrity", "Persistence", "Analytical thinking"]
                    }
                }
            ]
        },
        {
            "industry": "FinTech",
            "domains": [
                {
                    "domain": "Digital Payments",
                    "competencies": {
                        "technical": ["Payment gateways", "UPI/card systems", "Transaction reconciliation", "Fraud monitoring"],
                        "behavioral": ["Accuracy", "Risk awareness", "Customer focus", "Problem solving"]
                    }
                },
                {
                    "domain": "Lending Tech",
                    "competencies": {
                        "technical": ["Credit scoring", "Loan origination systems", "KYC automation", "Risk rules"],
                        "behavioral": ["Analytical thinking", "Judgment", "Integrity", "Commercial sense"]
                    }
                },
                {
                    "domain": "RegTech",
                    "competencies": {
                        "technical": ["Compliance automation", "AML monitoring", "Regulatory reporting", "Audit trails"],
                        "behavioral": ["Ethical judgment", "Attention to detail", "Process discipline", "Objectivity"]
                    }
                }
            ]
        },
        {
            "industry": "HealthTech",
            "domains": [
                {
                    "domain": "Telemedicine",
                    "competencies": {
                        "technical": ["Virtual consultation workflows", "Patient data management", "E-prescription systems", "Privacy compliance"],
                        "behavioral": ["Empathy", "Clear communication", "Confidentiality", "Service orientation"]
                    }
                },
                {
                    "domain": "Healthcare Platforms",
                    "competencies": {
                        "technical": ["EMR systems", "Appointment management", "Claims integration", "User analytics"],
                        "behavioral": ["Problem solving", "Stakeholder management", "Patient focus", "Adaptability"]
                    }
                },
                {
                    "domain": "Medical Devices",
                    "competencies": {
                        "technical": ["Device calibration", "Biomedical sensors", "Regulatory testing", "Clinical validation"],
                        "behavioral": ["Precision", "Safety mindset", "Documentation discipline", "Accountability"]
                    }
                }
            ]
        },
        {
            "industry": "ClimateTech",
            "domains": [
                {
                    "domain": "Carbon Management",
                    "competencies": {
                        "technical": ["Carbon accounting", "Emissions measurement", "ESG reporting", "Offset evaluation"],
                        "behavioral": ["Sustainability mindset", "Analytical thinking", "Integrity", "Stakeholder influence"]
                    }
                },
                {
                    "domain": "Clean Energy Solutions",
                    "competencies": {
                        "technical": ["Energy modeling", "Clean technology assessment", "Project feasibility", "Performance monitoring"],
                        "behavioral": ["Innovation", "Systems thinking", "Commercial judgment", "Problem solving"]
                    }
                },
                {
                    "domain": "Climate Risk Analytics",
                    "competencies": {
                        "technical": ["Scenario modeling", "Climate data analysis", "Risk mapping", "Impact assessment"],
                        "behavioral": ["Critical thinking", "Long-term thinking", "Objectivity", "Learning agility"]
                    }
                }
            ]
        },
        {
            "industry": "Environmental Services",
            "domains": [
                {
                    "domain": "Waste Management",
                    "competencies": {
                        "technical": ["Waste segregation", "Collection planning", "Recycling processes", "Compliance tracking"],
                        "behavioral": ["Environmental responsibility", "Discipline", "Coordination", "Problem solving"]
                    }
                },
                {
                    "domain": "Water Management",
                    "competencies": {
                        "technical": ["Water auditing", "Treatment processes", "Leak detection", "Consumption analysis"],
                        "behavioral": ["Sustainability mindset", "Attention to detail", "Community orientation", "Analytical thinking"]
                    }
                },
                {
                    "domain": "Environmental Compliance",
                    "competencies": {
                        "technical": ["Environmental impact assessment", "Pollution monitoring", "Regulatory reporting", "Site inspections"],
                        "behavioral": ["Integrity", "Objectivity", "Process discipline", "Stakeholder management"]
                    }
                }
            ]
        },
        {
            "industry": "Marine & Shipping",
            "domains": [
                {
                    "domain": "Port Operations",
                    "competencies": {
                        "technical": ["Cargo handling", "Berth planning", "Port safety", "Equipment coordination"],
                        "behavioral": ["Coordination", "Alertness", "Safety orientation", "Decision making"]
                    }
                },
                {
                    "domain": "Ship Operations",
                    "competencies": {
                        "technical": ["Navigation basics", "Engine room operations", "Deck operations", "Maritime regulations"],
                        "behavioral": ["Discipline", "Teamwork", "Resilience", "Responsibility"]
                    }
                },
                {
                    "domain": "Freight Forwarding",
                    "competencies": {
                        "technical": ["Shipping documentation", "Customs coordination", "Freight rates", "Shipment tracking"],
                        "behavioral": ["Customer focus", "Negotiation", "Problem solving", "Responsiveness"]
                    }
                }
            ]
        },
        {
            "industry": "Aviation",
            "domains": [
                {
                    "domain": "Airport Operations",
                    "competencies": {
                        "technical": ["Passenger handling", "Baggage systems", "Ground operations", "Airport safety"],
                        "behavioral": ["Service orientation", "Composure", "Coordination", "Responsiveness"]
                    }
                },
                {
                    "domain": "Cabin Crew Services",
                    "competencies": {
                        "technical": ["Safety procedures", "Emergency response", "Passenger service", "First aid basics"],
                        "behavioral": ["Empathy", "Confidence", "Communication", "Crisis handling"]
                    }
                },
                {
                    "domain": "Air Traffic Support",
                    "competencies": {
                        "technical": ["Flight data monitoring", "Communication protocols", "Weather interpretation", "Navigation basics"],
                        "behavioral": ["Calm under pressure", "Precision", "Attention to detail", "Decision making"]
                    }
                }
            ]
        },
        {
            "industry": "Security Services",
            "domains": [
                {
                    "domain": "Physical Security",
                    "competencies": {
                        "technical": ["Access control", "Patrolling", "Incident reporting", "Surveillance systems"],
                        "behavioral": ["Vigilance", "Discipline", "Integrity", "Assertiveness"]
                    }
                },
                {
                    "domain": "Event Security",
                    "competencies": {
                        "technical": ["Crowd management", "Entry screening", "Emergency procedures", "Coordination protocols"],
                        "behavioral": ["Composure", "Communication", "Situational awareness", "Conflict handling"]
                    }
                },
                {
                    "domain": "Corporate Security",
                    "competencies": {
                        "technical": ["Visitor management", "CCTV monitoring", "Security audits", "Threat reporting"],
                        "behavioral": ["Confidentiality", "Responsibility", "Observation", "Professional conduct"]
                    }
                }
            ]
        },
        {
            "industry": "Human Resources",
            "domains": [
                {
                    "domain": "Talent Acquisition",
                    "competencies": {
                        "technical": ["Sourcing", "Interviewing", "Applicant tracking systems", "Offer management"],
                        "behavioral": ["Judgment", "Communication", "Relationship building", "Bias awareness"]
                    }
                },
                {
                    "domain": "Learning & Development",
                    "competencies": {
                        "technical": ["Training needs analysis", "Program design", "Facilitation", "Learning evaluation"],
                        "behavioral": ["Empathy", "Presentation skills", "Coaching mindset", "Adaptability"]
                    }
                },
                {
                    "domain": "Performance Management",
                    "competencies": {
                        "technical": ["KPI design", "Goal setting frameworks", "Feedback systems", "HR analytics"],
                        "behavioral": ["Objectivity", "Influencing", "Confidentiality", "Stakeholder management"]
                    }
                }
            ]
        },
        {
            "industry": "BPO & Customer Service",
            "domains": [
                {
                    "domain": "Voice Process",
                    "competencies": {
                        "technical": ["Call handling", "CRM usage", "Script adherence", "Escalation management"],
                        "behavioral": ["Patience", "Listening", "Clarity", "Resilience"]
                    }
                },
                {
                    "domain": "Non-Voice Process",
                    "competencies": {
                        "technical": ["Email handling", "Chat support", "Ticket resolution", "Documentation"],
                        "behavioral": ["Written communication", "Accuracy", "Time management", "Customer empathy"]
                    }
                },
                {
                    "domain": "Quality Assurance",
                    "competencies": {
                        "technical": ["Call auditing", "Quality scoring", "Feedback documentation", "Process compliance"],
                        "behavioral": ["Objectivity", "Attention to detail", "Coaching orientation", "Fairness"]
                    }
                }
            ]
        }
    ]
};

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to DB, starting seed...");

    // Clear existing data to prevent duplicates if ran multiple times
    console.log("🗑️  Clearing existing competency data...");
    await Competency.deleteMany({});
    await Domain.deleteMany({});
    await Industry.deleteMany({});
    console.log("✅ Cleared existing data");

    let totalIndustries = 0;
    let totalDomains = 0;
    let totalCompetencies = 0;

    for (const indData of seedData.industries) {
      // 1. Create Industry
      const newIndustry = await Industry.create({ name: indData.industry });
      totalIndustries++;
      console.log(`🏭 Created Industry: ${newIndustry.name}`);

      for (const domData of indData.domains) {
        // 2. Create Domain
        const newDomain = await Domain.create({
          name: domData.domain,
          industry: newIndustry._id
        });
        totalDomains++;
        console.log(`   📁 Created Domain: ${newDomain.name}`);

        // 3. Create Technical Competencies
        if (domData.competencies.technical) {
          for (const compName of domData.competencies.technical) {
            await Competency.create({
              name: compName,
              type: "technical",
              domain: newDomain._id,
              industry: newIndustry._id
            });
            totalCompetencies++;
            console.log(`      ✓ Technical Competency: ${compName}`);
          }
        }

        // 4. Create Behavioral Competencies
        if (domData.competencies.behavioral) {
          for (const compName of domData.competencies.behavioral) {
            await Competency.create({
              name: compName,
              type: "behavioral",
              domain: newDomain._id,
              industry: newIndustry._id
            });
            totalCompetencies++;
            console.log(`      ✓ Behavioral Competency: ${compName}`);
          }
        }
      }
    }

    console.log("\n📊 Seed Summary:");
    console.log(`   Industries:    ${totalIndustries}`);
    console.log(`   Domains:       ${totalDomains}`);
    console.log(`   Competencies:  ${totalCompetencies}`);
    console.log("\nSeeding completed successfully! 🚀");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();