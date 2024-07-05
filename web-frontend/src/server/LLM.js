const isProd = import.meta.env.PROD;
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

// In src/server/LLM.js

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
