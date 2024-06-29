import {
	HumanMessage,
	SystemMessage,
	AIMessage,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

const messages = [
	new SystemMessage("Translate the following from English into Italian"),
	new HumanMessage(
		"All Runnable objects implement a method called stream. These methods are designed to stream the final output in chunks, yielding each chunk as soon as it is available. Streaming is only possible if all steps in the program know how to process an input stream; i.e., process an input chunk one at a time, and yield a corresponding output chunk. The complexity of this processing can vary, from straightforward tasks like emitting tokens produced by an LLM, to more challenging ones like streaming parts of JSON results before the entire JSON is complete. The best place to start exploring streaming is with the single most important components in LLM apps – the models themselves!"
	),
];

const systemPrompts = {}; // globals or imports
const fewShotExamples = {}; // globals or imports
export const chatStreamProvider = (model, chatHistory, mode) => {
	const systemMessage = systemPrompts[mode];
	const fewShotExamplesForMode = fewShotExamples[mode];
	const messages = [
		new SystemMessage(systemMessage),
		...fewShotExamplesForMode,
		...chatHistory.map((message) => {
			if (message.source == "user") {
				return new HumanMessage(message.text);
			} else {
				return new AIMessage(message.text);
			}
		}),
	];
	const chain = model.pipe(new StringOutputParser());
	return chain.stream(messages);
};
