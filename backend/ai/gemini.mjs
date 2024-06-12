import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function textGemini(text) {
	const data = await model.generateContent(text);
	return data.response.text();
}

export async function chat(text) {
	const chatModel = model.startChat({
		history: [
			{
				role: "user",
				parts: [{ text: "Hello, I have 2 dogs in my house." }],
			},
			{
				role: "model",
				parts: [{ text: "Great to meet you. What would you like to know?" }],
			},
		],
		generationConfig: {
			maxOutputTokens: 100,
		},
	});
	const result = await chatModel.sendMessage(text);
	const response = await result.response;
	return response.text;
}
