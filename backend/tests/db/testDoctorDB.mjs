import { expect } from "chai";
import { pool } from "../../db/dbConfig.mjs";
import { createDoctor, getDoctorById, updateDoctor } from "../../db/dbDoctor.mjs";

describe("DB Doctor Functions", () => {
	before(async () => {
		await pool.query("DELETE FROM Doctors");
	});

	afterEach(async () => {
		await pool.query("DELETE FROM Doctors");
	});

	it("creat", async () => {
		const doctor = await createDoctor("test_doctor", "Test Doctor");
		expect(doctor).to.have.property("doctorid", "test_doctor");
		expect(doctor).to.have.property("name", "Test Doctor");
	});

	it("getDoctorById", async () => {
		await createDoctor("test_doctor", "Test Doctor");
		const doctor = await getDoctorById("test_doctor");
		expect(doctor).to.have.property("doctorid", "test_doctor");
		expect(doctor).to.have.property("name", "Test Doctor");
	});

	it("updateDoctor", async () => {
		await createDoctor("test_doctor", "Test Doctor");
		const updatedDoctor = await updateDoctor("test_doctor", "Updated Doctor");
		expect(updatedDoctor).to.have.property("doctorid", "test_doctor");
		expect(updatedDoctor).to.have.property("name", "Updated Doctor");
	});
});
