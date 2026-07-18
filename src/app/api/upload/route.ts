import { NextResponse } from "next/server";
// @ts-expect-error: pdf-parse/lib/pdf-parse has no typings
import pdf from "pdf-parse/lib/pdf-parse";
import { parseResume } from "@/lib/ai/parser";
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
    
    // Extract text from PDF
    const pdfData = await pdf(buffer);
    const text = pdfData.text;

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 });
    }

    // AI Parsing
    const parsedResume = await parseResume(text);
    
    // Combine skills and experience for vector embedding
    const searchString = [
      ...parsedResume.skills,
      ...parsedResume.certifications,
      ...parsedResume.experience.map(e => `${e.role} ${e.description}`)
    ].join(" ");

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
