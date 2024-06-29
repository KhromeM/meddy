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
	temperature: 0,
	authOptions: {
		credentials: googleAuthCreds,
	},
});
export const groqModel = new ChatGroq({
	model: "llama3-70b-8192",
	temperature: 0,
	apiKey: CONFIG.GROQ_API_KEY,
});

export const openAIModel = new ChatOpenAI({
	model: "gpt-4o",
	temperature: 0,
	apiKey: CONFIG.OPENAI_API_KEY,
});

export const anthropicModel = new ChatAnthropic({
	model: "claude-3-5-sonnet-20240620",
	temperature: 0,
	apiKey: CONFIG.ANTHROPIC_API_KEY,
});
