import { serverUrl } from "./Info";
let wsURL = serverUrl.ws;
// wsURL = "wss://www.trymeddy.com/api/";
// wsURL = "ws://localhost:8000/api";

class WSConnection {
	constructor() {
		this.url = wsURL;
		this.socket = null;
		this.handlers = {};
		this.isConnected = false;
		this.authenticated = false;
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.socket = new WebSocket(this.url);

			this.socket.onopen = () => {
				console.log("WebSocket connected");
				this.isConnected = true;
				resolve();
			};

			this.socket.onmessage = (event) => {
				const message = JSON.parse(event.data);
				console.log(message.type, message);
				const handler = this.handlers[message.type];
				if (handler) {
					handler(message);
				} else {
					console.warn(`No handler for message type: ${message.type}`);
				}
			};

			this.socket.onerror = (error) => {
				console.error("WebSocket error:", error);
				reject(error);
			};

			this.socket.onclose = () => {
				console.log("WebSocket disconnected");
				this.isConnected = false;
			};
		});
	}

	setHandler(type, handler) {
		this.handlers[type] = handler;
	}

	send(message) {
		if (this.isConnected) {
			this.socket.send(JSON.stringify(message));
		} else {
			console.error("WebSocket is not connected");
		}
	}

	async authenticate(idToken) {
		this.send({
			type: "auth",
			data: { idToken },
		});

		return new Promise((resolve, reject) => {
			this.setHandler("auth", () => {
				this.authenticated = true;
				resolve();
			});
		});
	}

	close() {
		if (this.socket) {
			this.socket.close();
		}
	}
}

export default WSConnection;
