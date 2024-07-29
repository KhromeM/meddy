import WebSocket from "ws";
import { chatStreamProvider } from "../langAi/chatStream.mjs";
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
// import { OutputFormat } from "elevenlabs/api";

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
	". ",
	"! ",
	"? ",
	"\n ",
	"; ",
	": ",
	"\t ",
	'" ',
	"' ",
	"\\ ",
	") ",
	"} ",
	"] ",
]);

const turbo = "eleven_turbo_v2_5";
const TTSMulti = "eleven_multilingual_v2";
const filePath = "./ai/audio/genAudio/experiments/spn/exp1";

/**
 * Converts chat history to speech using ElevenLabs API and streams the audio to the client
 * @param {Array} chatHistory - Array of message objects representing the chat history
 * @param {WebSocket} outputSocket - WebSocket connection to the client for forwarding audio
 * @param {WriteStream} fileStream - File stream to write the audio locally
 * @param {Object} req -- Request object containing a lot of information
 * @param {Number} quality -- The quality of the transcipt used to generate the response (0-3), 0 = 0, 1 = 50 chars, 2 = 150 chars, 3 = total
 * @returns {Promise<void>}
 */
export const TTS_WS = async (
	chatHistory,
	clientSocket,
	fileStream,
	req,
	quality = 3
) => {
	const type = "audio_" + quality;
	const mode = quality == 3 ? 0 : 2;
	const llmStream = await chatStreamProvider(
		chatHistory,
		req.user,
		defaultModel,
		mode
	);
	const output_format = req.source == "mobile" ? "pcm_16000" : "mp3_44100_64"; // "mp3_44100_64";
	const TTS_Socket = new WebSocket(
		`wss://api.elevenlabs.io/v1/text-to-speech/${
			VOICES[req.lang]
		}/stream-input?model_id=${turbo}&output_format=${output_format}`
	);
	streamLLMToElevenLabs(
		TTS_Socket,
		llmStream,
		clientSocket,
		(data) => {
			const message = JSON.parse(data);
			// console.log(message);
			clientSocket.send(
				JSON.stringify({
					...message,
					reqId: req.reqId,
					type,
					output_format,
				})
			);
			if (message.audio) {
				// console.log(message.audio);
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
		req,
		quality
	);
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
	quality = 3,
	voiceSettings,
	optimize_streaming_latency,
	chunk_length_schedule,
	bufferLimit = 100
) {
	console.log("11 LABS CALL");
	TTS_Socket.on("open", async () => {
		TTS_Socket.send(
			JSON.stringify({
				text: BOS_MESSAGE,
				voice_settings: voiceSettings || {
					stability: 0.5,
					similarity_boost: 0.8,
				},
				xi_api_key: CONFIG.ELEVENLABS_API_KEY,
				optimize_streaming_latency: 4, // 4 || optimize_streaming_latency || 0, // MAX OPTIMIZATION
				chunk_length_schedule: chunk_length_schedule || [120, 160, 250, 290],
				// output_format: "pcm_16000", // req.source == "mobile" ? "pcm_16000" : "mp3_44100_64", // if mobile them pcm16000 else mp3
			})
		);

		console.log(
			"OUTPUT FORMAT: ",
			req.source == "mobile" ? "pcm_16000" : "mp3_44100_64"
		);
		const totalResponse = [];
		let partialResponse = "";
		let sentTTSChunk = false;
		for await (const chunk of llmStream) {
			// logging
			if (req && !req.logs.firstLLMChunk) {
				req.logs.firstLLMChunk = Date.now();
				req.logs.model = defaultModel.model;
			}
			partialResponse += chunk;
			totalResponse.push(chunk);
			if (outputSocket && quality == 3) {
				outputSocket.send(
					JSON.stringify({
						type: "chat_response",
						data: chunk,
						reqId: req.reqId,
					})
				);
			}
			// if (
			// 	(!sentTTSChunk && partialResponse.length > 25) ||
			// 	endOfSentenceMarkersSet.has(chunk.slice(-2)) || // if havent sent TTS any chunks, send if over 25 chars in buffer or ending with EOS char
			// 	(partialResponse.length > bufferLimit / 2 &&
			// 		endOfSentenceMarkersSet.has(chunk.slice(-2))) || // if the built up response is more than half the buffer limit and ends with a EOS char
			// 	partialResponse.length > bufferLimit // or over the buffer limit
			// ) {
			// 	sentTTSChunk = true; // have sent tts a chunk
			// 	TTS_Socket.send(
			// 		JSON.stringify({
			// 			text: partialResponse + CHUNK_SEPERATOR,
			// 		})
			// 	);
			// 	partialResponse = "";
			// }

			if (
				partialResponse.length > bufferLimit ||
				endOfSentenceMarkersSet.has(chunk.slice(-2)) // if the built up response ends with a ending of sentence signifier
			) {
				sentTTSChunk = true; // have sent tts a chunk
				TTS_Socket.send(
					JSON.stringify({
						text: partialResponse + CHUNK_SEPERATOR,
					})
				);
				partialResponse = "";
			}
		}
		TTS_Socket.send(
			JSON.stringify({
				text: partialResponse + CHUNK_SEPERATOR,
			})
		);
		TTS_Socket.send(JSON.stringify({ text: EOS_MESSAGE }));
		req.logs.llmResponse = totalResponse.join(""); // logging
		req.response = req.logs.llmResponse;
		if (quality == 3) {
			await db.createMessage(req.user.userid, "llm", totalResponse.join(""));
		}
	});
	TTS_Socket.on("message", callback);
	TTS_Socket.on("error", (error) => {
		console.error("WebSocket error:", error);
	});
}

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
		`wss://api.elevenlabs.io/v1/text-to-speech/${VOICES[lang]}/stream-input?model_id=${turbo}`
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
