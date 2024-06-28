import { expect } from "chai";
import supertest from "supertest";
import { app, server } from "../../server.mjs";

describe("Chat Endpoint Tests", () => {
	let request;

	beforeEach(() => {
		request = supertest(app);
	});

	after(() => {
		server.close();
	});

	it("Send chat message endpoint test", async () => {
		const response = await request
			.post("/api/chat")
			.send({ idToken: "dev", message: { text: "Whats 2+2?" } });
		expect(response.body.text).to.be.a("string");
	});
	it("Get chat history endpoint test", async () => {
		const res = await request
			.post("/api/chat")
			.send({ idToken: "dev", message: { text: "Whats 3+3?" } });
		const response = await request.get("/api/chat").set("idtoken", "dev");

		expect(response.status).to.equal(200);
		expect(response.body).to.have.property("chatHistory");
		expect(response.body.chatHistory).to.be.an("array");
		const myMessage = response.body.chatHistory[1];
		expect(myMessage).to.have.property("text", "Whats 3+3?");
	});
});
