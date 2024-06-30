// backend/tests/server/wsEndpointTests.mjs
import { expect } from "chai";
import WebSocket from "ws";
import { server } from "../../server.mjs";
import { pool } from "../../db/dbConfig.mjs";

describe("WebSocket Chat Tests", () => {
	let ws;

	before((done) => {
		server.listen(0, () => {
			const port = server.address().port;
			ws = new WebSocket(`ws://localhost:${port}`);
			ws.on("open", done);
		});
	});

	after((done) => {
		if (ws.readyState === WebSocket.OPEN) {
			ws.close();
		}
		server.close(done);
	});

	beforeEach(async () => {
		await pool.query("DELETE FROM Messages");
	});

	// it("Should handle chat messages", (done) => {
	// 	ws.send(
	// 		JSON.stringify({
	// 			type: "chat",
	// 			data: { userId: "testUser", text: "Hello, WebSocket!" },
	// 		})
	// 	);

	// 	ws.on("message", (data) => {
	// 		const message = JSON.parse(data);
	// 		if (message.type === "chat_response") {
	// 			expect(message.data).to.be.a("string");
	// 		} else if (message.type === "chat_end") {
	// 			done();
	// 		}
	// 	});
	// });

	// Add more tests as needed
});
