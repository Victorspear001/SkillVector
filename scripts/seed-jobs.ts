import { db } from "../src/lib/db";
import { jobs } from "../src/lib/db/schema";
import { generateEmbedding } from "../src/lib/ai/embeddings";

const sampleJobs = [
  {
    title: "Registered Nurse",
    company: "City Health Hospital",
    industry: "Healthcare",
    location: "New York, NY",
    description: "Provide patient care, administer medications, and collaborate with physicians. Monitor patient conditions and document care in EHR systems.",
    required_skills: ["Patient Care", "EHR/EMR", "Medication Administration", "CPR/BLS", "Clinical Documentation"]
  },
  {
    title: "Electrician",
    company: "PowerGrid Solutions",
    industry: "Trades",
    location: "Chicago, IL",
    description: "Install, maintain, and repair electrical wiring, equipment, and fixtures. Ensure compliance with NEC and local building codes.",
    required_skills: ["Electrical Wiring", "Blueprint Reading", "NEC Compliance", "Troubleshooting", "Safety Protocols"]
  },
  {
    title: "Financial Analyst",
    company: "Global Finance Corp",
    industry: "Finance",
    location: "London, UK",
    description: "Analyze financial data, create financial models, and prepare variance analysis reports. Assist in budgeting and forecasting processes.",
    required_skills: ["Financial Modeling", "Excel (Advanced)", "Variance Analysis", "Forecasting", "Data Analysis"]
  },
  {
    title: "Curriculum Designer",
    company: "EdTech Innovations",
    industry: "Education",
    location: "Remote",
    description: "Design and develop engaging educational content and curricula for K-12 students. Align materials with state educational standards.",
    required_skills: ["Curriculum Development", "Instructional Design", "Educational Standards", "E-Learning", "Subject Matter Expertise"]
  },
  {
    title: "Full-Stack Developer",
    company: "TechNova",
    industry: "Tech",
    location: "San Francisco, CA",
    description: "Develop scalable web applications using React and Node.js. Collaborate with cross-functional teams to design and implement new features.",
    required_skills: ["React", "Node.js", "TypeScript", "REST APIs", "SQL/NoSQL Database"]
  },
  {
    title: "Medical Lab Technician",
    company: "Diagnostics Plus",
    industry: "Healthcare",
    location: "Austin, TX",
    description: "Perform routine medical laboratory tests for the diagnosis, treatment, and prevention of disease. Operate and maintain laboratory equipment.",
    required_skills: ["Laboratory Testing", "Phlebotomy", "Quality Control", "Equipment Maintenance", "Microbiology"]
  },
  {
    title: "HVAC Technician",
    company: "Comfort Air Systems",
    industry: "Trades",
    location: "Miami, FL",
    description: "Install, repair, and maintain heating, ventilation, and air conditioning systems in residential and commercial properties.",
    required_skills: ["HVAC Systems", "Refrigeration", "Electrical Diagnostics", "Preventative Maintenance", "Customer Service"]
  },
  {
    title: "Compliance Officer",
    company: "SecureBank",
    industry: "Finance",
    location: "Toronto, ON",
    description: "Ensure company operations adhere to internal policies and regulatory requirements. Conduct audits and risk assessments.",
    required_skills: ["Regulatory Compliance", "Risk Assessment", "Internal Auditing", "AML/KYC", "Policy Development"]
  }
];

async function seed() {
  console.log("Starting seed process...");

  for (const job of sampleJobs) {
    console.log(`Processing job: ${job.title}...`);
    try {
      const searchString = `${job.title} ${job.industry} ${job.description} ${job.required_skills.join(" ")}`;
      const embedding = await generateEmbedding(searchString);

      await db.insert(jobs).values({
        title: job.title,
        company: job.company,
        industry: job.industry,
        location: job.location,
        description: job.description,
        required_skills: job.required_skills,
        description_embedding: embedding,
      });

      console.log(`Successfully inserted: ${job.title}`);
    } catch (error) {
      console.error(`Failed to process job ${job.title}:`, error);
    }
  }

  console.log("Seed process completed.");
}

seed().catch(console.error);
