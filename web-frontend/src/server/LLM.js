import { v4 as uuidv4 } from "uuid";
let isProd = import.meta.env.PROD;
// isProd = false;

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
				data: { idToken, source: "web" },
			})
		);
	};
	console.log("sent auth request");

	return await new Promise((resolve) => {
		socket.onmessage = (event) => {
			const response = JSON.parse(event.data);
			console.log(response);
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
	console.log(message);
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
		console.log(response);
		if (response.type === "chat_response") {
			onChunk(response.data);
		}
		if (response.isComplete) {
			onComplete();
		}
	};

	socket.onerror = (error) => {
		console.error("WebSocket error:", error);
		onComplete("Websocket Error");
	};
};
