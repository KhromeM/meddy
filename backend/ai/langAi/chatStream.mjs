import {
	HumanMessage,
	SystemMessage,
	AIMessage,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { vertexAIModel, groqModel } from "./model.mjs";

const defaultModel = groqModel || vertexAIModel;
const systemPrompts = {}; // globals or imports
const fewShotExamples = {}; // globals or imports

export const chatStreamProvider = async (
	chatHistory,
	model = defaultModel,
	mode = 0
) => {
	const systemMessage =
		systemPrompts[mode] || "You are an helpful AI assistant.";
	const fewShotExamplesForMode = fewShotExamples[mode] || [];
	let messages = [
		new SystemMessage(systemMessage),
		...fewShotExamplesForMode, // end examples with a system message
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
	model = defaultModel,
	mode = 0
) => {
	const chatStream = await chatStreamProvider(chatHistory, model, mode);
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

// import {
// 	openAIModel,
// 	anthropicModel,
// 	groqModel,
// } from "./model.mjs";

// const chatHistory = [
// 	{ source: "user", text: "Hello I am za" },
// 	{ source: "llm", text: "Hello Za!" },
// 	{
// 		source: "user",
// 		text: `Whats my name? And summarize this: \n "All Runnable objects implement a method called stream. These methods are designed to stream the final output in chunks, yielding each chunk as soon as it is available. Streaming is only possible if all steps in the program know how to process an input stream; i.e., process an input chunk one at a time, and yield a corresponding output chunk. The complexity of this processing can vary, from straightforward tasks like emitting tokens produced by an LLM, to more challenging ones like streaming parts of JSON results before the entire JSON is complete. The best place to start exploring streaming is with the single most important components in LLM apps – the models themselves!`,
// 	},
// ];
// getChatResponse(chatHistory, vertexAIModel).then((resp) => console.log(resp));
