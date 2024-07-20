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
import CONFIG from "../../config.mjs";
import { createDefaultSystemPrompt } from "../prompts/default.mjs";
import { createStallResponsePrompt } from "../prompts/stallResponse.mjs";

import { createFunctionCallingSystemPrompt } from "../prompts/functionCalling.mjs";
import { sampleData1 } from "../prompts/sampleData.mjs";
import { executeLLMFunction } from "../functions/functionController.mjs";
import { getUserInfo } from "../../db/dbInfo.mjs";

let defaultModel = CONFIG.TEST
	? openAIModel
	: openAIModel || anthropicModel || vertexAIModel || openAIModel;

export const chatStreamProvider = async (
	chatHistory,
	user,
	model = defaultModel,
	mode,
	data = sampleData1 // dummy data
) => {
	const systemMessage = getSystemMessage(user, data, mode);
	let messages = [
		new SystemMessage(systemMessage),
		...chatHistory.map((message) => {
			if (message.source == "user") {
				return new HumanMessage(processMessage(user, message));
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
	let data = sampleData1;
	if (mode == 1) {
		data = await getUserInfo(user.userid);
	}

	const chatStream = await chatStreamProvider(
		chatHistory,
		user,
		model,
		mode,
		data
	);
	const resp = [];
	for await (const chunk of chatStream) {
		resp.push(chunk);
	}
	const totResp = resp.join("");

	if (mode == 1) {
		return executeLLMFunction(totResp);
	} else {
		return totResp;
	}
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
// add images using imageid
function processMessage(user, message) {
	const content = [];
	if (message.text) {
		content.push({ type: "text", text: message.text });
	}
	if (message.image) {
		try {
			const base64Image = fs.readFileSync(
				`uploads/${user.userid}/${message.image}`,
				"utf8"
			); // very unfortunate :(
			content.push({
				type: "image_url",
				image_url: { url: `data:image/jpeg;base64,${base64Image}` },
			});
		} catch (error) {
			console.error(`Error reading image file: ${error}`);
		}
	}
	return { content };
}

function getSystemMessage(user, data, mode) {
	switch (mode) {
		case 0:
			return createDefaultSystemPrompt(user.name);
		case 1:
			return createFunctionCallingSystemPrompt(data);
		case 2:
			return createStallResponsePrompt();
		default:
			return "";
	}
}
