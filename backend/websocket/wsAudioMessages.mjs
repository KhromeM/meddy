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
	if (!state.requests[reqId]) {
		console.log("NEW REQUEST");
		state.requests[reqId] = {
			reqId,
			transcribing: true,
			partialTranscript: [],
			transcript: "",
			stallResponse: "",
			stalling: false,
			response: "",
			lang: "en",
			type: "audio",
			source: state.source,
			isComplete: false,
			user: state.user,
			logs: {},
		};
	}
	const req = state.requests[reqId];
	console.log("partial transcript: ", req.partialTranscript, reqId);
	// handlePartialResponse(state.clientSocket, req); // send audio response based on partial transcription to reduce latency

	if (req.partialTranscript.length === 0) {
		// Logging
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
			state.STTSocket = await createDGSocket(lang, req.source == "mobile");
			// req.partialTranscript = [];

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
				console.log("DG CLOSING", reqId);
				if (req.isComplete) return; // helps stop dev mode bs from flutter and react
				req.isComplete = true;
				req.logs.endTranscription = Date.now(); // logging
				req.transcript = req.partialTranscript.join(" ");
				req.transcribing = false;
				state.clientSocket.send(
					JSON.stringify({
						type: "partial_transcript",
						data: req.transcript,
						reqId,
						isComplete: true,
					})
				);
				useTranscriptionTTS(state.clientSocket, req); // responds in audio
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
		let audioBuffer = Buffer.from(audioChunk, "base64");
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

		ws.send(
			JSON.stringify({ type: "chat_response", data: "", isComplete: true })
		);
	} catch (error) {
		console.error("Error in chat stream:", error.message);
		ws.send(
			JSON.stringify({ type: "error", data: "Error processing chat message" })
		);
	}
}

// respond to audio message with text and audio
export async function useTranscriptionTTS(clientSocket, req) {
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
			filePath +
			new Date(Date.now()).toISOString() +
			(req.source == "mobile" ? ".pcm" : `.mp3`);
		const fileStream = createWriteStream(fileName);
		console.log("audio file name: ", fileName);
		TTS_WS(chatHistory, clientSocket, fileStream, req);
	} catch (error) {
		console.error("Error in audio stream:", error.message);
		clientSocket.send(
			JSON.stringify({
				type: "error",
				data: "Error processing audio message",
				reqId: req.reqId,
			})
		);
	}
}

export async function handlePartialResponse(clientSocket, req) {
	if (req.transcribing == false) return; // transcription already done, might as well as return the real response
	if (req.stalling == true) return; // in the process of generating a stall response, or have done so already
	let partialTranscript = req.partialTranscript.join(" ");
	if (partialTranscript.length < 50) return; // not enough has been transcribed to give a meaning ful response
	req.stalling = true;
	partialTranscript += "...";
	console.log("GENERATING STALL USING: ");
	const chatHistory = [{ source: "user", text: partialTranscript }]; // just sending the partial transcription, no history
	console.log(chatHistory);
	const stallReq = {
		reqId: "stall" + req.reqId,
		transcribing: false,
		partialTranscript: req.partialTranscript,
		transcript: req.transcript,
		response: "",
		lang: req.lang,
		isComplete: false,
		user: req.user,
		logs: {},
		isStall: true,
	};
	const filePath = "./websocket/genAudio/stall/";
	const fileName = filePath + new Date(Date.now()).toISOString() + `audio.mp3`;
	const fileStream = createWriteStream(fileName);
	TTS_WS(chatHistory, clientSocket, fileStream, stallReq, 1);
}
