import fs from "fs";
import CONFIG from "../../config.mjs";
import { VertexAI } from "@google-cloud/vertexai";
import { getUserInfo } from "../../db/dbInfo.mjs";
import { createFunctionCallingSystemPrompt } from "../prompts/functionCallingPrompt.mjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAICacheManager } from "@google/generative-ai/server";

// Set up Vertex
const googleAuthCreds = JSON.parse(
	fs.readFileSync(CONFIG.GOOGLE_APPLICATION_CREDENTIALS)
);
const project = googleAuthCreds.project_id;
const location = "us-central1";
const textModel = "gemini-1.5-pro-001";
const vertexAI = new VertexAI({ project: project, location: location });
let cachedModel;

// Set up response schema
const responseSchema = {
	type: "object",
	properties: {
		thoughts: {
			type: "string",
			description:
				"The AI's analysis and reasoning about the user's request or the current situation.",
		},
		function: {
			type: "string",
			description:
				"The name of the function to be called based on the user's request or the AI's analysis.",
		},
		params: {
			type: "object",
			properties: {
				response: {
					type: "string",
					description:
						"A user-friendly message explaining what action was taken or information was provided. Required for all functions.",
				},
				userId: {
					type: "string",
					description:
						"The unique identifier for the user. Required for most functions related to user data or actions.",
				},
				patientId: {
					type: "string",
					description:
						"The unique identifier for the patient. Used in functions related to patient-specific actions like scheduling appointments. Retrieve this from users.patientid",
				},
				newName: {
					type: "string",
					description:
						"The updated name for the user. Used in LLMUpdateUserName function.",
				},
				newPhoneNumber: {
					type: "string",
					description:
						"The updated phone number for the user. Used in LLMUpdateUserPhone function.",
				},
				newAddress: {
					type: "string",
					description:
						"The updated address for the user. Used in LLMUpdateUserAddress function.",
				},
				newEmail: {
					type: "string",
					description:
						"The updated email address for the user. Used in LLMUpdateUserEmail function.",
				},
				language: {
					type: "string",
					description:
						"The preferred language for the user. Used in LLMUpdateUserLanguagePreference function.",
				},
				medicationName: {
					type: "string",
					description:
						"The name of a medication. Used in LLMAddMedication and LLMSetMedicationReminder functions.",
				},
				medicationId: {
					type: "string",
					description:
						"The unique identifier for a medication. Used in LLMDeleteMedication function.",
				},
				hoursUntilRepeat: {
					type: "number",
					description:
						"The number of hours between medication reminders. Used in LLMSetMedicationReminder function.",
				},
				time: {
					type: "string",
					description:
						"The time for a medication reminder. Used in LLMSetMedicationReminder function.",
				},
				reminderId: {
					type: "string",
					description:
						"The unique identifier for a medication reminder. Used in LLMDeleteMedicationReminder function.",
				},
				description: {
					type: "string",
					description:
						"A description of an appointment. Used in LLMScheduleAppointment and LLMRescheduleAppointment functions.",
				},
				appointmentId: {
					type: "string",
					description:
						"The unique identifier for an appointment. Used in LLMCancelAppointment, LLMRescheduleAppointment, and LLMGenerateSummaryForAppointment functions.",
				},
				appointmentStartTime: {
					type: "string",
					description:
						"The start time for an appointment. Used in LLMScheduleAppointment and LLMRescheduleAppointment functions.",
				},
				appointmentEndTime: {
					type: "string",
					description:
						"The end time for an appointment. Used in LLMScheduleAppointment and LLMRescheduleAppointment functions.",
				},
				startDate: {
					type: "string",
					description:
						"The start date for generating a report. Used in LLMGenerateReportForDoc and LLMGenerateReportForPatient functions.",
				},
				endDate: {
					type: "string",
					description:
						"The end date for generating a report. Used in LLMGenerateReportForDoc and LLMGenerateReportForPatient functions.",
				},
				information: {
					type: "string",
					description:
						"General information to be displayed. Used in LLMDisplayInformation function.",
				},
			},
			required: [
				"response",
				"userId",
				"patientId",
				"newName",
				"newPhoneNumber",
				"newAddress",
				"newEmail",
				"language",
				"medicationName",
				"medicationId",
				"hoursUntilRepeat",
				"time",
				"reminderId",
				"description",
				"appointmentId",
				"appointmentStartTime",
				"appointmentEndTime",
				"startDate",
				"endDate",
				"information",
			],
		},
	},
	required: ["thoughts", "function", "params"],
};

export const getModel = (schema = responseSchema) => {
	return vertexAI.getGenerativeModel({
		model: textModel,
		safetySettings: [
			{
				category: "HARM_CATEGORY_HARASSMENT",
				threshold: "BLOCK_ONLY_HIGH",
			},
			{
				category: "HARM_CATEGORY_HATE_SPEECH",
				threshold: "BLOCK_ONLY_HIGH",
			},
			{
				category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
				threshold: "BLOCK_ONLY_HIGH",
			},
			{
				category: "HARM_CATEGORY_DANGEROUS_CONTENT",
				threshold: "BLOCK_ONLY_HIGH",
			},
		],
		generationConfig: {
			maxOutputTokens: 8192,
			responseMimeType: "application/json",
			responseSchema: schema,
		},
	});
};

export async function getStructuredVertexResponse(
	user,
	chatHistory,
	schema = responseSchema
) {
	// Set up prompt and chat history
	if (chatHistory[0].source != "user") {
		chatHistory.shift();
	}
	const data = await getUserInfo(user.userid);
	const prompt = createFunctionCallingSystemPrompt(data);
	const cleanedHistory = chatHistory.map((message) => ({
		role: message.source === "llm" ? "model" : "user",
		parts: [{ text: message.text }],
	}));
	console.log(cleanedHistory);

	// Make the request
	const request = {
		contents: cleanedHistory,
		systemInstruction: {
			parts: [{ text: prompt }],
		},
	};
	const generativeModel = getModel(schema);
	const result = await generativeModel.generateContent(request);
	const response = JSON.parse(
		result.response.candidates[0].content.parts[0].text
	);
	return response;
}

export const getModelWithCaching = async (sysPrompt) => {
	if (!cachedModel) {
		const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
		const cacheManager = new GoogleAICacheManager(CONFIG.GEMINI_API_KEY);
		const cache = await cacheManager.create({
			model: textModel,
			systemInstruction: sysPrompt,
			contents: [],
			ttlSeconds: 300,
		});
		cachedModel = genAI.getGenerativeModelFromCachedContent(cache);
	}

	return cachedModel;
};
