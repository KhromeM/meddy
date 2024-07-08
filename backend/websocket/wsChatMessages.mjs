import db from "../db/db.mjs";
import { chatStreamProvider } from "../ai/langAi/chatStream.mjs";

export async function handleChatMessage(ws, data, user) {
	const { text } = data;
	if (!text) {
		ws.send(
			JSON.stringify({ type: "error", data: "Text message is required" })
		);
		return;
	}
	try {
		const chatHistory = await db.getRecentMessagesByUserId(user.userid, 100);
		chatHistory.push({ source: "user", text });
		const stream = await chatStreamProvider(chatHistory, user);

		let llmResponseChunks = [];

		for await (const chunk of stream) {
			llmResponseChunks.push(chunk);
			ws.send(JSON.stringify({ type: "chat_response", data: chunk }));
		}

		const llmResponse = llmResponseChunks.join("");

		await db.createMessage(user.userid, "user", text);
		await db.createMessage(user.userid, "llm", llmResponse);

		ws.send(JSON.stringify({ type: "chat_end" }));
	} catch (error) {
		console.error("Error in chat stream:", error.message);
		ws.send(
			JSON.stringify({ type: "error", data: "Error processing chat message" })
		);
	}
}
