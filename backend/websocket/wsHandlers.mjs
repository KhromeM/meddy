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
			// holds the state for all the state for a ws connection
			const state = {
				requests: {
					// holds all the requests, using reqID as key
					EXAMPLE: {
						reqId: "EXAMPLE",
						transcribing: true,
						partialTranscript: [],
						transcript: "",
						stallResponse: "",
						stalling: false,
						response: "",
						lang: "en",
						type: "audio",
						isComplete: false,
						user: null,
						source: "mobile",
						logs: {},
					},
				},
				authenticated: false,
				clientSocket: ws,
				STTSocket: null,
				STTTimeout: null,
				user: null,
			};
			ws.on("error", (error) => {
				if (CONFIG.TEST) {
					return;
				}
				console.error("WebSocket error:", error);
			});
			ws.on("close", (code, reason) => {
				if (state.STTSocket) {
					state.STTSocket.requestClose();
				}
				clearTimeout(state.STTimeout);
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
							const { idToken, source } = data;
							const res = {};
							req.ws = true;
							req.idToken = idToken;
							// runMiddleware(loggerMiddleware)
							await runMiddleware(req, res, authMiddleware);
							await runMiddleware(req, res, userMiddleware);
							state.user = req._dbUser;
							state.authenticated = true;
							state.source = source;
							ws.send(JSON.stringify({ type: "auth" }));
							break;
						case "chat":
							if (!state.authenticated) {
								throw new Error("WS connection not authenticated");
							}
							await handleChatMessage(state, data);
							break;
						case "audio":
							if (!state.authenticated) {
								throw new Error("WS connection not authenticated");
							}
							await handleAudioMessage(state, data);
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
