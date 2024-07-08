import authMiddleware from "../server/middleware/authMiddleware.mjs";
import userMiddleware from "../server/middleware/userMiddleware.mjs";
import loggerMiddleware from "../server/middleware/loggerMiddleware.mjs";
import CONFIG from "../config.mjs";
import { handleAudioMessage } from "./wsAudioMessages.mjs";
import { handleChatMessage } from "./wsChatMessages.mjs";

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
			req.partialTranscript = []; // use as state to build up partial transcriptions
			req.transcript = ""; // save completed transcriptions here
			ws.on("error", (error) => {
				if (CONFIG.TEST) {
					return;
				}
				console.error("WebSocket error:", error);
			});
			ws.on("close", (code, reason) => {
				if (req.dg) {
					req.dg.requestClose();
				}
				clearTimeout(req.dgTimeout);
			});

			ws.on("message", async (message) => {
				try {
					const { type, data } = JSON.parse(message);
					if (!type || !data) {
						throw new Error("Invalid message format");
					}
					console.log(type);
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
						case "audio":
							if (!req.auth) {
								throw new Error("WS connection not authenticated");
							}
							console.log(
								req.partialTranscript,
								req.transcript,
								req.dg?.getReadyState()
							);
							await handleAudioMessage(ws, req, data, user);
							break;
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
