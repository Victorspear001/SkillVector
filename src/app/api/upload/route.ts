import { NextResponse } from "next/server";

export const maxDuration = 60;

import { parseResumeBase64 } from "@/lib/ai/parser";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { db } from "@/lib/db";
import { analyses } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    
    // AI Parsing natively from PDF via Gemini
    const parsedResume = await parseResumeBase64(base64Data, file.type || 'application/pdf');

    
    const searchParts = [];
    if (parsedResume.skills?.length) searchParts.push(...parsedResume.skills);
    if (parsedResume.certifications?.length) searchParts.push(...parsedResume.certifications);
    if (parsedResume.experience?.length) {
      searchParts.push(...parsedResume.experience.map(e => `${e.role} ${e.description}`));
    }
    
    const searchString = searchParts.join(" ").trim() || "Entry Level Professional Resume";

    const embedding = await generateEmbedding(searchString);

    // Save to DB
    const [inserted] = await db.insert(analyses).values({
      user_skills: parsedResume,
      user_embedding: embedding,
    }).returning({ id: analyses.id });

    return NextResponse.json({
      analysisId: inserted.id,
      parsedResume,
      embedding
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process resume" }, { status: 500 });
  }
}
