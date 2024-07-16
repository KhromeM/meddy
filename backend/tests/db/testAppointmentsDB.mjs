import { expect } from "chai";
import { pool } from "../../db/dbConfig.mjs";
import {
	createAppointment,
	getAllAppointments,
	getAppointmentById,
	insertTranscript,
	updateAppointment,
	deleteAppointment,
} from "../../db/dbAppointments.mjs";
import { createUser } from "../../db/dbUser.mjs";
import { createDoctor } from "../../db/dbDoctor.mjs";

describe("DB Appointment Functions", () => {
	let user, doctor;

	before(async () => {
		await pool.query("DELETE FROM Messages");
		await pool.query("DELETE FROM Appointments");
		await pool.query("DELETE FROM Users");
		await pool.query("DELETE FROM Doctors");
		user = await createUser("test_user", "Test User");
		doctor = await createDoctor("test_doctor", "Test Doctor");
	});

	afterEach(async () => {
		await pool.query("DELETE FROM Appointments");
	});

	after(async () => {
		await pool.query("DELETE FROM Users");
		await pool.query("DELETE FROM Doctors");
	});

	it("createAppointment", async () => {
		const date = new Date();
		const appointment = await createAppointment(
			date,
			"Initial Consultation",
			"Summary of consultation",
			"First appointment",
			user.userid,
			doctor.doctorid
		);
		expect(appointment).to.have.property("date");
		expect(appointment.date.toISOString()).to.equal(date.toISOString());
		expect(appointment).to.have.property("transcript", "Initial Consultation");
		expect(appointment).to.have.property("transcriptsummary", "Summary of consultation");
		expect(appointment).to.have.property("description", "First appointment");
		expect(appointment).to.have.property("userid", user.userid);
		expect(appointment).to.have.property("doctorid", doctor.doctorid);
	});

	it("getAllAppointments", async () => {
		const date = new Date();
		await createAppointment(
			date,
			"Initial Consultation",
			"Summary",
			"Description",
			user.userid,
			doctor.doctorid
		);
		const appointments = await getAllAppointments();
		expect(appointments).to.be.an("array").that.is.not.empty;
	});

	it("getAppointmentById", async () => {
		const date = new Date();
		const createdAppointment = await createAppointment(
			date,
			"Initial Consultation",
			"Summary",
			"Description",
			user.userid,
			doctor.doctorid
		);
		const appointment = await getAppointmentById(createdAppointment.appointmentid);
		expect(appointment).to.have.property("appointmentid", createdAppointment.appointmentid);
	});

	it("insertTranscript", async () => {
		const date = new Date();
		const createdAppointment = await createAppointment(
			date,
			"",
			"",
			"Description",
			user.userid,
			doctor.doctorid
		);
		const updatedAppointment = await insertTranscript(
			createdAppointment.appointmentid,
			"Updated Transcript",
			"Updated Summary"
		);
		expect(updatedAppointment).to.have.property("transcript", "Updated Transcript");
		expect(updatedAppointment).to.have.property("transcriptsummary", "Updated Summary");
	});

	it("updateAppointment", async () => {
		const date = new Date();
		const newDate = new Date(date.getTime() + 86400000); // Plus one day
		const createdAppointment = await createAppointment(
			date,
			"Initial Consultation",
			"Initial Summary",
			"Initial Description",
			user.userid,
			doctor.doctorid
		);
		const updatedAppointment = await updateAppointment(
			createdAppointment.appointmentid,
			newDate,
			"Follow-up Consultation",
			"Follow-up Summary",
			"Follow-up Description",
			user.userid,
			doctor.doctorid
		);
		expect(updatedAppointment).to.have.property("date");
		expect(updatedAppointment.date.toISOString()).to.equal(newDate.toISOString());
		expect(updatedAppointment).to.have.property("transcript", "Follow-up Consultation");
		expect(updatedAppointment).to.have.property("transcriptsummary", "Follow-up Summary");
		expect(updatedAppointment).to.have.property("description", "Follow-up Description");
	});

	it("deleteAppointment", async () => {
		const date = new Date();
		const createdAppointment = await createAppointment(
			date,
			"Initial Consultation",
			"Summary",
			"Description",
			user.userid,
			doctor.doctorid
		);
		const deletedAppointment = await deleteAppointment(createdAppointment.appointmentid);
		expect(deletedAppointment).to.have.property("appointmentid", createdAppointment.appointmentid);
	});
});
