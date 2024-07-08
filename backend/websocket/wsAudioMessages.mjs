import { createDGSocket } from "../ai/audio/speechToTextDeepgram.mjs";
import { LiveTranscriptionEvents } from "@deepgram/sdk";
import { TTS_WS } from "../ai/audio/textToSpeechElevenLab.mjs";
import { createWriteStream } from "fs";
import { chatStreamProvider } from "../ai/langAi/chatStream.mjs";
import db from "../db/db.mjs";

export async function handleAudioMessage(ws, req, data) {
	const { audioChunk, reqId, isComplete, lang } = data;
	let dg = req.dg;
	if (isComplete && dg) {
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
		// console.log("Audio stream timeout. Closing Deepgram connection.");
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

export async function useTranscription(ws, req) {
	// respond to audio message with text only
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

export async function useTranscriptionTTS(ws, req, lang) {
	// respond to audio message with text and audio
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
