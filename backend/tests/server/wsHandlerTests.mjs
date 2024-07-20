import { expect } from "chai";
import WebSocket from "ws";
import { server } from "../../server.mjs";
import { pool } from "../../db/dbConfig.mjs";
import CONFIG from "../../config.mjs";

describe("WebSocket Handlers Tests", function () {
	this.timeout(10000);

	let ws;
	const port = CONFIG.port;

	before((done) => {
		if (!server.listening) {
			server.listen(port, () => {
				done();
			});
		} else {
			done();
		}
	});

	after((done) => {
		server.close(done);
	});

	beforeEach(async () => {
		await pool.query("DELETE FROM Messages");
	});

	afterEach((done) => {
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.close();
		}
		done();
	});

	const authenticateWebSocket = (ws) => {
		return new Promise((resolve, reject) => {
			ws.on("open", () => {
				ws.send(
					JSON.stringify({
						type: "auth",
						data: { idToken: "dev" },
					})
				);
			});
			ws.on("message", (data) => {
				const message = JSON.parse(data);
				if (message.type === "auth") {
					resolve();
				}
			});
			ws.on("error", reject);
			ws.on("close", reject);
		});
	};

	it("should establish and maintain a WebSocket connection", async () => {
		ws = new WebSocket(`ws://localhost:${port}/ws`);
		await authenticateWebSocket(ws);
		expect(ws.readyState).to.equal(WebSocket.OPEN);
	});

	it("should handle chat messages and respond with chat_response", async () => {
		ws = new WebSocket(`ws://localhost:${port}/ws`);
		await authenticateWebSocket(ws);

		const message = {
			type: "chat",
			data: {
				text: "whats 2+1?",
			},
		};
		ws.send(JSON.stringify(message));
		let receivedChunks = [];
		await new Promise((resolve, reject) => {
			ws.on("message", (data) => {
				const message = JSON.parse(data);
				if (message.type === "chat_response") {
					receivedChunks.push(message.data);
				}
				if (message.isComplete) {
					expect(receivedChunks).to.be.an("array").that.is.not.empty;
					resolve();
				}
			});
			ws.on("error", reject);
		});
	});

	it("should handle chats with images", async () => {
		ws = new WebSocket(`ws://localhost:${port}/ws`);
		await authenticateWebSocket(ws);

		const message = {
			type: "chat",
			data: {
				text: "whats in the image?",
				image: "cookies.jpeg",
			},
		};
		ws.send(JSON.stringify(message));
		let receivedChunks = [];
		await new Promise((resolve, reject) => {
			ws.on("message", (data) => {
				const message = JSON.parse(data);
				if (message.type === "chat_response") {
					receivedChunks.push(message.data);
				}
				if (message.isComplete) {
					expect(receivedChunks).to.be.an("array").that.is.not.empty;
					expect(receivedChunks.join("")).to.include("cookie");
					// console.log(receivedChunks.join(""));
					resolve();
				}
			});
			ws.on("error", reject);
		});
	});

	it("should send an error for unknown message types", async () => {
		ws = new WebSocket(`ws://localhost:${port}/ws`);
		await authenticateWebSocket(ws);

		const message = {
			type: "unknown",
			data: {},
		};
		ws.send(JSON.stringify(message));

		await new Promise((resolve, reject) => {
			ws.on("message", (data) => {
				const message = JSON.parse(data);
				expect(message.type).to.equal("error");
				expect(message.data).to.equal("Unknown message type");
				resolve();
			});
			ws.on("error", reject);
		});
	});

	it("should send an error for invalid message format", async () => {
		ws = new WebSocket(`ws://localhost:${port}/ws`);
		await authenticateWebSocket(ws);

		ws.send("invalid message format");

		await new Promise((resolve, reject) => {
			ws.on("message", (data) => {
				const message = JSON.parse(data);
				expect(message.type).to.equal("error");
				expect(message.data).to.include("Unexpected token");
				resolve();
			});
			ws.on("error", reject);
		});
	});

	it("should save chat messages to the database", async () => {
		ws = new WebSocket(`ws://localhost:${port}/ws`);
		await authenticateWebSocket(ws);

		const message = {
			type: "chat",
			data: { text: "Store this message" },
		};
		ws.send(JSON.stringify(message));

		await new Promise((resolve, reject) => {
			ws.on("message", async (data) => {
				const message = JSON.parse(data);
				if (message.isComplete) {
					try {
						const result = await pool.query(
							"SELECT * FROM Messages ORDER BY Time ASC"
						);
						expect(result.rows.length).to.equal(2);
						expect(result.rows[0].text).to.equal("Store this message");
						expect(result.rows[0].source).to.equal("user");
						expect(result.rows[1].source).to.equal("llm");
						resolve();
					} catch (error) {
						reject(error);
					}
				}
			});
			ws.on("error", reject);
		});
	});
});
