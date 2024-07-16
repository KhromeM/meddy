export const executeLLMFunction = async (text) => {
	// Parse input
	text = text.replace(/\\n/g, "").replace(/\\/g, "").replace(/\t/g, "");
	let parsedText = JSON.parse(text);
	let functionName = parsedText.function;
	let params = parsedText.params;

	// Call function with parameters
	try {
		if (functionName === "LLMDidNotUnderstand" || functionName === "LLMCannotDo") {
			return params.response;
		} else {
			throw new Error(`Function ${functionName} not found`);
		}
	} catch (err) {
		console.error(err);
		return `Error processing LLM output: ${err.message}`;
	}
};
