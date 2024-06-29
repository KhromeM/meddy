import {
	HumanMessage,
	SystemMessage,
	AIMessage,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

const systemPrompts = {}; // globals or imports
const fewShotExamples = {}; // globals or imports
export const chatStreamProvider = async (model, chatHistory, mode) => {
	const systemMessage =
		systemPrompts[mode] || "You are an helpful AI assistant.";
	const fewShotExamplesForMode = fewShotExamples[mode] || [];
	const messages = [
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
	const chain = model.pipe(new StringOutputParser());
	return await chain.stream(messages);
};

export const getChatResponse = async (model, chatHistory, mode = 0) => {
	const chatStream = await chatStreamProvider(model, chatHistory, mode);
	const resp = [];
	for await (const chunk of chatStream) {
		resp.push(chunk);
	}
	const totResp = resp.join("");
	return totResp;
};

// import {
// 	openAIModel,
// 	anthropicModel,
// 	vertexAIModel,
// 	groqModel,
// } from "./model.mjs";
// const messages = [
// 	new SystemMessage("Translate the following from English into Italian"),
// 	new HumanMessage(
// 		"All Runnable objects implement a method called stream. These methods are designed to stream the final output in chunks, yielding each chunk as soon as it is available. Streaming is only possible if all steps in the program know how to process an input stream; i.e., process an input chunk one at a time, and yield a corresponding output chunk. The complexity of this processing can vary, from straightforward tasks like emitting tokens produced by an LLM, to more challenging ones like streaming parts of JSON results before the entire JSON is complete. The best place to start exploring streaming is with the single most important components in LLM apps – the models themselves!"
// 	),
// ];

// const chatHistory = [
// 	{ source: "user", text: "Hello I am za" },
// 	{ source: "llm", text: "Hello Za!" },
// 	{
// 		source: "user",
// 		text: `Whats my name? And summarize this: \n "All Runnable objects implement a method called stream. These methods are designed to stream the final output in chunks, yielding each chunk as soon as it is available. Streaming is only possible if all steps in the program know how to process an input stream; i.e., process an input chunk one at a time, and yield a corresponding output chunk. The complexity of this processing can vary, from straightforward tasks like emitting tokens produced by an LLM, to more challenging ones like streaming parts of JSON results before the entire JSON is complete. The best place to start exploring streaming is with the single most important components in LLM apps – the models themselves!`,
// 	},
// ];
// getChatResponse(vertexAIModel, chatHistory).then((resp) => console.log(resp));
