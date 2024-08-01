import { z } from "zod";
import { openAIModel } from "../ai/langAi/model.mjs";
import { jsonChatResponse } from "../ai/langAi/chatStream.mjs";
import db from "../db/db.mjs";

const defaultModel = openAIModel;

export const summarizeAppointmentFromChatHistory = async (user) => {
	const chatHistory = await db.getRecentMessagesByUserId(user.userid, 200);
	const structure = z.object({
		thoughts: z
			.string()
			.describe(
				"Your thoughts on the task of transcribing and summarizing the last doctor's appointment in the chat history."
			),
		transcript: z
			.string()
			.describe("The transcript of the doctor appointment."),
		summary: z.string().describe("Summary of the appointment."),
	});
	const structuredModel = defaultModel.withStructuredOutput(structure);
	const llmResponse = await jsonChatResponse(
		chatHistory,
		user,
		structuredModel,
		3 // save appointment mode
	);
	console.log("SAVE APPOINTMENT RESPONSE", llmResponse);
	db.createAppointment(
		new Date(),
		llmResponse.transcript,
		llmResponse.summary,
		"",
		user.userid,
		null
	);
	return llmResponse.summary;
};
