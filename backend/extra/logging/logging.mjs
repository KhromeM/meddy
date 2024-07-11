import { createWriteStream } from "fs";
import { mkdir } from "fs";
import path from "path";

export const writeLog = (req) => {
	req.logs.transcript = req.transcript; // copy transcript to the logging object
	const log = JSON.parse(JSON.stringify(req.logs)); // make a deep copy of the logging object

	const logDir = "./extra/logs";
	const fileName = `LOG_${new Date().toISOString().replace(/:/g, "-")}.txt`;
	const filePath = path.join(logDir, fileName);

	mkdir(logDir, { recursive: true }, (err) => {
		const stream = createWriteStream(filePath, { flags: "a" }); // append mode
		const writeLineToStream = (line) => {
			stream.write(line + "\n");
		};

		writeLineToStream(`User query: ${log.transcript}`);
		writeLineToStream(`User query length: ${log.transcript?.length}`);
		writeLineToStream(`User query language: ${log.lang}`);
		writeLineToStream(`LLM model: ${log.model}`);
		writeLineToStream(`LLM response: ${log.llmResponse}`);
		writeLineToStream(`LLM response length: ${log.llmResponse?.length}`);
		writeLineToStream(
			`Time between last audio chunk and end of transcription: ${
				log.endTranscription - log.lastAudioChunkFromClient
			}`
		);

		writeLineToStream(
			`Time between end of transcription and first llm chunk: ${
				log.firstLLMChunk - log.endTranscription
			}`
		);

		writeLineToStream(
			`Time between end of first llm chunk and first audio chunk from TTS: ${
				log.firstAudioChunkFromTTS - log.firstLLMChunk
			}`
		);

		writeLineToStream(
			`Total time to get first audio chunk from TTS after getting last audio chunk from client: ${
				log.firstAudioChunkFromTTS - log.lastAudioChunkFromClient
			}`
		);
		writeLineToStream("\n\n\nJSON:\n");
		stream.write(JSON.stringify(log));

		stream.end();
	});
};
