export interface ParsedResume {
  skills: string[];
  certifications: string[];
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

export interface GapAnalysis {
  missingSkills: string[];
  actionPlan: string[];
  matchScore: number;
}
