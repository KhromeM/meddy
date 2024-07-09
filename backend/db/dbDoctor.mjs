import { pool } from "./dbConfig.mjs";

/**
 * Create a new doctor
 * @param {string} doctorId - The ID of the doctor
 * @param {string} name - The name of the doctor
 * @returns {Promise<Object>} - A promise that resolves to the created doctor object
 */
export const createDoctor = (doctorId, name) => {
	const query = "INSERT INTO Doctors (DoctorID, Name) VALUES ($1, $2) RETURNING *";
	const values = [doctorId, name];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error creating doctor:", err);
			throw err;
		});
};

/**
 * Get a doctor by ID
 * @param {string} doctorId - The ID of the doctor
 * @returns {Promise<Object>} - A promise that resolves to the doctor object
 */
export const getDoctorById = (doctorId) => {
	const query = "SELECT * FROM Doctors WHERE DoctorID = $1";
	const values = [doctorId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error getting doctor:", err);
			throw err;
		});
};

/**
 * Update a doctor by ID
 * @param {string} doctorId - The ID of the doctor
 * @param {string} name - The new name of the doctor
 * @returns {Promise<Object>} - A promise that resolves to the updated doctor object
 */
export const updateDoctor = (doctorId, name) => {
	const query = "UPDATE Doctors SET Name = $1 WHERE DoctorID = $2 RETURNING *";
	const values = [name, doctorId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error updating doctor:", err);
			throw err;
		});
};
