const isDev = import.meta.env.MODE;
import { v4 as uuidv4 } from "uuid";

const serverURL = isDev
	? "http://localhost:8000/api"
	: "https://www.trymeddy.com/api";

export const chatLLM = async (user, message) => {
	const idToken = await user.getIdToken(false);
	const body = JSON.stringify({ idToken, message });
	const path = serverURL + "/chat";
	console.log(path, body);
	const res = await fetch(path, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: body,
	});
	const response = await res.json();
	console.log(response);
	return response.text || "";
};

export const chatLLMStream = async (user, message, onChunk, onComplete) => {
	const idToken = await user.getIdToken(false);
	const response = await fetch(`${serverURL}/chat/stream`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ idToken, message }),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();

	while (true) {
		const { value, done } = await reader.read();
		if (done) break;

		const chunk = decoder.decode(value);
		const lines = chunk.split("\n\n");

		for (const line of lines) {
			if (line.startsWith("data: ")) {
				const data = line.slice(6);
				if (data === "[DONE]") {
					onComplete();
					return;
				}
				try {
					const parsed = JSON.parse(data);
					onChunk(parsed.text);
				} catch (e) {
					console.error("Error parsing SSE data", e);
				}
			}
		}
	}
};

export const chatLLMStreamWS = async (user, message, onChunk, onComplete) => {
	const serverURL = isDev
		? "ws://localhost:8000/api"
		: "ws://www.trymeddy.com/api";

	const socket = new WebSocket(serverURL);
	const requestId = uuidv4();

	socket.onopen = async () => {
		await new Promise((resolve) => setTimeout(resolve, 100)); // the server needs a bit of time to do auth even after sending "open"
		const idToken = await user.getIdToken(false);
		socket.send(
			JSON.stringify({
				type: "chat",
				idToken,
				data: {
					text: message.text,
					requestId,
				},
			})
		);
	};

	socket.onmessage = (event) => {
		const response = JSON.parse(event.data);

		if (response.type === "chat_response") {
			onChunk(response.data);
		} else if (response.type === "chat_end") {
			onComplete();
			socket.close();
		}
	};

	socket.onerror = (error) => {
		console.error("WebSocket error:", error);
		onComplete();
	};

	socket.onclose = () => {
		console.log("WebSocket connection closed");
	};
	return () => {
		if (socket.readyState === WebSocket.OPEN) {
			socket.close();
		}
	};
};
