import { createRequire } from "module";
import { textGeminiWithHistory } from "../../ai/gemini.mjs";

const require = createRequire(import.meta.url);
const db = require("../../db/db.js");

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
		const content = await textGeminiWithHistory(text, chatHistory);
		db.createMessage(req._dbUser.userid, "user", text);
		db.createMessage(req._dbUser.userid, "llm", content);
		res.status(200).json({ text: content });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Failed to reach Gemini" });
	}
};
