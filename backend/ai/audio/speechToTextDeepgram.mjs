import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import CONFIG from "../../config.mjs";

const deepgram = createClient(CONFIG.DEEPGRAM_API_KEY);
const model = "nova-2";

export const createDGSocket = async (language = "en", mobile) => {
	let dgConnection;
	if (mobile) {
		dgConnection = deepgram.listen.live({
			// language,
			punctuate: true,
			smart_format: true,
			model,
			encoding: "linear16",
			sample_rate: 16000,
			channels: 1,
			language: "multi",
		});
	} else {
		dgConnection = deepgram.listen.live({
			// language,
			punctuate: true,
			smart_format: true,
			model,
			language: "multi",
		});
	}
	await new Promise((resolve) =>
		dgConnection.on(LiveTranscriptionEvents.Open, resolve)
	);
	return dgConnection;
};
