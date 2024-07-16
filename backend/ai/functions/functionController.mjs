import { parse } from "dotenv";
import { getUserById, updateUser } from "../../db/dbUser.mjs";

export const executeLLMFunction = async (text) => {
	// Parse input
	text = text.replace(/\\n/g, "").replace(/\\/g, "").replace(/\t/g, "");
	console.log(text);
	const parsedText = JSON.parse(text);
	const functionName = parsedText.function;
	const params = parsedText.params;

	// Execute function with given parameters
	try {
		let user;
		switch (functionName) {
			case "LLMDidNotUnderstand":
				return params.response;
			case "LLMCannotDo":
				return params.response;
			case "LLMUpdateUserName":
				user = await getUserById(params.userId);
				user.name = params.newName;
				await updateUser(user);
				return `Your name has been sucessfully updated to ${params.newName}!`;
			case "LLMUpdateUserPhone":
				user = await getUserById(params.userId);
				user.phone = params.newPhoneNumber;
				await updateUser(user);
				return `Your phone number has been sucessfully updated to ${params.newPhoneNumber}!`;
			case "LLMUpdateUserAddress":
				user = await getUserById(params.userId);
				user.address = params.newAddress;
				await updateUser(user);
				return `Your address has been sucessfully updated to ${params.newAddress}!`;
			case "LLMUpdateUserEmail":
				user = await getUserById(params.userId);
				user.email = params.newEmail;
				await updateUser(user);
				return `Your email has been sucessfully updated to ${params.newEmail}!`;
			case "LLMUpdateUserLanguagePreference":
				user = await getUserById(params.userId);
				user.language = params.language;
				await updateUser(user);
				return `Your language preference has been sucessfully updated to ${params.language}!`;
			default:
				throw new Error(`Function ${functionName} not found`);
		}
	} catch (err) {
		console.error(err);
		return `Error in LLM function calling: ${err.message}`;
	}
};
