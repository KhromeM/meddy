import { getChatResponse } from "../../ai/langAi/chatStream.mjs";
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
		const { image, text } = req.body.message;
		if (!text) {
			res
				.status(400)
				.json({ status: "fail", message: "An empty message was provided" });
			return;
		}
		const chatHistory = await db.getRecentMessagesByUserId(
			req._dbUser.userid,
			100
		);
		chatHistory.push({ source: "user", text, image });
		const content = await getChatResponse(chatHistory, req._dbUser);
		if (!content) {
			throw new Error("LLM didn't respond");
		}
		db.createMessage(req._dbUser.userid, "user", text, image);
		db.createMessage(req._dbUser.userid, "llm", content);
		res.status(200).json({ text: content });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Failed to reach Gemini" });
	}
};
