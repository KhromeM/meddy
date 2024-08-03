import { v4 as uuidv4 } from "uuid";

export const chatLLMStreamWS = async (
	wsConnection,
	message,
	onChunk,
	onComplete
) => {
	console.log(wsConnection);
	if (
		!wsConnection ||
		!wsConnection.isConnected ||
		!wsConnection.authenticated
	) {
		console.error("WebSocket is not open or not authenticated");
		onComplete("WebSocket is not ready. Please try again.");
		return;
	}

	const reqId = uuidv4();
	console.log("Sending message:", message);

	wsConnection.send({
		type: "chat",
		data: {
			text: message.text,
			reqId,
		},
	});

	wsConnection.setHandler("chat_response", (response) => {
		if (response.reqId != reqId) return;
		onChunk(response);
		if (response.isComplete) {
			onComplete();
		}
	});

	wsConnection.setHandler("error", (error) => {
		console.error("WebSocket error:", error);
		onComplete("WebSocket Error");
	});
};
