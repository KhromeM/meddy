import {
	HumanMessage,
	SystemMessage,
	AIMessage,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	vertexAIModel,
	groqModel,
	anthropicModel,
	openAIModel,
} from "./model.mjs";
import { Readable } from "stream";
import CONFIG from "../../config.mjs";
import { createDefaultSystemPrompt } from "../prompts/default.mjs";
import { createStallResponsePrompt } from "../prompts/stallResponse.mjs";

let defaultModel = CONFIG.TEST
	? openAIModel
	: openAIModel || anthropicModel || vertexAIModel || openAIModel;

export const chatStreamProvider = async (
	chatHistory,
	user,
	model = defaultModel,
	mode = 0
) => {
	const systemMessage = getSystemMessage(user, mode);
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
	const chain = model.pipe(new StringOutputParser());
	return await chain.stream(messages);
};

export const getChatResponse = async (
	chatHistory,
	user,
	model = defaultModel,
	mode = 0
) => {
	const chatStream = await chatStreamProvider(chatHistory, user, model, mode);
	const resp = [];
	for await (const chunk of chatStream) {
		resp.push(chunk);
	}
	const totResp = resp.join("");
	return totResp;
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

function getSystemMessage(user, mode) {
	switch (mode) {
		case 0:
			return createDefaultSystemPrompt(user.name);
		case 2:
			return createStallResponsePrompt();
		default:
			return "";
	}
}
