import db from "../db/db.mjs";
import { chatStreamProvider } from "../ai/langAi/chatStream.mjs";

export async function handleChatMessage(state, data) {
	const { clientSocket, user } = state;
	const { text } = data;
	if (!text) {
		clientSocket.send(
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
			clientSocket.send(
				JSON.stringify({
					type: "chat_response",
					data: chunk,
					isComplete: false,
				})
			);
		}

		const llmResponse = llmResponseChunks.join("");

		await db.createMessage(user.userid, "user", text);
		await db.createMessage(user.userid, "llm", llmResponse);

		clientSocket.send(
			JSON.stringify({ type: "chat_response", isComplete: true })
		);
	} catch (error) {
		console.error("Error in chat stream:", error.message);
		clientSocket.send(
			JSON.stringify({ type: "error", data: "Error processing chat message" })
		);
	}
}
