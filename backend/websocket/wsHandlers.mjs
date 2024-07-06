import { chatStreamProvider } from "../ai/langAi/chatStream.mjs";
import { vertexAIModel } from "../ai/langAi/model.mjs";
import authMiddleware from "../server/middleware/authMiddleware.mjs";
import usedMiddleware from "../server/middleware/authMiddleware.mjs";
import db from "../db/db.mjs";
import userMiddleware from "../server/middleware/userMiddleware.mjs";
import loggerMiddleware from "../server/middleware/loggerMiddleware.mjs";
import CONFIG from "../config.mjs";
import { createDGSocket } from "../ai/audio/speechToTextDeepgram.mjs";
import { LiveTranscriptionEvents } from "@deepgram/sdk";
import { TTS_WS } from "../ai/audio/textToSpeechElevenLab.mjs";
import { createWriteStream } from "fs";
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

async function handleAudioMessage(ws, req, data) {
	const { audioChunk, reqId, isComplete, lang } = data;
	console.log("Complete: ", isComplete);
	let dg = req.dg;
	if (isComplete && dg) {
		console.log("Called dg.requestClose()");
		clearTimeout(req.dgTimeout);
		dg.requestClose();
	}
	if (!audioChunk) return;
	if (!dg || dg.getReadyState() !== 1) {
		try {
			req.dg = await createDGSocket(lang);
			dg = req.dg;
			req.partialTranscript = [];

			dg.addListener(LiveTranscriptionEvents.Transcript, (data) => {
				const text = data.channel.alternatives[0].transcript;
				req.partialTranscript.push(text);
				ws.send(JSON.stringify({ type: "partial_transcript", data: text }));
			});

			dg.addListener(LiveTranscriptionEvents.Close, () => {
				console.log("now closing");
				req.transcript = req.partialTranscript.join(" ");
				ws.send(
					JSON.stringify({
						type: "transcription_complete",
						data: req.transcript,
					})
				);
				req.partialTranscript = [];
				req.dg = null;
				// useTranscription(ws, req); // responds in chat
				useTranscriptionTTS(ws, req, lang); // responds in audio
			});

			dg.addListener(LiveTranscriptionEvents.Error, (err) => {
				console.error("Deepgram error: ", err);
				ws.send(
					JSON.stringify({
						type: "error",
						data: "Transcription error occurred",
					})
				);
			});
			req.dgTimeout = setTimeout(() => {
				dg.requestClose();
			}, 30000);
		} catch (error) {
			console.error("Error creating Deepgram socket:", error);
			ws.send(
				JSON.stringify({
					type: "error",
					data: "Failed to initialize transcription service",
				})
			);
			return;
		}
	}
	if (dg.getReadyState() !== 1) {
		ws.send(
			JSON.stringify({ type: "error", data: "Transcription service not ready" })
		);
		return;
	}
	clearTimeout(req.dgTimeout);
	req.dgTimeout = setTimeout(() => {
		console.log("Audio stream timeout. Closing Deepgram connection.");
		dg.requestClose();
	}, 30000); // reset timeout clock

	try {
		let audioBuffer;
		if (audioChunk instanceof ArrayBuffer) {
			audioBuffer = audioChunk;
		} else if (audioChunk instanceof Blob) {
			audioBuffer = await audioChunk.arrayBuffer();
		} else if (typeof audioChunk === "string") {
			audioBuffer = Buffer.from(audioChunk, "base64");
		} else {
			throw new Error("Unsupported audio format");
		}
		dg.send(audioBuffer);
	} catch (error) {
		console.error("Error sending audio to Deepgram:", error);
		ws.send(JSON.stringify({ type: "error", data: "Error processing audio" }));
	}
}

async function useTranscription(ws, req) {
	const text = req.transcript;
	const user = req._dbUser;
	try {
		const chatHistory = await db.getRecentMessagesByUserId(user.userid, 100);
		chatHistory.push({ source: "user", text });
		req.transcript = "";
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

async function useTranscriptionTTS(ws, req, lang) {
	const text = req.transcript;
	const user = req._dbUser;
	try {
		const chatHistory = await db.getRecentMessagesByUserId(user.userid, 100);
		chatHistory.push({ source: "user", text });
		req.transcript = "";
		await db.createMessage(user.userid, "user", text);
		const filePath = "./websocket/genAudio/";
		const fileName =
			filePath + new Date(Date.now()).toISOString() + `audio.mp3`;
		const fileStream = createWriteStream(fileName);
		TTS_WS(chatHistory, ws, fileStream, user, "", lang);
	} catch (error) {
		console.error("Error in audio stream:", error.message);
		ws.send(
			JSON.stringify({ type: "error", data: "Error processing audio message" })
		);
	}
}
