import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;
let _flashModel: GenerativeModel | null = null;
let _embeddingModel: GenerativeModel | null = null;

function getGenAI() {
  if (!_genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return _genAI;
}

export function getGeminiFlashModel() {
  if (!_flashModel) {
    _flashModel = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });
  }
  return _flashModel;
}

export function getEmbeddingModel() {
  if (!_embeddingModel) {
    _embeddingModel = getGenAI().getGenerativeModel({ model: "gemini-embedding-2" });
  }
  return _embeddingModel;
}

// Backward-compatible lazy exports
export const geminiFlashModel = new Proxy({} as GenerativeModel, {
  get(_target, prop) {
    return (getGeminiFlashModel() as any)[prop];
  },
});

export const fallbackEmbeddingModel = new Proxy({} as GenerativeModel, {
  get(_target, prop) {
    return (getEmbeddingModel() as any)[prop];
  },
});
