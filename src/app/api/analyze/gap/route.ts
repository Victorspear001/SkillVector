import { NextResponse } from "next/server";
export const maxDuration = 60;
import { analyzeGap } from "@/lib/ai/parser";
import { db } from "@/lib/db";
import { jobs, analyses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { analysisId, jobId } = await request.json();

    if (!analysisId || !jobId) {
      return NextResponse.json({ error: "Missing analysisId or jobId" }, { status: 400 });
    }

    const jobResults = await db.select().from(jobs).where(eq(jobs.id, jobId));
    const analysisResults = await db.select().from(analyses).where(eq(analyses.id, analysisId));

    if (jobResults.length === 0 || analysisResults.length === 0) {
      return NextResponse.json({ error: "Job or Analysis not found" }, { status: 404 });
    }

    const job = jobResults[0];
    const analysis = analysisResults[0];

    const userSkillsData = analysis.user_skills as { skills: string[], certifications: string[] };
    const allUserSkills = [...userSkillsData.skills, ...userSkillsData.certifications];

    const gapResult = await analyzeGap(allUserSkills, job.description);

    return NextResponse.json(gapResult);
  } catch (error) {
    console.error("Gap analysis error:", error);
    return NextResponse.json({ error: "Failed to perform gap analysis" }, { status: 500 });
  }
}
