import express from "express";
import cors from "cors";
import { json } from "express";
import { verifyUser } from "./firebase/firebase.mjs";
import { setUser, getUser } from "./firebase/db.mjs";
import { textGemini } from "./ai/gemini.mjs";
export const app = express();
app.use(cors());
app.use(json());

app.use(async (req, res, next) => {
	req.body._user = await verifyUser(req.body.idToken);
	console.log("Req: " + req.body._user.uid);

	if (!req.body._user.uid) {
		res.json({ status: "fail", message: "Invalid User. Please log in." });
		return res.end();
	}
	next();
});

app.post("/chat", async (req, res) => {
	// const user = req.body._user;
	try {
		// const userDB = await getUser(user.user_id);
		const text = req.body.message.text;
		const data = await textGemini(text);
		const content = data.response.text();
		console.log("USER: ", text);
		console.log("LLM: ", content);
		res.json({ status: "success", text: content });
	} catch (err) {
		console.error(err);
		res.json({ status: "fail", message: "Failed to reach Gemini" });
	}
	res.end();
});
