import { parse } from "dotenv";
import { getUserById, updateUser } from "../../db/dbUser.mjs";

export const executeLLMFunction = async (text) => {
	// Parse input
	text = text.replace(/\\n/g, "").replace(/\\/g, "").replace(/\t/g, "");
	const parsedText = JSON.parse(text);
	const functionName = parsedText.function;
	const params = parsedText.params;

	// Execute function with given parameters
	try {
		switch (functionName) {
			case "LLMDidNotUnderstand":
				return params.response;
			case "LLMCannotDo":
				return params.response;
			case "LLMUpdateUserName":
				const user = await getUserById(params.userId);
				user.name = params.newName;
				await updateUser(user);
				return `Your name has been sucessfully updated to ${params.newName}!`;
			default:
				throw new Error(`Function ${functionName} not found`);
		}
	} catch (err) {
		console.error(err);
		return `Error in LLM function calling: ${err.message}`;
	}
};
