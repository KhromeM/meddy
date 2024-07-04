import {
	getChatResponse,
	chatStreamProvider,
} from "../../ai/langAi/chatStream.mjs";
import { vertexAIModel } from "../../ai/langAi/model.mjs";
import db from "../../db/db.mjs";

export const getChatHistory = async (req, res) => {
	try {
		const chatHistory = await db.getRecentMessagesByUserId(
			req._dbUser.userid,
			100
		);
		res.status(200).json({ chatHistory });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ status: "fail", message: "Something went wrong. Checkpoint 3" });
	}
};

export const postChatMessage = async (req, res) => {
	try {
		const text = req.body.message.text;
		const chatHistory = await db.getRecentMessagesByUserId(
			req._dbUser.userid,
			100
		);
		chatHistory.push({ source: "user", text });
		const content = await getChatResponse(chatHistory, req._dbUser);
		if (!content) {
			throw new Error("LLM didn't respond");
		}
		db.createMessage(req._dbUser.userid, "user", text);
		db.createMessage(req._dbUser.userid, "llm", content);
		res.status(200).json({ text: content });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Failed to reach Gemini" });
	}
};

const defaultModel = vertexAIModel;

// Uses SSE
export const postChatMessageStream = async (req, res) => {
	try {
		const text = req.body.message.text;
		const chatHistory = await db.getRecentMessagesByUserId(
			req._dbUser.userid,
			100
		);

		// Set headers for SSE
		res.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		});

		chatHistory.push({ source: "user", text });

		const stream = await chatStreamProvider(
			chatHistory,
			req._dbUser,
			defaultModel,
			0
		);

		let llmResponseChunks = [];
		for await (const chunk of stream) {
			res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
			llmResponseChunks.push(chunk);
		}

		const llmResponse = llmResponseChunks.join("");

		res.write("data: [DONE]\n\n");

		await db.createMessage(req._dbUser.userid, "user", text);
		await db.createMessage(req._dbUser.userid, "llm", llmResponse);
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ status: "fail", message: "Failed to process streaming chat" });
	} finally {
		res.end();
	}
};
