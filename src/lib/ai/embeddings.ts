import { fallbackEmbeddingModel } from "./gemini";

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await fallbackEmbeddingModel.embedContent(text);
    const embedding = result.embedding;
    return embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}
