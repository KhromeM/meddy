import WebSocket from "ws";
import {
	chatStreamProvider,
	chatStreamToReadable,
} from "../langAi/chatStream.mjs";
import { createWriteStream } from "fs";
import { v4 as uuid } from "uuid";
import CONFIG from "../../config.mjs";

const VOICES = {
	spn1: "8ftlfIEYnEkYY6iLanUO",
	spn2: "L1QajoRwPFiqw35KD4Ch",
	eng1: "OYTbf65OHHFELVut7v2H",
};
const VOICE_ID = VOICES["eng1"];
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
const filePath = "./ai/audio/genAudio/";

const TTSHelperTest = async (chatHistory) => {
	const fileName = filePath + `${uuid()}.mp3`;
	const fileStream = createWriteStream(fileName);
	const llmStream = await chatStreamProvider(chatHistory);
	const ws = new WebSocket(
		`wss://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream-input?model_id=${TTSEnglish}`
	);
	streamLLMToElevenLabs(ws, llmStream, (data) => {
		const message = JSON.parse(data);
		if (message.audio) {
			const audioChunk = Buffer.from(message.audio, "base64");
			fileStream.write(audioChunk);
		}
		if (message.isFinal) {
			fileStream.end();
			ws.close();
			console.log(`Audio file generated: ${fileName}`);
		}
	});
};

async function streamLLMToElevenLabs(
	ws,
	llmStream,
	callback,
	voiceSettings,
	optimize_streaming_latency,
	chunk_length_schedule
) {
	ws.on("open", async () => {
		ws.send(
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

		let partialResponse = "";
		for await (const chunk of llmStream) {
			partialResponse += chunk;
			if (
				partialResponse.length > 500 || // if the built up response is more than 500 characters
				endOfSentenceMarkersSet.has(chunk[chunk.length - 1]) // if the built up response ends with a ending of sentence signifier
			) {
				ws.send(
					JSON.stringify({
						text: partialResponse + CHUNK_SEPERATOR,
					})
				);
				partialResponse = "";
			}
		}
		ws.send(JSON.stringify({ text: EOS_MESSAGE }));
	});
	ws.on("message", callback);
	ws.on("error", (error) => {
		console.error("WebSocket error:", error);
	});
}

const chatHistory = [
	{
		source: "user",
		// text: "Tell me a short story about tigers! In latin american spanish and 100 words. No comments about the prompt, respond only with the story.",
		text: "Tell me a short story about tigers! Under 50 words. No comments about the prompt, respond only with the story.",
	},
];

TTSHelperTest(chatHistory);
