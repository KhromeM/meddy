import { chatStreamProvider } from "../ai/langAi/chatStream.mjs";
import { vertexAIModel } from "../ai/langAi/model.mjs";
import authMiddleware from "../server/middleware/authMiddleware.mjs";
import usedMiddleware from "../server/middleware/authMiddleware.mjs";
import db from "../db/db.mjs";
import userMiddleware from "../server/middleware/userMiddleware.mjs";
import loggerMiddleware from "../server/middleware/loggerMiddleware.mjs";
import CONFIG from "../config.mjs";

const defaultModel = vertexAIModel;

const runMiddleware = (req, res, middleware) => {
	return new Promise((resolve, reject) => {
		middleware(req, res, (val) => {
			if (val instanceof Error) {
				reject(val);
			} else {
				resolve(val);
			}
		});
	});
};

export function setupWebSocketHandlers(wss) {
	wss.on("connection", async (ws, req) => {
		try {
			let user = null;
			ws.on("error", (error) => {
				if (CONFIG.TEST) {
					return;
				}
				console.error("WebSocket error:", error);
			});
			ws.on("close", (code, reason) => {
				// console.log(`WebSocket closed with code ${code} and reason: ${reason}`);
			});

			ws.on("message", async (message) => {
				try {
					const { type, data } = JSON.parse(message);

					if (!type || !data) {
						throw new Error("Invalid message format");
					}
					switch (type) {
						case "auth":
							const { idToken } = data;
							const res = {};
							req.ws = true;
							req.idToken = idToken;
							// runMiddleware(loggerMiddleware)
							await runMiddleware(req, res, authMiddleware);
							await runMiddleware(req, res, userMiddleware);
							user = req._dbUser;
							req.auth = true;
							ws.send(JSON.stringify({ type: "auth" }));
							break;
						case "chat":
							if (!req.auth) {
								throw new Error("WS connection not authenticated");
							}
							await handleChatMessage(ws, data, user);
							break;
						// Add case handlers for audio
						default:
							ws.send(
								JSON.stringify({ type: "error", data: "Unknown message type" })
							);
					}
				} catch (error) {
					console.error("Error processing message:", error.message);
					ws.send(JSON.stringify({ type: "error", data: error.message }));
				}
			});
		} catch (err) {
			console.error("WebSocket error:", err);
		}
	});
}

async function handleChatMessage(ws, data, user) {
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
		const stream = await chatStreamProvider(chatHistory, user, defaultModel, 0);

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
