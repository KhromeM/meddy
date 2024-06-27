import { VertexAI } from "@google-cloud/vertexai";

const projectId = "meddyai";
const vertexAI = new VertexAI({
	project: projectId,
	location: "us-central1",
});

const generativeModel = vertexAI.getGenerativeModel({
	model: "gemini-1.5-flash-001",
});

async function gen(textPrompt) {
	const filePart = {
		fileData: {
			fileUri: "gs://generativeai-downloads/images/scones.jpg",
			mimeType: "image/jpeg",
		},
	};

	const textPart = {
		text: textPrompt,
	};

	const request = {
		contents: [{ role: "user", parts: [filePart, textPart] }],
	};
	const resp = await generativeModel.generateContent(request);
	const contentResponse = await resp.response;
	return extractResponse(contentResponse);
}

function extractResponse(response) {
	if (response && response.candidates && response.candidates.length > 0) {
		return response.candidates[0].content.parts[0].text;
	} else {
		throw new Error("Invalid response format");
	}
}

const response = await gen("What is in the image?");
console.log(response);
