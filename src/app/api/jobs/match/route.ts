import { NextResponse } from "next/server";
export const maxDuration = 60;
import { generateEmbedding } from "@/lib/ai/embeddings";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { analysisId, embedding, limit = 5 } = await request.json();

    let searchVector: number[] = [];

    if (embedding) {
      searchVector = embedding;
    } else if (analysisId) {
      // Lookup the analysis in the DB to retrieve the user's embedding
      const { eq } = await import("drizzle-orm");
      const { analyses } = await import("@/lib/db/schema");
      
      const results = await db.select().from(analyses).where(eq(analyses.id, analysisId));
      if (results.length === 0) {
        return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
      }
      
      searchVector = results[0].user_embedding as number[];
    } else {
      return NextResponse.json({ error: "Missing embedding or analysisId" }, { status: 400 });
    }

    // Convert number[] to string for the SQL query
    const vectorString = JSON.stringify(searchVector);

    // Using raw SQL for vector_distance_cos since Turso's vector functions aren't natively mapped in Drizzle
    const query = sql`
      SELECT 
        id, title, company, industry, location, description, required_skills,
        vector_distance_cos(
          json_extract(description_embedding, '$'), 
          json_extract(${vectorString}, '$')
        ) as distance
      FROM jobs
      ORDER BY distance ASC
      LIMIT ${limit}
    `;

    const matchedJobs = await db.all(query);

    return NextResponse.json({ matches: matchedJobs });
  } catch (error) {
    console.error("Match error:", error);
    return NextResponse.json({ error: "Failed to find matching jobs" }, { status: 500 });
  }
}
