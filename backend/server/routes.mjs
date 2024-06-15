import express, { json } from "express";
import cors from "cors";
import { verifyUser } from "../firebase/firebase.mjs";
import { setUser, getUser } from "../firebase/db.mjs";
import { textGemini } from "../ai/gemini.mjs";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const db = require("../db/db.js");

const app = express();
app.use(cors());
app.use(json());

// Verifies the request. Adds the firebase user info to the request.
app.use(async (req, res, next) => {
	try {
		req._fbUser = await verifyUser(req.body.idToken);
		console.log("USER: ", req._fbUser);

		if (!req._fbUser) {
			res.json({ status: "fail", message: "Invalid User. Please log in." });
			return res.end();
		}
		next();
	} catch (err) {
		res.json({ status: "fail", message: "Authentication failed" });
		res.end();
	}
});

// Get user data from db or create user in db if they dont exist. Then add it to the request.
app.use(async (req, res, next) => {
	try {
		let dbUser = await db.getUserById(req._fbUser.user_id);
		if (!user) {
			dbUser = await db.createUser(req._fbUser.user_id, req._fbUser.name);
			console.log("Created user in db:", dbUser);
		}
		console.log("not created: ", dbUser);
		req._dbUser = dbUser;
		next();
	} catch (err) {
		res.json({ status: "fail", message: "Something went wrong. Checkpoint 2" });
		res.end();
	}
});

app.get("/api/chat", async (req, res) => {
	try {
		const messages = await db.getRecentMessagesByUserId(
			req._dbUser.userid,
			100
		);
		res.json({ status: "success", messages });
	} catch (err) {
		console.error(err);
		res.json({ status: "fail", message: "Something went wrong. Checkpoint 3" });
	}
	res.end();
});

app.post("/api/chat", async (req, res) => {
	try {
		const text = req.body.message.text;
		const content = await textGemini(text);
		console.log("USER: ", text);
		console.log("LLM: ", content);
		db.createMessage(req._dbUser.userid, "user", text);
		db.createMessage(req._dbUser.userid, "llm", content);
		res.json({ status: "success", text: content });
	} catch (err) {
		console.error(err);
		res.json({ status: "fail", message: "Failed to reach Gemini" });
	}
	res.end();
});

export const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", async (ws, req) => {
	const urlParams = new URLSearchParams(req.url.replace(/^.*\?/, ""));
	const idToken = urlParams.get("idToken");

	try {
		const user = await verifyUser(idToken);
		console.log("WS User: " + user.uid);

		if (!user.uid) {
			ws.send(
				JSON.stringify({
					status: "fail",
					message: "Invalid User. Please log in.",
				})
			);
			ws.close();
			return;
		}

		ws.on("message", async (message) => {
			try {
				const text = JSON.parse(message).text;
				const content = await textGemini(text);
				console.log("USER: ", text);
				console.log("LLM: ", content);
				ws.send(JSON.stringify({ status: "success", text: content }));
			} catch (err) {
				console.error(err);
				ws.send(
					JSON.stringify({ status: "fail", message: "Failed to reach Gemini" })
				);
			}
		});
	} catch (err) {
		ws.send(
			JSON.stringify({ status: "fail", message: "Authentication failed" })
		);
		ws.close();
	}
});
