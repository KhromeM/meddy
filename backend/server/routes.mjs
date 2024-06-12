import express, { json } from "express";
import session from "express-session";
import cors from "cors";
import { verifyUser } from "../firebase/firebase.mjs";
import { setUser, getUser } from "../firebase/db.mjs";
import { textGemini } from "../ai/gemini.mjs";

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
	// switch to using sessions for more speed
	// session({
	// 	store: new FirebaseStore(),
	// 	secret: process.env.SESSION_KEY,
	// 	resave: false,
	// 	saveUninitialized: true,
	// 	cookie: { secure: false, maxAge: 60000 },
	// })(req, res, next);
});

app.post("/chat", async (req, res) => {
	try {
		const text = req.body.message.text;
		// log user text in db
		const content = await textGemini(text);
		// log llm reply in db
		console.log("USER: ", text);
		console.log("LLM: ", content);
		res.json({ status: "success", text: content });
	} catch (err) {
		console.error(err);
		res.json({ status: "fail", message: "Failed to reach Gemini" });
	}
	res.end();
});
