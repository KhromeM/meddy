// /backend/tests/server/chatStreamEndpointTests.mjs

import { expect } from "chai";
import supertest from "supertest";
import { app, server } from "../../server.mjs";
import { pool } from "../../db/dbConfig.mjs";

describe("Chat Stream Endpoint Tests", function () {
	this.timeout(10000);
	let request;

	before(() => {
		request = supertest(app);
	});

	beforeEach(async () => {
		await pool.query("DELETE FROM Messages");
	});

	after(() => {
		server.close();
	});

	afterEach(async () => {
		await pool.query("DELETE FROM Messages");
	});

	it("Should stream chat messages", (done) => {
		request
			.post("/api/chat/stream")
			.send({ idToken: "dev", message: { text: "Hello, how are you?" } })
			.expect(200)
			.expect("Content-Type", "text/event-stream")
			.buffer()
			.parse((res, callback) => {
				res.text = "";
				res.on("data", (chunk) => {
					res.text += chunk.toString();
				});
				res.on("end", callback);
			})
			.end((err, res) => {
				if (err) return done(err);

				const events = res.text.split("\n\n").filter(Boolean);
				expect(events.length).to.be.above(1); // At least one data event and one DONE event
				expect(events[events.length - 1]).to.equal("data: [DONE]");

				// Check that all events (except the last one) are valid JSON
				for (let i = 0; i < events.length - 1; i++) {
					expect(() => JSON.parse(events[i].slice(5))).to.not.throw();
				}

				done();
			});
	});

	it("Should save user and LLM messages to the database", async () => {
		await request.post("/api/chat/stream").send({
			idToken: "dev",
			message: { text: "What is the capital of France?" },
		});

		const result = await pool.query("SELECT * FROM Messages ORDER BY Time ASC");
		expect(result.rows.length).to.equal(2);
		expect(result.rows[0].text).to.equal("What is the capital of France?");
		expect(result.rows[0].source).to.equal("user");
		expect(result.rows[1].source).to.equal("llm");
	});

	it("Should handle unauthorized access correctly", (done) => {
		request
			.post("/api/chat/stream")
			.send({ idToken: "invalid_token", message: { text: "This should fail" } })
			.expect(401)
			.end((err, res) => {
				if (err) return done(err);

				// Check if the response body contains an error message
				expect(res.body).to.have.property("message");
				expect(res.body.message).to.equal("Authentication failed");

				done();
			});
	});
});
