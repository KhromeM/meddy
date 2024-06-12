import WebSocket, { WebSocketServer } from "ws";
import config from "./config.mjs";

const wss = new WebSocketServer({
	host: config.host,
	port: config.port,
	backlog: 10,
});

wss.on("connection", (ws) => {
	ws.on("error", console.error);
	ws.on("message", (data) => {
		console.log("Received data: %s", data);
	});
	ws.send("This is Mustafa's WebSocket server");
});
