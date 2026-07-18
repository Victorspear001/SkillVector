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
      // Logic to fetch embedding from 'analyses' table could go here
      // For this MVP, we assume the client passes the embedding or we handle it
      return NextResponse.json({ error: "analysisId lookup not implemented yet" }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Missing embedding" }, { status: 400 });
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
