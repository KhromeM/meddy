import { jsonChatResponse } from "../ai/langAi/chatStream.mjs";
import { vertexAIModel, openAIModel, anthropicModel } from "../ai/langAi/model.mjs";
import { executeLLMFunction } from "../ai/functions/functionController.mjs";
import { getStructuredVertexResponse } from "../ai/langAi/setupVertexAI.mjs";
import { z } from "zod";

const defaultModel = vertexAIModel;

export const execUserRequest = async (user, chatHistory, clientSocket, reqId, audioMode = false) => {
	let llmResponse = "";
	if (defaultModel == openAIModel) {
		const structure = z.object({
			thoughts: z.string().describe("Your thoughts on the user's request."),
			function: z.string().describe("The function to call."),
			params: z.object({
				response: z
					.string()
					.describe(
						"A string that will be displayed to the user, telling them about what was done."
					),
				userId: z.string().optional(),
				newName: z.string().optional(),
				newPhoneNumber: z.string().optional(),
				newAddress: z.string().optional(),
				newEmail: z.string().optional(),
				language: z.string().optional(),
				medicationName: z.string().optional(),
				medicationId: z.string().optional(),
				hoursUntilRepeat: z.number().optional(),
				time: z.string().optional(),
				reminderId: z.string().optional(),
				description: z.string().optional(),
				appointmentId: z.string().optional(),
				dateTime: z.string().optional(),
				newDateTime: z.string().optional(),
				startDate: z.string().optional(),
				endDate: z.string().optional(),
				information: z.string().optional(),
			}),
		});
		const structuredModel = defaultModel.withStructuredOutput(structure);
		llmResponse = await jsonChatResponse(
			chatHistory,
			user,
			structuredModel,
			1 // function calling mode
		);
	} else if (defaultModel == vertexAIModel) {
		llmResponse = await getStructuredVertexResponse(user, chatHistory);
	}

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
