import { geminiFlashModel } from "./gemini";
import type { ParsedResume, GapAnalysis } from "../types";

export async function parseResumeBase64(base64Data: string, mimeType: string): Promise<ParsedResume> {
  const prompt = `
    Extract a comprehensive list of skills, certifications, experience, and education from this resume document.
    Recognize terms from any industry.
    Return ONLY a structured JSON object conforming strictly to the following structure:
    {
      "skills": ["skill1", "skill2"],
      "certifications": ["cert1"],
      "experience": [
        { "role": "string", "company": "string", "duration": "string", "description": "string" }
      ],
      "education": [
        { "degree": "string", "institution": "string", "year": "string" }
      ]
    }
    IMPORTANT: If you cannot read the document, or if it contains no relevant information, return the JSON structure with empty arrays. Do not return any conversational text.
  `;

  try {
    const result = await geminiFlashModel.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
      prompt,
    ]);
    const responseText = result.response.text();
    // Try to safely parse the JSON block from the output
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/{[\s\S]*}/);
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
    
    return JSON.parse(jsonString) as ParsedResume;
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw new Error("Failed to parse resume");
  }
}

export async function analyzeGap(userSkills: string[], jobDescription: string): Promise<GapAnalysis> {
  const prompt = `
    User Skills: ${JSON.stringify(userSkills)}
    Target Job Description: ${jobDescription}

    Identify the exact certifications, specific tools, or domain knowledge required by this job description that the user currently lacks.
    Provide a concrete, 3-step actionable plan to acquire them.
    Assign a match score from 0 to 100 representing how well the user's current skills match the job.

    Return ONLY a structured JSON object conforming strictly to the following structure:
    {
      "missingSkills": ["skill1", "skill2"],
      "actionPlan": ["step1", "step2", "step3"],
      "matchScore": number
    }
  `;

  try {
    const result = await geminiFlashModel.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/{[\s\S]*}/);
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;

    return JSON.parse(jsonString) as GapAnalysis;
  } catch (error) {
    console.error("Error analyzing gap:", error);
    throw new Error("Failed to analyze gap");
  }
}
