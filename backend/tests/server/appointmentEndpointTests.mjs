import { expect } from "chai";
import supertest from "supertest";
import { app, server } from "../../server.mjs";
import { pool } from "../../db/dbConfig.mjs";

describe("Appointment Endpoint Tests", function () {
	this.timeout(10000);
	let request = supertest(app);

	beforeEach(async () => {
		await pool.query("DELETE FROM Appointments");
		await pool.query("DELETE FROM Doctors");
		await pool.query("DELETE FROM Users");
		await pool.query(
			"INSERT INTO Users (userId, name) VALUES ('U123', 'User One'), ('U124', 'User Two'), ('U125', 'User Three'), ('U126', 'User Four'), ('U127', 'User Five')"
		);
		await pool.query(
			"INSERT INTO Doctors (doctorId, name) VALUES ('D123', 'Doctor One'), ('D124', 'Doctor Two'), ('D125', 'Doctor Three'), ('D126', 'Doctor Four'), ('D127', 'Doctor Five')"
		);
		request = supertest(app);
	});

	after(async () => {
		await pool.query("DELETE FROM Appointments");
		await pool.query("DELETE FROM Doctors");
		await pool.query("DELETE FROM Users");
		server.close();
	});

	it("Create appointment endpoint test", async () => {
		const date = new Date("2024-07-09T00:46:14.669Z");
		const response = await request.post("/api/appointment").send({
			date: date,
			userId: "U123",
			doctorId: "D123",
			transcript: "Initial consultation",
			transcriptSummary: "Summary of initial consultation",
			description: "First appointment with Dr. One",
			idToken: "dev",
		});
		expect(response.status).to.equal(201);
		expect(response.body.appointment).to.have.property("userid", "U123");
		expect(response.body.appointment).to.have.property("doctorid", "D123");
		expect(response.body.appointment).to.have.property("transcript", "Initial consultation");
		expect(response.body.appointment).to.have.property(
			"transcriptsummary",
			"Summary of initial consultation"
		);
		expect(response.body.appointment).to.have.property("description", "First appointment with Dr. One");
		expect(new Date(response.body.appointment.date).toISOString()).to.equal("2024-07-09T00:46:14.669Z");
	});

	it("Get all appointments endpoint test", async () => {
		await request.post("/api/appointment").send({
			date: "2023-04-02T10:00:00.000Z",
			userId: "U124",
			doctorId: "D124",
			transcript: "Follow-up",
			transcriptSummary: "Follow-up summary",
			description: "Follow-up appointment",
			idToken: "dev",
		});
		const response = await request.get("/api/appointment").set("idToken", "dev");
		expect(response.status).to.equal(200);
		expect(response.body.appointments).to.be.an("array").that.is.not.empty;
	});

	it("Get appointment by ID endpoint test", async () => {
		const createResponse = await request.post("/api/appointment").send({
			date: "2023-04-03T10:00:00.000Z",
			userId: "U125",
			doctorId: "D125",
			transcript: "Check-up",
			transcriptSummary: "Regular check-up summary",
			description: "Annual check-up",
			idToken: "dev",
		});
		const appointmentId = createResponse.body.appointment.appointmentid;
		const response = await request.get(`/api/appointment/${appointmentId}`).set("idToken", "dev");
		expect(response.status).to.equal(200);
		expect(response.body.appointment).to.have.property("appointmentid", appointmentId);
		expect(response.body.appointment).to.have.property("transcript", "Check-up");
		expect(response.body.appointment).to.have.property("transcriptsummary", "Regular check-up summary");
		expect(response.body.appointment).to.have.property("description", "Annual check-up");
		expect(new Date(response.body.appointment.date).toISOString()).to.equal("2023-04-03T10:00:00.000Z");
	});

	it("Update appointment endpoint test", async () => {
		const createResponse = await request.post("/api/appointment").send({
			date: "2023-04-04T10:00:00.000Z",
			userId: "U126",
			doctorId: "D126",
			transcript: "Initial consultation",
			transcriptSummary: "Initial summary",
			description: "First visit",
			idToken: "dev",
		});
		const appointmentId = createResponse.body.appointment.appointmentid;
		const response = await request.put(`/api/appointment/${appointmentId}`).send({
			date: "2023-04-05T10:00:00.000Z",
			userId: "U126",
			doctorId: "D126",
			transcript: "Updated consultation",
			transcriptSummary: "Updated summary",
			description: "Follow-up visit",
			idToken: "dev",
		});
		expect(response.status).to.equal(200);
		expect(response.body.appointment).to.have.property("appointmentid", appointmentId);
		expect(response.body.appointment).to.have.property("transcript", "Updated consultation");
		expect(response.body.appointment).to.have.property("transcriptsummary", "Updated summary");
		expect(response.body.appointment).to.have.property("description", "Follow-up visit");
		expect(new Date(response.body.appointment.date).toISOString()).to.equal("2023-04-05T10:00:00.000Z");
	});

	it("Delete appointment endpoint test", async () => {
		const createResponse = await request.post("/api/appointment").send({
			date: "2023-04-06T10:00:00.000Z",
			userId: "U127",
			doctorId: "D127",
			transcript: "Final consultation",
			transcriptSummary: "Final summary",
			description: "Last appointment",
			idToken: "dev",
		});
		const appointmentId = createResponse.body.appointment.appointmentid;
		const response = await request.delete(`/api/appointment/${appointmentId}`).set("idToken", "dev");
		expect(response.status).to.equal(200);
		expect(response.body).to.have.property("message", "Deleted appointment successfully");
	});
});
