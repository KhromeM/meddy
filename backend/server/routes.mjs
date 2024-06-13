import express, { json } from "express";
import cors from "cors";
import { verifyUser } from "../firebase/firebase.mjs";
import { setUser, getUser } from "../firebase/db.mjs";
import { textGemini } from "../ai/gemini.mjs";
import { createServer } from "http";
import { WebSocketServer } from "ws";

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

// HTTP endpoint for chat
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

// Create HTTP server
export const server = createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", async (ws, req) => {
	// Extract token from query parameters
	const urlParams = new URLSearchParams(req.url.replace(/^.*\?/, ""));
	const idToken = urlParams.get("idToken");

	// Verify user
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

		// Handle incoming messages
		ws.on("message", async (message) => {
			try {
				const text = JSON.parse(message).text;
				// log user text in db
				const content = await textGemini(text);
				// log llm reply in db
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
