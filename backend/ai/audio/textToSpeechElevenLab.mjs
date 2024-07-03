import WebSocket from "ws";
import {
	chatStreamProvider,
	chatStreamToReadable,
} from "../langAi/chatStream.mjs";
import { createWriteStream } from "fs";
import { v4 as uuid } from "uuid";
import CONFIG from "../../config.mjs";

const VOICE_ID = "OYTbf65OHHFELVut7v2H"; // Hope default voice
const BOS_MESSAGE = " ";
const EOS_MESSAGE = "";
const TTSEnglish = "eleven_turbo_v2";
const TTSMulti = "eleven_multilingual_v2";

// async function streamLLMToElevenLabs(chatHistory) {
// 	const fileName = `./ai/audio/genAudio/${uuid()}.mp3`;
// 	const fileStream = createWriteStream(fileName);
// 	const model = TTSEnglish || TTSMulti;
// 	const ws = new WebSocket(
// 		`wss://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream-input?model_id=${model}`
// 	);

// 	ws.on("open", async () => {
// 		ws.send(
// 			JSON.stringify({
// 				text: BOS_MESSAGE,
// 				voice_settings: { stability: 0.5, similarity_boost: 0.8 },
// 				xi_api_key: CONFIG.ELEVENLABS_API_KEY,
// 			})
// 		);

// 		const llmStream = await chatStreamProvider(chatHistory);
// 		const llmResponse = [];
// 		for await (const chunk of llmStream) {
// 			console.log("sending: ", chunk);
// 			llmResponse.push(chunk);
// 			ws.send(
// 				JSON.stringify({
// 					text: chunk,
// 				})
// 			);
// 		}
// 		console.log("\nTotal LLM response: \n" + llmResponse.join(""));

// 		ws.send(JSON.stringify({ text: EOS_MESSAGE }));
// 	});

// 	ws.on("message", (data) => {
// 		console.log(data);
// 		const message = JSON.parse(data);
// 		if (message.audio) {
// 			const audioChunk = Buffer.from(message.audio, "base64");
// 			fileStream.write(audioChunk);
// 		}
// 		if (message.isFinal) {
// 			fileStream.end();
// 			ws.close();
// 			console.log(`Audio file generated: ${fileName}`);
// 		}
// 	});

// 	ws.on("error", (error) => {
// 		console.error("WebSocket error:", error);
// 	});

// 	// fileStream.on("finish", () => {
// 	// 	console.log(`Audio file generated: ${fileName}`);
// 	// });

// 	fileStream.on("error", (error) => {
// 		console.error("Error writing audio file:", error);
// 	});
// }

// // Usage
// const chatHistory = [
// 	{
// 		source: "user",
// 		text: "Tell me a short story about elephants! Under 100 words.",
// 	},
// ];

// streamLLMToElevenLabs(chatHistory);
// setTimeout(() => console.log("20 seconds"), 20000);
// chatStreamToReadable(chatStreamProvider(chatHistory)).pipe(
// 	createWriteStream(`./ai/audio/genAudio/pipedtext.txt`)
// );

async function streamLLMToElevenLabs2(chatHistory) {
	return new Promise((resolve, reject) => {
		const fileName = `./ai/audio/genAudio/${uuid()}.mp3`;
		const fileStream = createWriteStream(fileName);
		const model = TTSEnglish || TTSMulti;
		const ws = new WebSocket(
			`wss://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream-input?model_id=${model}`
		);

		ws.on("open", async () => {
			try {
				ws.send(
					JSON.stringify({
						text: BOS_MESSAGE,
						voice_settings: {
							stability: 0.5,
							similarity_boost: 0.8,
							optimize_streaming_latency: 4,
						},
						xi_api_key: CONFIG.ELEVENLABS_API_KEY,
					})
				);

				const llmStream = await chatStreamProvider(chatHistory);
				const llmResponse = [];
				for await (const chunk of llmStream) {
					console.log("sending: ", chunk);
					await new Promise((resolve) => setTimeout(resolve, 500));
					llmResponse.push(chunk);
					ws.send(
						JSON.stringify({
							text: chunk,
							try_trigger_generation: true,
						})
					);
				}
				console.log("\nTotal LLM response: \n" + llmResponse.join(""));

				ws.send(JSON.stringify({ text: EOS_MESSAGE }));
			} catch (error) {
				reject(error);
			}
		});

		ws.on("message", (data) => {
			console.log(data);
			try {
				const message = JSON.parse(data);
				if (message.audio) {
					const audioChunk = Buffer.from(message.audio, "base64");
					fileStream.write(audioChunk);
				}
				if (message.isFinal) {
					fileStream.end(() => {
						ws.close();
						resolve(fileName);
					});
				}
			} catch (error) {
				reject(error);
			}
		});

		ws.on("error", (error) => {
			console.error("WebSocket error:", error);
			reject(error);
		});

		fileStream.on("error", (error) => {
			console.error("Error writing audio file:", error);
			reject(error);
		});
	});
}

async function streamLLMToElevenLabs(chatHistory) {
	return new Promise((resolve, reject) => {
		const fileName = `./ai/audio/genAudio/${uuid()}.mp3`;
		const fileStream = createWriteStream(fileName);
		const model = TTSEnglish || TTSMulti || TTSEnglish;
		const ws = new WebSocket(
			`wss://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream-input?model_id=${model}`
		);
		let prev = Date.now();

		ws.on("open", async () => {
			try {
				ws.send(
					JSON.stringify({
						text: " ",
						voice_settings: { stability: 0.5, similarity_boost: 0.8 },
						xi_api_key: CONFIG.ELEVENLABS_API_KEY,
						generation_config: {
							chunk_length_schedule: [120, 160, 250, 290],
						},
					})
				);
				await new Promise((resolve) => setTimeout(resolve, 500));

				const llmStream = await chatStreamProvider(chatHistory);
				for await (const chunk of llmStream) {
					// console.log("sending: ", chunk);
					ws.send(
						JSON.stringify({
							text: chunk,
							// try_trigger_generation: true,
						})
					);
				}

				// Send final flush message
				ws.send(
					JSON.stringify({
						text: "",
						flush: true,
					})
				);
			} catch (error) {
				reject(error);
			}
		});

		ws.on("message", (data) => {
			// console.log(data);
			const now = Date.now();
			console.log(now - prev);
			prev = now;
			try {
				const message = JSON.parse(data);
				if (message.audio) {
					const audioChunk = Buffer.from(message.audio, "base64");
					fileStream.write(audioChunk);
				}
				if (message.isFinal) {
					fileStream.end(() => {
						ws.close();
						resolve(fileName);
					});
				}
			} catch (error) {
				reject(error);
			}
		});

		ws.on("error", (error) => {
			console.error("WebSocket error:", error);
			reject(error);
		});

		fileStream.on("error", (error) => {
			console.error("Error writing audio file:", error);
			reject(error);
		});
	});
}
// Usage
const chatHistory = [
	{
		source: "user",
		text: "Tell me a short story about elephants! Under 100 words  spanish.",
	},
];

streamLLMToElevenLabs(chatHistory)
	.then((fileName) =>
		console.log(`Audio generation complete. File: ${fileName}`)
	)
	.catch((error) => console.error("Error in audio generation process:", error));
