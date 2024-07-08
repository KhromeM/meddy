import { expect } from "chai";
import supertest from "supertest";
import { app, server } from "../../server.mjs";
import { pool } from "../../db/dbConfig.mjs";

describe("Doctor Endpoint Tests", function () {
	this.timeout(10000);
	let request = supertest(app);

	beforeEach(async () => {
		await pool.query("DELETE FROM Doctors");
		request = supertest(app);
	});

	after(async () => {
		await pool.query("DELETE FROM Doctors");
		server.close();
	});

	afterEach(async () => {
		await pool.query("DELETE FROM Doctors");
	});

	it("Create doctor endpoint test", async () => {
		const response = await request
			.post("/api/doctor")
			.send({ doctorId: "D123", name: "Dr. Strange", idToken: "dev" });
		expect(response.status).to.equal(201);
		expect(response.body.doctor).to.include({ doctorid: "D123", name: "Dr. Strange" });
	});

	it("Get doctor by ID endpoint test", async () => {
		await request.post("/api/doctor").send({ doctorId: "D124", name: "Dr. Who", idToken: "dev" });
		const response = await request.get("/api/doctor/D124").set("idToken", "dev");
		expect(response.status).to.equal(200);
		expect(response.body.doctor).to.include({ doctorid: "D124", name: "Dr. Who" });
	});

	it("Update doctor endpoint test", async () => {
		await request.post("/api/doctor").send({ doctorId: "D125", name: "Dr. Watson", idToken: "dev" });
		const response = await request
			.put("/api/doctor/D125")
			.send({ name: "Dr. John Watson", idToken: "dev" });
		expect(response.status).to.equal(200);
		expect(response.body.doctor).to.include({ doctorid: "D125", name: "Dr. John Watson" });
	});
});
