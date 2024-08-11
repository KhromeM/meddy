import { ChatVertexAI } from "@langchain/google-vertexai";
import CONFIG from "../../config.mjs";
import fs from "fs";

const googleAuthCreds = JSON.parse(
  fs.readFileSync(CONFIG.GOOGLE_APPLICATION_CREDENTIALS)
);
export const vertexAIModel = new ChatVertexAI({
  model: "gemini-1.5-pro",
  temperature: 0.5,
  authOptions: {
    credentials: googleAuthCreds,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_ONLY_HIGH",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_ONLY_HIGH",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_ONLY_HIGH",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_ONLY_HIGH",
    },
  ],
  maxOutputTokens: 8192,
});
