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

// Middleware for user verification
// app.use(async (req, res, next) => {
// 	try {
// 		req.body._user = await verifyUser(req.body.idToken);
// 		console.log("Req: " + req.body._user.uid);

// 		if (!req.body._user.uid) {
// 			res.json({ status: "fail", message: "Invalid User. Please log in." });
// 			return res.end();
// 		}
// 		next();
// 	} catch (err) {
// 		res.json({ status: "fail", message: "Authentication failed" });
// 		res.end();
// 	}
// });

app.get("/api/chat", async (req, res) => {
	try {
		const user = await db.getUserById(req.body.idToken);
		const messages = await db.getRecentMessagesByUserId(user.userid, 100);
		res.json({ status: "success", messages });
	} catch (err) {
		console.error(err);
		res.json({ status: "fail", message: "Something went wrong" });
	}
	res.end();
});

app.post("/api/chat", async (req, res) => {
	try {
		const text = req.body.message.text;
		const content = await textGemini(text);
		console.log("USER: ", text);
		console.log("LLM: ", content);
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
