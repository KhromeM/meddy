import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { vertexAIModel, groqModel, anthropicModel, openAIModel } from "./model.mjs";
import CONFIG from "../../config.mjs";
import { createDefaultSystemPrompt } from "../prompts/default.mjs";
import { createStallResponsePrompt } from "../prompts/stallResponse.mjs";

import {
	createFunctionCallingSystemPrompt,
	createSaveAppointmentPrompt,
} from "../prompts/functionCallingPrompt.mjs";
import { sampleData1 } from "../prompts/sampleData.mjs";
import { getUserInfo } from "../../db/dbInfo.mjs";
import fs from "fs";
import path from "path";
import { getContentType } from "../../utils/contentType.mjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let defaultModel = CONFIG.TEST ? openAIModel : openAIModel || anthropicModel || vertexAIModel || openAIModel;

export const chatStreamProvider = async (
	chatHistory,
	user,
	model = defaultModel,
	mode,
	data = sampleData1 // dummy data
) => {
	if (chatHistory[0].source == "llm") chatHistory.shift(); // gemini doesnt like the first message to be from an llm

	const systemMessage = getSystemMessage(user, data, mode);
	// console.log(systemMessage, mode);
	let messages = [
		new SystemMessage(systemMessage),
		...chatHistory.slice(0, -1).map((message) => {
			if (message.source == "user") {
				return new HumanMessage(message.text);
			} else {
				return new AIMessage(message.text);
			}
		}),
		new HumanMessage(processMessage(user, chatHistory[chatHistory.length - 1])),
	];
	messages = cleanMessages(messages);
	// console.log(messages.length);
	// console.log(messages);

	const chain = model.pipe(new StringOutputParser());
	return await chain.stream(messages);
};

export const getChatResponse = async (
	chatHistory,
	user,
	model = defaultModel,
	mode = 0
) => {
	if (chatHistory[0].source == "llm") chatHistory.shift(); // gemini doesnt like the first message to be from an llm

	let data = sampleData1;
	if (mode == 1) {
		data = await getUserInfo(user.userid);
	}

	const chatStream = await chatStreamProvider(chatHistory, user, model, mode, data);
	const resp = [];
	for await (const chunk of chatStream) {
		resp.push(chunk);
	}

	const finalResponse = resp.join("");
	if (mode == 1) {
		const functionCallingResponse = JSON.parse(finalResponse);
		await executeLLMFunction(functionCallingResponse);
		return functionCallingResponse.params.response;
	}

	return finalResponse;
};

export const jsonChatResponse = async (
	chatHistory,
	user,
	model = defaultModel,
	mode,
	data = sampleData1
) => {
	if (chatHistory[0].source == "llm") chatHistory.shift(); // gemini doesnt like the first message to be from an llm

	if (mode == 1) {
		data = await getUserInfo(user.userid);
	}
	const systemMessage = getSystemMessage(user, data, mode);
	let messages = [
		new SystemMessage(systemMessage),
		...chatHistory.map((message) => {
			if (message.source == "user") {
				return new HumanMessage(message.text);
			} else {
				return new AIMessage(message.text);
			}
		}),
	];
	messages = cleanMessages(messages);
	// console.log(messages.map((m) => m.constructor.name));
	return await model.invoke(messages);
};

// Makes sure the same source is not sending a message twice in a row
// Doing that causes an error with most llm providers
function cleanMessages(messages) {
	let prev = messages[0].constructor;
	const clean = [messages[0]];
	for (const message of messages) {
		if (message instanceof prev) {
			clean.pop();
		}
		prev = message.constructor;
		clean.push(message);
	}
	return clean;
}

function processMessage(user, message) {
	const content = [];

	if (message.text) {
		content.push({ type: "text", text: message.text });
	}

	if (message.image) {
		try {
			const imagePath = path.resolve(__dirname, `../../uploads/${user.userid}/${message.image}`);

			const img = fs.readFileSync(imagePath);
			const type = getContentType(message.image);
			const base64Img = img.toString("base64");
			content.push({
				type: "image_url",
				image_url: { url: `data:${type};base64,${base64Img}` },
			});
		} catch (error) {
			console.error(`Error processing image: ${message.image}`, error);
			content.push({
				type: "text",
				text: "Error: Unable to process attached image.",
			});
		}
	}

	return { content };
}

function getSystemMessage(user, data, mode = 0) {
	switch (mode) {
		case 0:
			return createDefaultSystemPrompt(user.name);
		case 1:
			return createFunctionCallingSystemPrompt(data);
		case 2:
			return createStallResponsePrompt();
		case 3:
			return createSaveAppointmentPrompt();
		case 5:
			return "You are a top tier researcher. Do your best work. This is an extremly important research task. Finding the truth is of paramount importance, a person's life may be on the line.";
		default:
			return "";
	}
}
