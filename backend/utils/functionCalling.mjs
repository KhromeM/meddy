import { getChatResponse } from "../ai/langAi/chatStream.mjs";
import { openAIModel } from "../ai/langAi/model.mjs";
import { executeLLMFunction } from "../ai/functions/functionController.mjs";
import db from "../db/db.mjs";

export const execUserRequest = async (
	user,
	chatHistory,
	clientSocket,
	reqId,
	audioMode = false
) => {
	const llmResponse = await getChatResponse(
		chatHistory,
		user,
		openAIModel,
		1 // function calling mode
	);
	const response = "\n" + (await executeLLMFunction(llmResponse));

	clientSocket.send(
		JSON.stringify({
			type: "chat_response",
			data: response,
			isComplete: false,
			reqId,
		})
	);
	if (audioMode) {
	}

	return response;
};
