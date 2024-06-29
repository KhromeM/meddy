import { ChatGroq } from "@langchain/groq";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { ChatOpenAI } from "@langchain/openai";
import { CONFIG } from "../../config.mjs";

export const vertexAIModel = new ChatVertexAI({
	model: "gemini-1.5-pro",
	temperature: 0,
	//apiKey: path to service worker or have gcloud cli
});
export const groqModel = new ChatGroq({
	model: "llama3-70b-8192",
	temperature: 0,
	apiKey: CONFIG.GROQ_API_KEY,
});

export const openAIModel = new ChatOpenAI({
	model: "gpt-3.5-turbo",
	temperature: 0,
	apiKey: CONFIG.OPENAI_API_KEY,
});

export const anthropicModel = new ChatAnthropic({
	model: "claude-3-sonnet-20240229",
	temperature: 0,
	apiKey: CONFIG.ANTHROPIC_API_KEY,
});
