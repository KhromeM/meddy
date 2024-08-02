import { ChatGroq } from "@langchain/groq";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { ChatOpenAI } from "@langchain/openai";
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

export const groqModel = new ChatGroq({
  model: "llama3-70b-8192",
  temperature: 0.7,
  apiKey: CONFIG.GROQ_API_KEY,
});

export const openAIModel = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.7,
  apiKey: CONFIG.OPENAI_API_KEY,
});

export const anthropicModel = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0.7,
  apiKey: CONFIG.ANTHROPIC_API_KEY,
});
