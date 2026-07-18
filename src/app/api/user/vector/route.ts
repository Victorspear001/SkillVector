import { NextResponse } from "next/server";
export const maxDuration = 60;
import { generateEmbedding } from "@/lib/ai/embeddings";

export async function POST(request: Request) {
  try {
    const { skills } = await request.json();

    if (!skills || !Array.isArray(skills)) {
      return NextResponse.json({ error: "Invalid skills array" }, { status: 400 });
    }

    const searchString = skills.join(" ");
    const embedding = await generateEmbedding(searchString);

    return NextResponse.json({ embedding });
  } catch (error) {
    console.error("Vector generation error:", error);
    return NextResponse.json({ error: "Failed to generate vector" }, { status: 500 });
  }
}
