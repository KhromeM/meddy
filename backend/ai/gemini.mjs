import { GoogleGenerativeAI } from "@google/generative-ai";
import CONFIG from "../config.mjs";
const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function textGemini(text) {
	const data = await model.generateContent(text);
	return data.response.text();
}

export async function textGeminiWithHistory(text, chatHistory) {
	const history = chatHistory.map((message) => ({
		role: message.source == "user" ? "user" : "model",
		parts: [{ text: message.text }],
	}));
	history.reverse();
	const chat = model.startChat({
		history,
		generationConfig: {
			maxOutputTokens: 100,
		},
	});
	const result = await chat.sendMessage(text);
	const response = await result.response;
	return response.text();
}
