import { expect } from "chai";
import { pool } from "../../db/dbConfig.mjs";
import {
	createMedication,
	getAllMedications,
	getMedicationById,
	updateMedication,
	deleteMedication,
	createReminder,
	getAllReminders,
	getReminderById,
	updateReminder,
	deleteReminder,
	createAllergy,
	getAllAllergies,
	getAllergyById,
	updateAllergy,
	deleteAllergy,
	createCondition,
	getAllConditions,
	getConditionById,
	updateCondition,
	deleteCondition,
} from "../../db/dbInfo.mjs";
import { createUser } from "../../db/dbUser.mjs";

describe("DB Info Functions", () => {
	let user;

	before(async () => {
		await pool.query("DELETE FROM Medications");
		await pool.query("DELETE FROM Reminders");
		await pool.query("DELETE FROM Allergies");
		await pool.query("DELETE FROM Conditions");
		await pool.query("DELETE FROM Users");
		user = await createUser("test_user", "Test User");
	});

	afterEach(async () => {
		await pool.query("DELETE FROM Medications");
		await pool.query("DELETE FROM Reminders");
		await pool.query("DELETE FROM Allergies");
		await pool.query("DELETE FROM Conditions");
	});

	after(async () => {
		await pool.query("DELETE FROM Users");
	});

	// Medications Tests
	it("createMedication", async () => {
		const medication = await createMedication(user.userid, "Ibuprofen", "200mg");
		expect(medication).to.have.property("name", "Ibuprofen");
		expect(medication).to.have.property("dosage", "200mg");
		expect(medication).to.have.property("userid", user.userid);
	});

	it("getAllMedications", async () => {
		await createMedication(user.userid, "Ibuprofen", "200mg");
		const medications = await getAllMedications();
		expect(medications).to.be.an("array").that.is.not.empty;
	});

	it("getMedicationById", async () => {
		const createdMedication = await createMedication(user.userid, "Ibuprofen", "200mg");
		const medication = await getMedicationById(createdMedication.medicationid);
		expect(medication).to.have.property("medicationid", createdMedication.medicationid);
	});

	it("updateMedication", async () => {
		const createdMedication = await createMedication(user.userid, "Ibuprofen", "200mg");
		const updatedMedication = await updateMedication(
			createdMedication.medicationid,
			user.userid,
			"Paracetamol",
			"500mg"
		);
		expect(updatedMedication).to.have.property("name", "Paracetamol");
		expect(updatedMedication).to.have.property("dosage", "500mg");
	});

	it("deleteMedication", async () => {
		const createdMedication = await createMedication(user.userid, "Ibuprofen", "200mg");
		const deletedMedication = await deleteMedication(createdMedication.medicationid);
		expect(deletedMedication).to.have.property("medicationid", createdMedication.medicationid);
	});

	// Reminders Tests
	it("createReminder", async () => {
		const reminder = await createReminder(user.userid, "Ibuprofen", 8, "08:00:00");
		expect(reminder).to.have.property("medicationname", "Ibuprofen");
		expect(reminder).to.have.property("hoursuntilrepeat", 8);
		expect(reminder).to.have.property("time", "08:00:00");
		expect(reminder).to.have.property("userid", user.userid);
	});

	it("getAllReminders", async () => {
		await createReminder(user.userid, "Ibuprofen", 8, "08:00:00");
		const reminders = await getAllReminders();
		expect(reminders).to.be.an("array").that.is.not.empty;
	});

	it("getReminderById", async () => {
		const createdReminder = await createReminder(user.userid, "Ibuprofen", 8, "08:00:00");
		const reminder = await getReminderById(createdReminder.reminderid);
		expect(reminder).to.have.property("reminderid", createdReminder.reminderid);
	});

	it("updateReminder", async () => {
		const createdReminder = await createReminder(user.userid, "Ibuprofen", 8, "08:00:00");
		const updatedReminder = await updateReminder(
			createdReminder.reminderid,
			user.userid,
			"Paracetamol",
			12,
			"12:00:00"
		);
		expect(updatedReminder).to.have.property("medicationname", "Paracetamol");
		expect(updatedReminder).to.have.property("hoursuntilrepeat", 12);
		expect(updatedReminder).to.have.property("time", "12:00:00");
	});

	it("deleteReminder", async () => {
		const createdReminder = await createReminder(user.userid, "Ibuprofen", 8, "08:00:00");
		const deletedReminder = await deleteReminder(createdReminder.reminderid);
		expect(deletedReminder).to.have.property("reminderid", createdReminder.reminderid);
	});

	// Allergies Tests
	it("createAllergy", async () => {
		const allergy = await createAllergy(user.userid, "Peanuts");
		expect(allergy).to.have.property("name", "Peanuts");
		expect(allergy).to.have.property("userid", user.userid);
	});

	it("getAllAllergies", async () => {
		await createAllergy(user.userid, "Peanuts");
		const allergies = await getAllAllergies();
		expect(allergies).to.be.an("array").that.is.not.empty;
	});

	it("getAllergyById", async () => {
		const createdAllergy = await createAllergy(user.userid, "Peanuts");
		const allergy = await getAllergyById(createdAllergy.allergyid);
		expect(allergy).to.have.property("allergyid", createdAllergy.allergyid);
	});

	it("updateAllergy", async () => {
		const createdAllergy = await createAllergy(user.userid, "Peanuts");
		const updatedAllergy = await updateAllergy(createdAllergy.allergyid, user.userid, "Shellfish");
		expect(updatedAllergy).to.have.property("name", "Shellfish");
	});

	it("deleteAllergy", async () => {
		const createdAllergy = await createAllergy(user.userid, "Peanuts");
		const deletedAllergy = await deleteAllergy(createdAllergy.allergyid);
		expect(deletedAllergy).to.have.property("allergyid", createdAllergy.allergyid);
	});

	// Conditions Tests
	it("createCondition", async () => {
		const condition = await createCondition(user.userid, "Asthma");
		expect(condition).to.have.property("name", "Asthma");
		expect(condition).to.have.property("userid", user.userid);
	});

	it("getAllConditions", async () => {
		await createCondition(user.userid, "Asthma");
		const conditions = await getAllConditions();
		expect(conditions).to.be.an("array").that.is.not.empty;
	});

	it("getConditionById", async () => {
		const createdCondition = await createCondition(user.userid, "Asthma");
		const condition = await getConditionById(createdCondition.conditionid);
		expect(condition).to.have.property("conditionid", createdCondition.conditionid);
	});

	it("updateCondition", async () => {
		const createdCondition = await createCondition(user.userid, "Asthma");
		const updatedCondition = await updateCondition(createdCondition.conditionid, user.userid, "Diabetes");
		expect(updatedCondition).to.have.property("name", "Diabetes");
	});

	it("deleteCondition", async () => {
		const createdCondition = await createCondition(user.userid, "Asthma");
		const deletedCondition = await deleteCondition(createdCondition.conditionid);
		expect(deletedCondition).to.have.property("conditionid", createdCondition.conditionid);
	});
});
