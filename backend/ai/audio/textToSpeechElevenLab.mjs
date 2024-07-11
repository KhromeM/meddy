import WebSocket from "ws";
import {
	chatStreamProvider,
	chatStreamToReadable,
} from "../langAi/chatStream.mjs";
import { createWriteStream } from "fs";
import { v4 as uuid } from "uuid";
import CONFIG from "../../config.mjs";
import { getAudioDurationInSeconds } from "get-audio-duration";
import db from "../../db/db.mjs";
import { writeLog } from "../../extra/logging/logging.mjs";
import {
	groqModel,
	anthropicModel,
	vertexAIModel,
	openAIModel,
} from "../langAi/model.mjs";

let defaultModel = CONFIG.TEST
	? openAIModel
	: openAIModel || anthropicModel || vertexAIModel || openAIModel;
const VOICES = {
	es2: "8ftlfIEYnEkYY6iLanUO",
	es: "L1QajoRwPFiqw35KD4Ch",
	en: "OYTbf65OHHFELVut7v2H",
};
const VOICE_ID = VOICES["SPN"];
const BOS_MESSAGE = " ";
const EOS_MESSAGE = "";
const CHUNK_SEPERATOR = " ";
const endOfSentenceMarkersSet = new Set([
	".",
	"!",
	"?",
	"\n",
	";",
	":",
	"\t",
	'"',
	"'",
	"\\",
	")",
	"}",
	"]",
]);
const TTSEnglish = "eleven_turbo_v2";
const TTSMulti = "eleven_multilingual_v2";
const filePath = "./ai/audio/genAudio/experiments/spn/exp1";

/** Used for running experiments and measuring latency */
const TTSWithChatHistory = async (chatHistory) => {
	let user = { userid: "testUserId", name: "Devin" };
	let i = 1;
	const llmStream = await chatStreamProvider(chatHistory, user, defaultModel);
	const ws = new WebSocket(
		`wss://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream-input?model_id=${TTSMulti}`
	);
	const fileName = filePath + `audio.mp3`;
	const ffileStream = createWriteStream(fileName);
	const first = Date.now();
	let prev = first;
	let totalDuration = 0;

	streamLLMToElevenLabs(
		ws,
		llmStream,
		async (data) => {
			const message = JSON.parse(data);
			if (message.audio) {
				const audioChunk = Buffer.from(message.audio, "base64");
				const chunkFileName = filePath + `audio${i}.mp3`;
				const fileStream = createWriteStream(chunkFileName);
				fileStream.write(audioChunk);
				ffileStream.write(audioChunk);
				fileStream.end();

				const now = Date.now();
				let duration = 0;
				try {
					duration = await getAudioDurationInSeconds(chunkFileName);
				} catch (error) {
					console.error(`Error getting duration for chunk ${i}:`);
				}

				totalDuration += duration;
				console.log(
					`Chunk ${i} took ${
						now - prev
					} ms to receive and is ${duration.toFixed(2)} seconds long.`
				);
				prev = now;
				i++;
			}
			if (message.isFinal) {
				const totalTime = Date.now() - first;
				console.log(`Took ${totalTime} ms total to generate audio`);
				console.log(
					`Total audio duration: ${totalDuration.toFixed(2)} seconds`
				);
				console.log(
					`Average processing speed: ${(
						(totalDuration * 1000) /
						totalTime
					).toFixed(2)}x realtime`
				);
				ffileStream.end();
				ws.close();
			}
		},
		null,
		0,
		null
	);
};
/**
 * Converts chat history to speech using ElevenLabs API and streams the audio to the client
 * @param {Array} chatHistory - Array of message objects representing the chat history
 * @param {WebSocket} outputSocket - WebSocket connection to the client for forwarding audio
 * @param {WriteStream} fileStream - File stream to write the audio locally
 * @param {Object} req -- Request object containing a lot of information
 * @returns {Promise<void>}
 */
export const TTS_WS = async (chatHistory, clientSocket, fileStream, req) => {
	const llmStream = await chatStreamProvider(
		chatHistory,
		req.user,
		defaultModel
	);
	const TTS_Socket = new WebSocket(
		`wss://api.elevenlabs.io/v1/text-to-speech/${
			VOICES[req.lang]
		}/stream-input?model_id=${req.lang == "en" ? TTSEnglish : TTSMulti}`
	);
	streamLLMToElevenLabs(
		TTS_Socket,
		llmStream,
		clientSocket,
		(data) => {
			const message = JSON.parse(data);
			clientSocket.send(
				JSON.stringify({ ...message, reqId: req.reqId, type: "audio" })
			);
			if (message.audio) {
				// logging
				if (!req.logs.firstAudioChunkFromTTS) {
					req.logs.firstAudioChunkFromTTS = Date.now();
				}
				const audioChunk = Buffer.from(message.audio, "base64");
				fileStream.write(audioChunk); // write the audio to some file in the server as well to save it
			}
			if (message.isFinal) {
				// dont close client connection!
				req.logs.lastAudioChunkFromTTS = Date.now(); // Logging
				writeLog(req); // write the logs
				fileStream.end(); // the file were writing to
				TTS_Socket.close(); //close elevenlabs ws connection
			}
		},
		req
	);
};

