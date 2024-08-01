import { jsonChatResponse } from "../ai/langAi/chatStream.mjs";
import { openAIModel } from "../ai/langAi/model.mjs";
import { executeLLMFunction } from "../ai/functions/functionController.mjs";
import db from "../db/db.mjs";
import { z } from "zod";

const defaultModel = openAIModel;

export const execUserRequest = async (
	user,
	chatHistory,
	clientSocket,
	reqId,
	audioMode = false
) => {
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
			doctorId: z.string().optional(),
			newDateTime: z.string().optional(),
			startDate: z.string().optional(),
			endDate: z.string().optional(),
		}),
	});
	const structuredModel = defaultModel.withStructuredOutput(structure);
	const llmResponse = await jsonChatResponse(
		chatHistory,
		user,
		structuredModel,
		1 // function calling mode
	);
	console.log("STRUC RESPONSE: ", llmResponse);
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

	return response || "";
};
