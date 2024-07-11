import { createDGSocket } from "../ai/audio/speechToTextDeepgram.mjs";
import { LiveTranscriptionEvents } from "@deepgram/sdk";
import { TTS_WS } from "../ai/audio/textToSpeechElevenLab.mjs";
import { createWriteStream } from "fs";
import {
	chatStreamProvider,
	getChatResponse,
} from "../ai/langAi/chatStream.mjs";
import db from "../db/db.mjs";
import { groqModel } from "../ai/langAi/model.mjs";

export async function handleAudioMessage(state, data) {
	const { audioChunk, reqId, isComplete, lang } = data;
	const { STTSocket } = state;
	if (!state.requests[reqId]) {
		state.requests[reqId] = {
			reqId,
			transcribing: true,
			partialTranscript: [],
			transcript: "",
			partialResponse: "",
			response: "",
			lang: "en",
			type: "audio",
			isComplete: false,
			user: state.user,
			logs: {},
		};
	}
	// handlePartialResponse(ws, req, reqId, isComplete); // send audio response based on partial transcription to reduce latency
	const req = state.requests[reqId];
	console.log("partial transcript: ", req.partialTranscript);
	if (req.partialTranscript.length === 0) {
		req.logs.firstAudioChunkFromClient = Date.now();
		req.logs.lang = lang;
		req.logs.reqId = reqId;
	}
	if (isComplete && state.STTSocket) {
		// Logging
		req.logs.lastAudioChunkFromClient = Date.now();
		clearTimeout(state.STTTimeout);
		state.STTSocket.requestClose();
	}
	if (!audioChunk) return;
	if (!state.STTSocket || state.STTSocket.getReadyState() !== 1) {
		try {
			state.STTSocket = await createDGSocket(lang);
			req.partialTranscript = [];

			state.STTSocket.addListener(
				LiveTranscriptionEvents.Transcript,
				(data) => {
					const text = data.channel.alternatives[0].transcript;
					req.partialTranscript.push(text);
					state.clientSocket.send(
						JSON.stringify({ type: "partial_transcript", data: text, reqId })
					);
				}
			);

			state.STTSocket.addListener(LiveTranscriptionEvents.Close, () => {
				req.logs.endTranscription = Date.now(); // logging
				req.transcript = req.partialTranscript.join(" ");
				state.clientSocket.send(
					JSON.stringify({
						type: "transcription_complete",
						data: req.transcript,
						reqId,
					})
				);
				useTranscriptionTTS(state, req); // responds in audio
			});

			state.STTSocket.addListener(LiveTranscriptionEvents.Error, (err) => {
				console.error("Deepgram error: ", err);
				state.clientSocket.send(
					JSON.stringify({
						type: "error",
						data: "Transcription error occurred",
						reqId,
					})
				);
			});
			state.STTTimeout = setTimeout(() => {
				state.STTSocket.requestClose();
			}, 30000);
		} catch (error) {
			console.error("Error creating Deepgram socket:", error);
			state.clientSocket.send(
				JSON.stringify({
					type: "error",
					data: "Failed to initialize transcription service",
					reqId,
				})
			);
			return;
		}
	}
	if (state.STTSocket.getReadyState() !== 1) {
		state.clientSocket.send(
			JSON.stringify({
				type: "error",
				data: "Transcription service not ready",
				reqId,
			})
		);
		return;
	}
	clearTimeout(state.STTTimeout);
	state.STTTimeout = setTimeout(() => {
		// console.log("Audio stream timeout. Closing Deepgram connection.");
		state.STTSocket.requestClose();
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
		state.STTSocket.send(audioBuffer);
	} catch (error) {
		console.error("Error sending audio to Deepgram:", error);
		state.clientSocket.send(
			JSON.stringify({ type: "error", data: "Error processing audio" })
		);
	}
}

// respond to audio message with text only
export async function useTranscription(ws, req) {
	const text = req.transcript;
	const user = req.user;
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

// respond to audio message with text and audio
export async function useTranscriptionTTS(state, req) {
	const text = req.transcript;
	try {
		const chatHistory = await db.getRecentMessagesByUserId(
			req.user.userid,
			100
		);
		chatHistory.push({ source: "user", text });
		await db.createMessage(req.user.userid, "user", text);
		const filePath = "./websocket/genAudio/";
		const fileName =
			filePath + new Date(Date.now()).toISOString() + `audio.mp3`;
		const fileStream = createWriteStream(fileName);
		TTS_WS(chatHistory, state.clientSocket, fileStream, req);
	} catch (error) {
		console.error("Error in audio stream:", error.message);
		state.clientSocket.send(
			JSON.stringify({
				type: "error",
				data: "Error processing audio message",
				reqId: req.reqId,
			})
		);
	}
}

// async function handlePartialResponse(ws, req, reqId, isComplete);{
// 	const request = req.requests[reqId]
// 	if (isComplete || request.isComplete) return
// 	const llmResponse = await getChatResponse([{ source: "user", request.partialResponse.join("") }],req._dbUser, groqModel,2)
// 	if (request.isComplete) return

// }
