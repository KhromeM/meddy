const isDev = import.meta.env.MODE;
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
