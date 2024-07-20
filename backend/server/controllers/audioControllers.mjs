import { TTS_SSE } from "../../ai/audio/textToSpeechElevenLab.mjs";
import { createWriteStream } from "fs";

const filePath = "./ai/audio/genAudio/";

export const postAudioStreamSSE = async (req, res) => {
	try {
		const text = req.body.message.text;
		const chatHistory = await db.getRecentMessagesByUserId(
			req._dbUser.userid,
			100
		);
		const fileName = filePath + `audio.mp3`;
		const fileStream = createWriteStream(fileName);

		res.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		});

		chatHistory.push({ source: "user", text, image });

		TTS_SSE(chatHistory, res, fileStream, 1, "ENG");
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ status: "fail", message: "Failed to process audio message" });
	} finally {
		res.end();
		if (fileStream && !fileStream.closed) {
			fileStream.close();
		}
	}
};
