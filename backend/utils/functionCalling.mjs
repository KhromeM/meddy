import { jsonChatResponse } from "../ai/langAi/chatStream.mjs";
import { vertexAIModel } from "../ai/langAi/model.mjs";
import { executeLLMFunction } from "../ai/functions/functionController.mjs";
import { getStructuredVertexResponse } from "../ai/langAi/setupVertexAI.mjs";
import { z } from "zod";

const defaultModel = vertexAIModel 

export const execUserRequest = async (
	user,
	chatHistory,
	clientSocket,
	reqId,
	audioMode = false
) => {
	let llmResponse = await getStructuredVertexResponse(user, chatHistory);

	console.log("STRUC RESPONSE: ", llmResponse);
	const result = await executeLLMFunction(llmResponse);

	result.response = "\n" + result.response;

	clientSocket.send(
		JSON.stringify({
			type: "chat_response",
			data: result.response,
			isComplete: false,
			reqId,
			result,
		})
	);
	if (audioMode && result.response.length < 200) {
	}

	return result.response || "";
};
