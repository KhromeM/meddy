import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import CONFIG from "../../config.mjs";

const deepgram = createClient(CONFIG.DEEPGRAM_API_KEY);

export const createDGSocket = async (language = "en-US", model = "nova-2") => {
	const dgConnection = deepgram.listen.live({
		language,
		punctuate: true,
		smart_format: true,
		model,
	});
	await new Promise((resolve) =>
		dgConnection.on(LiveTranscriptionEvents.Open, resolve)
	);
	return dgConnection;
};
