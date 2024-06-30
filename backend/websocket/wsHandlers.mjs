// backend/websocket/wsHandlers.mjs
import { chatStreamProvider } from "../ai/langAi/chatStream.mjs";
import { vertexAIModel } from "../ai/langAi/model.mjs";
import db from "../db/db.mjs";

export function setupWebSocketHandlers(wss) {
	wss.on("connection", (ws) => {
		console.log("New WebSocket connection");
		const user = request._dbUser;

		ws.on("message", async (message) => {
			try {
				const { type, data } = JSON.parse(message);

				switch (type) {
					case "chat":
						await handleChatMessage(ws, data, user);
						break;
					// Add more case handlers for other message types in the future
					default:
						ws.send(
							JSON.stringify({ type: "error", data: "Unknown message type" })
						);
				}
			} catch (error) {
				console.error("Error processing message:", error);
				ws.send(
					JSON.stringify({ type: "error", data: "Error processing message" })
				);
			}
		});
	});
}

async function handleChatMessage(ws, data, user) {
	const { text } = data;

	try {
		const chatHistory = await db.getRecentMessagesByUserId(user.userid, 100);

		const stream = await chatStreamProvider(
			chatHistory,
			vertexAIModel,
			"default"
		);

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
		console.error("Error in chat stream:", error);
		ws.send(
			JSON.stringify({ type: "error", data: "Error processing chat message" })
		);
	}
}
