import { v4 as uuidv4 } from "uuid";
let isProd = import.meta.env.PROD;
const serverURL = isProd
	? "https://www.trymeddy.com/api"
	: "http://localhost:8000/api";

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
		console.log("Got chunk");
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

const wsURL = isProd
	? "wss://www.trymeddy.com/api/"
	: "ws://localhost:8000/api";
let socket = null;
let socketAuthState = false;

export const openWebSocket = async (user) => {
	if (socket && socket.readyState === WebSocket.OPEN) {
		// already open socket
		socket.close();
		socketAuthState = false;
	}
	if (!user) return;

	socket = new WebSocket(wsURL);
	socket.onopen = async () => {
		const idToken = await user.getIdToken(false);
		socket.send(
			JSON.stringify({
				type: "auth",
				data: { idToken },
			})
		);
	};

	return await new Promise((resolve) => {
		socket.onmessage = (event) => {
			const response = JSON.parse(event.data);
			if (response.type === "auth") {
				socketAuthState = true;
				resolve(true);
			}
		};
		socket.onerror = (error) => {
			console.error("WebSocket error:", error);
			resolve(false);
		};

		socket.onclose = () => {
			resolve(false);
			socket.close();
		};
	});
};

export const chatLLMStreamWS = async (message, onChunk, onComplete) => {
	if (!socket || socket.readyState !== WebSocket.OPEN || !socketAuthState) {
		console.error("WebSocket is not open or not authenticated");
		onComplete("WebSocket is not ready. Please try again.");
		return;
	}
	const requestId = uuidv4(); // helped the server track different ws message streams
	console.log("MESSAGE", message);
	socket.send(
		JSON.stringify({
			type: "chat",
			data: {
				text: message.text,
				requestId,
			},
		})
	);

	socket.onmessage = (event) => {
		const response = JSON.parse(event.data);

		if (response.type === "chat_response") {
			onChunk(response.data);
		} else if (response.type === "chat_end") {
			onComplete();
		}
	};

	socket.onerror = (error) => {
		console.error("WebSocket error:", error);
		onComplete("Websocket Error");
	};
};
