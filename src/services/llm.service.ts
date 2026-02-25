import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateTasksFromTranscript(transcript: string) {
  const prompt = `
You are a task extraction engine.

From the transcript below, extract actionable tasks.

Return ONLY valid JSON in this exact format:

{
  "tasks": [
    {
      "id": "T1",
      "description": "string",
      "priority": "low | medium | high",
      "dependencies": ["T2"]
    }
  ]
}

Rules:
- id must be unique
- dependencies must reference other task ids
- no explanations
- output valid JSON only

Transcript:
${transcript}
`;

  const stream = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  let fullText = "";

  for await (const chunk of stream) {
    fullText += chunk.text ?? "";
  }
  console.log("full-text: ", fullText);
  return fullText;
}