/**
 * Converts chat history to speech using ElevenLabs API and streams the audio to the client using Server-Sent Events (SSE)
 * @param {Array} chatHistory - Array of message objects representing the chat history
 * @param {Object} response - Express response object for sending server-side events
 * @param {import('fs').WriteStream} fileStream - File stream to write the audio locally
 * @param {Object} user - User object from DB
 * @param {string} reqID - Request ID to differentiate results from different requests
 * @param {string} [lang="ENG"] - Language for text-to-speech, defaults to English
 * @returns {Promise<void>}
 */
export const TTS_SSE = async (
	chatHistory,
	response,
	fileStream,
	user,
	reqID,
	lang = "ENG"
) => {
	const llmStream = await chatStreamProvider(chatHistory, user, defaultModel);
	const ws = new WebSocket(
		`wss://api.elevenlabs.io/v1/text-to-speech/${
			VOICES[lang]
		}/stream-input?model_id=${lang == "ENG" ? TTSEnglish : TTSMulti}`
	);
	streamLLMToElevenLabs(ws, llmStream, null, (data) => {
		const message = JSON.parse(data);
		response.write(`data: ${JSON.stringify({ ...message, reqID })}\n\n`);
		if (message.audio) {
			const audioChunk = Buffer.from(message.audio, "base64");
			fileStream.write(audioChunk); // write the audio to some file in the server as well to save it
		}
		if (message.isFinal) {
			response.write("data: [DONE]\n\n");
			fileStream.end(); // the file were writing to
			ws.close(); //close elevenlabs ws connection
		}
	});
};

/**
 * Streams LLM output to ElevenLabs API for text-to-speech conversion
 * @param {WebSocket} TTS_Socket - WebSocket connection to ElevenLabs API
 * @param {AsyncIterable<string>} llmStream - Async iterable of LLM text chunks
 * @param {WebSocket} outputSocket - WebSocket connection to the client for forwarding audio
 * @param {function} callback - Callback function to handle messages from ElevenLabs
 * @param {Object} req -- Request object from express, used for logging
 * @param {Object} [voiceSettings] - Voice settings for ElevenLabs API
 * @param {number} [optimize_streaming_latency=0] - Latency optimization level
 * @param {number[]} [chunk_length_schedule=[120,160,250,290]] - Chunk length schedule for streaming
 * @returns {Promise<void>}
 */
async function streamLLMToElevenLabs(
	TTS_Socket,
	llmStream,
	outputSocket,
	callback,
	req,
	voiceSettings,
	optimize_streaming_latency,
	chunk_length_schedule,
	bufferLimit
) {
	TTS_Socket.on("open", async () => {
		TTS_Socket.send(
			JSON.stringify({
				text: BOS_MESSAGE,
				voice_settings: voiceSettings || {
					stability: 0.5,
					similarity_boost: 0.8,
				},
				xi_api_key: CONFIG.ELEVENLABS_API_KEY,
				optimize_streaming_latency: optimize_streaming_latency || 0,
				chunk_length_schedule: chunk_length_schedule || [120, 160, 250, 290],
			})
		);
		const totalResponse = [];
		let partialResponse = "";
		for await (const chunk of llmStream) {
			// logging
			if (req && !req.logs.firstLLMChunk) {
				req.logs.firstLLMChunk = Date.now();
				req.logs.model = defaultModel.model;
			}
			partialResponse += chunk;
			totalResponse.push(chunk);
			if (outputSocket) {
				outputSocket.send(
					JSON.stringify({
						type: "chat_response",
						data: chunk,
						reqId: req.reqId,
					})
				);
			}
			if (
				partialResponse.length > bufferLimit || // if the built up response is more than 500 characters
				endOfSentenceMarkersSet.has(chunk[chunk.length - 1]) // if the built up response ends with a ending of sentence signifier
			) {
				TTS_Socket.send(
					JSON.stringify({
						text: partialResponse + CHUNK_SEPERATOR,
					})
				);
				partialResponse = "";
			}
		}
		req.logs.llmResponse = totalResponse.join(""); // logging
		req.response = req.logs.llmResponse;
		await db.createMessage(req.user.userid, "llm", totalResponse.join(""));

		TTS_Socket.send(JSON.stringify({ text: EOS_MESSAGE }));
	});
	TTS_Socket.on("message", callback);
	TTS_Socket.on("error", (error) => {
		console.error("WebSocket error:", error);
	});
}

// Experiment stuff:
// const chatHistory = [
// 	{
// 		source: "user",
// 		// text: "Tell me a short story about tigers! In latin american spanish and 100 words. No comments about the prompt, respond only with the story.",
// 		text: "Tell me a short story about birds! Under 100 words and in spanish. Dont comment on the prompt, respond only with the story.",
// 	},
// ];

// TTSWithChatHistory(chatHistory);
