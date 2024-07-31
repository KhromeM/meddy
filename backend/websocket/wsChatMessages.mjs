import db from "../db/db.mjs";
import { chatStreamProvider } from "../ai/langAi/chatStream.mjs";
import { execUserRequest } from "../utils/functionCalling.mjs";

export async function handleChatMessage(state, data) {
	const { clientSocket, user } = state;
	const { text, image, reqId } = data;
	if (!text) {
		clientSocket.send(
			JSON.stringify({ type: "error", data: "Text message is required" })
		);
		return;
	}
	try {
		const chatHistory = await db.getRecentMessagesByUserId(user.userid, 100);
		chatHistory.push({ source: "user", text, image });
		const stream = await chatStreamProvider(chatHistory, user);

		let llmResponseChunks = [];

		for await (const chunk of stream) {
			llmResponseChunks.push(chunk);
			clientSocket.send(
				JSON.stringify({
					type: "chat_response",
					data: chunk,
					isComplete: false,
					reqId,
				})
			);
		}

		const llmResponse = llmResponseChunks.join("");

		let functionCallResponse = "\n";
		// function calling trigger
		if (llmResponse == "Processing...") {
			functionCallResponse = await execUserRequest(
				user,
				chatHistory.slice(-6),
				clientSocket,
				reqId
			);
		}

		await db.createMessage(user.userid, "user", text, image);
		await db.createMessage(
			user.userid,
			"llm",
			llmResponse + functionCallResponse
		);

		clientSocket.send(
			JSON.stringify({
				type: "chat_response",
				data: "",
				isComplete: true,
				reqId,
			})
		);
	} catch (error) {
		console.error("Error in chat stream:", error.message);
		clientSocket.send(
			JSON.stringify({ type: "error", data: "Error processing chat message" })
		);
	}
}
