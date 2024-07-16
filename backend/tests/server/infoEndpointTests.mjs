import { expect } from "chai";
import supertest from "supertest";
import { app, server } from "../../server.mjs";
import { pool } from "../../db/dbConfig.mjs";

describe("Info Endpoint Tests", function () {
	this.timeout(10000);
	let request = supertest(app);

	beforeEach(async () => {
		await pool.query("DELETE FROM Medications");
		await pool.query("DELETE FROM Reminders");
		await pool.query("DELETE FROM Allergies");
		await pool.query("DELETE FROM Conditions");
		await pool.query("DELETE FROM Users");
		await pool.query("INSERT INTO Users (userId, name) VALUES ('U123', 'User One')");
		request = supertest(app);
	});

	after(async () => {
		await pool.query("DELETE FROM Medications");
		await pool.query("DELETE FROM Reminders");
		await pool.query("DELETE FROM Allergies");
		await pool.query("DELETE FROM Conditions");
		await pool.query("DELETE FROM Users");
		server.close();
	});

	// Medication Tests
	describe("Medication Endpoint Tests", () => {
		it("Create medication endpoint test", async () => {
			const response = await request
				.post("/api/info/medication")
				.send({ userId: "U123", name: "MedOne", dosage: "100mg", idToken: "dev" });
			expect(response.status).to.equal(201);
			expect(response.body.medication).to.include({ userid: "U123", name: "MedOne", dosage: "100mg" });
		});

		it("Get all medications endpoint test", async () => {
			await request
				.post("/api/info/medication")
				.send({ userId: "U123", name: "MedOne", dosage: "100mg", idToken: "dev" });
			const response = await request.get("/api/info/medication").send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.medications).to.be.an("array");
			expect(response.body.medications).to.have.lengthOf(1);
		});

		it("Get medication by ID endpoint test", async () => {
			const createResponse = await request
				.post("/api/info/medication")
				.send({ userId: "U123", name: "MedOne", dosage: "100mg", idToken: "dev" });
			const medicationId = createResponse.body.medication.medicationid;
			const response = await request
				.get(`/api/info/medication/${medicationId}`)
				.send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.medication).to.have.property("medicationid", medicationId);
		});

		it("Update medication endpoint test", async () => {
			const createResponse = await request
				.post("/api/info/medication")
				.send({ userId: "U123", name: "MedOne", dosage: "100mg", idToken: "dev" });
			const medicationId = createResponse.body.medication.medicationid;
			const response = await request
				.put(`/api/info/medication/${medicationId}`)
				.send({ userId: "U123", name: "MedOneUpdated", dosage: "150mg", idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.medication).to.include({ name: "MedOneUpdated", dosage: "150mg" });
		});

		it("Delete medication endpoint test", async () => {
			const createResponse = await request
				.post("/api/info/medication")
				.send({ userId: "U123", name: "MedOne", dosage: "100mg", idToken: "dev" });
			const medicationId = createResponse.body.medication.medicationid;
			const response = await request
				.delete(`/api/info/medication/${medicationId}`)
				.send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.medication).to.have.property("medicationid", medicationId);
		});
	});

	// Reminder Tests
	describe("Reminder Endpoint Tests", () => {
		it("Create reminder endpoint test", async () => {
			const response = await request.post("/api/info/reminder").send({
				userId: "U123",
				medicationName: "MedOne",
				hoursUntilRepeat: 24,
				time: "08:00:00",
				idToken: "dev",
			});
			expect(response.status).to.equal(201);
			expect(response.body.reminder).to.include({
				userid: "U123",
				medicationname: "MedOne",
				hoursuntilrepeat: 24,
				time: "08:00:00",
			});
		});

		it("Get all reminders endpoint test", async () => {
			await request.post("/api/info/reminder").send({
				userId: "U123",
				medicationName: "MedOne",
				hoursUntilRepeat: 24,
				time: "08:00:00",
				idToken: "dev",
			});
			const response = await request.get("/api/info/reminder").send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.reminders).to.be.an("array");
			expect(response.body.reminders).to.have.lengthOf(1);
		});

		it("Get reminder by ID endpoint test", async () => {
			const createResponse = await request.post("/api/info/reminder").send({
				userId: "U123",
				medicationName: "MedOne",
				hoursUntilRepeat: 24,
				time: "08:00:00",
				idToken: "dev",
			});
			const reminderId = createResponse.body.reminder.reminderid;
			const response = await request.get(`/api/info/reminder/${reminderId}`).send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.reminder).to.have.property("reminderid", reminderId);
		});

		it("Update reminder endpoint test", async () => {
			const createResponse = await request.post("/api/info/reminder").send({
				userId: "U123",
				medicationName: "MedOne",
				hoursUntilRepeat: 24,
				time: "08:00:00",
				idToken: "dev",
			});
			const reminderId = createResponse.body.reminder.reminderid;
			const response = await request.put(`/api/info/reminder/${reminderId}`).send({
				userId: "U123",
				medicationName: "MedOne",
				hoursUntilRepeat: 12,
				time: "09:00:00",
				idToken: "dev",
			});
			expect(response.status).to.equal(200);
			expect(response.body.message).to.equal("Updated reminder successfully");
			expect(response.body.data).to.include({ hoursuntilrepeat: 12, time: "09:00:00" });
		});

		it("Delete reminder endpoint test", async () => {
			const createResponse = await request.post("/api/info/reminder").send({
				userId: "U123",
				medicationName: "MedOne",
				hoursUntilRepeat: 24,
				time: "08:00",
				idToken: "dev",
			});
			const reminderId = createResponse.body.reminder.reminderid;
			const response = await request
				.delete(`/api/info/reminder/${reminderId}`)
				.send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body).to.have.property("message", "Deleted reminder successfully");
		});
	});

	// Allergy Tests
	describe("Allergy Endpoint Tests", () => {
		it("Create allergy endpoint test", async () => {
			const response = await request
				.post("/api/info/allergy")
				.send({ userId: "U123", name: "Peanuts", idToken: "dev" });
			expect(response.status).to.equal(201);
			expect(response.body.allergy).to.include({ userid: "U123", name: "Peanuts" });
		});

		it("Get all allergies endpoint test", async () => {
			await request.post("/api/info/allergy").send({ userId: "U123", name: "Peanuts", idToken: "dev" });
			const response = await request.get("/api/info/allergy").send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.allergies).to.be.an("array");
			expect(response.body.allergies).to.have.lengthOf(1);
		});

		it("Get allergy by ID endpoint test", async () => {
			const createResponse = await request
				.post("/api/info/allergy")
				.send({ userId: "U123", name: "Peanuts", idToken: "dev" });
			const allergyId = createResponse.body.allergy.allergyid;
			const response = await request.get(`/api/info/allergy/${allergyId}`).send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.allergy).to.have.property("allergyid", allergyId);
		});

		it("Update allergy endpoint test", async () => {
			const createResponse = await request
				.post("/api/info/allergy")
				.send({ userId: "U123", name: "Peanuts", idToken: "dev" });
			const allergyId = createResponse.body.allergy.allergyid;
			const response = await request
				.put(`/api/info/allergy/${allergyId}`)
				.send({ userId: "U123", name: "Tree Nuts", idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.allergy).to.include({ name: "Tree Nuts" });
		});

		it("Delete allergy endpoint test", async () => {
			const createResponse = await request
				.post("/api/info/allergy")
				.send({ userId: "U123", name: "Peanuts", idToken: "dev" });
			const allergyId = createResponse.body.allergy.allergyid;
			const response = await request.delete(`/api/info/allergy/${allergyId}`).send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body).to.have.property("message", "Deleted allergy successfully");
		});
	});

	// Condition Tests
	describe("Condition Endpoint Tests", () => {
		it("Create condition endpoint test", async () => {
			const response = await request
				.post("/api/info/condition")
				.send({ userId: "U123", name: "Asthma", idToken: "dev" });
			expect(response.status).to.equal(201);
			expect(response.body.condition).to.include({ userid: "U123", name: "Asthma" });
		});

		it("Get all conditions endpoint test", async () => {
			await request
				.post("/api/info/condition")
				.send({ userId: "U123", name: "Asthma", idToken: "dev" });
			const response = await request.get("/api/info/condition").send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.conditions).to.be.an("array");
			expect(response.body.conditions).to.have.lengthOf(1);
		});

		it("Get condition by ID endpoint test", async () => {
			const createResponse = await request
				.post("/api/info/condition")
				.send({ userId: "U123", name: "Asthma", idToken: "dev" });
			const conditionId = createResponse.body.condition.conditionid;
			const response = await request.get(`/api/info/condition/${conditionId}`).send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.condition).to.have.property("conditionid", conditionId);
		});

		it("Update condition endpoint test", async () => {
			const createResponse = await request
				.post("/api/info/condition")
				.send({ userId: "U123", name: "Asthma", idToken: "dev" });
			const conditionId = createResponse.body.condition.conditionid;
			const response = await request
				.put(`/api/info/condition/${conditionId}`)
				.send({ userId: "U123", name: "Chronic Asthma", idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body.condition).to.include({ name: "Chronic Asthma" });
		});

		it("Delete condition endpoint test", async () => {
			const createResponse = await request
				.post("/api/info/condition")
				.send({ userId: "U123", name: "Asthma", idToken: "dev" });
			const conditionId = createResponse.body.condition.conditionid;
			const response = await request
				.delete(`/api/info/condition/${conditionId}`)
				.send({ idToken: "dev" });
			expect(response.status).to.equal(200);
			expect(response.body).to.have.property("message", "Deleted condition successfully");
		});
	});
});
