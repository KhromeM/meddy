import { expect } from "chai";
import supertest from "supertest";
import { app, server } from "../../server.mjs";

describe("Auth Middleware Tests", () => {
	let request;

	beforeEach(() => {
		request = supertest(app);
	});

	after(() => {
		server.close();
	});

	it("should allow access with idToken='dev' in headers", async () => {
		const response = await request
			.post("/api/chat")
			.set("idtoken", "dev")
			.send({ message: { text: "Whats 2+2?" } });
		expect(response.status).to.equal(200);
	});

	it("should allow access with idToken='dev' in body", async () => {
		const response = await request
			.post("/api/chat")
			.send({ idToken: "dev", message: { text: "Whats 2+2?" } });
		expect(response.status).to.equal(200);
	});

	it("shouldnt allow access without idtoken", async () => {
		const response = await request
			.post("/api/chat")
			.send({ message: { text: "Whats 2+2?" } });
		expect(response.status).to.equal(401);
	});
});
