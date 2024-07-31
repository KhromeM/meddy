import { pool } from "./dbConfig.mjs";

/**
 * Create a new user
 * @param {string} userId - The ID of the user
 * @param {string} name - The name of the user
 * @param {string} address - The address of the user
 * @param {string} email - The email of the user
 * @param {string} language - The preferred language of the user
 * @param {string} phone - The phone number of the user
 * @param {string} patientId - The patient ID of the user
 * @returns {Promise<Object>} - A promise that resolves to the created user object
 */
export const createUser = (
	userId,
	name,
	address,
	email,
	language,
	phone,
	patientId
) => {
	const query =
		"INSERT INTO Users (UserID, Name, Address, Email, Language, Phone, PatientID) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
	const values = [userId, name, address, email, language, phone, patientId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error creating user:", err);
			throw err;
		});
};

/**
 * Get a user by ID
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object>} - A promise that resolves to the user object
 */
export const getUserById = (userId) => {
	const query = "SELECT * FROM Users WHERE UserID = $1";
	const values = [userId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error getting user:", err);
			throw err;
		});
};

/**
 * Update a user by ID
 * @param {string} userId - The ID of the user
 * @param {string} name - The new name of the user
 * @param {string} address - The new address of the user
 * @param {string} email - The new email of the user
 * @param {string} language - The new preferred language of the user
 * @param {string} phone - The new phone number of the user
 * @param {string} patientId - The new patient ID of the user
 * @returns {Promise<Object>} - A promise that resolves to the updated user object
 */
export const updateUser = (
	userId,
	name,
	address,
	email,
	language,
	phone,
	patientId
) => {
	console.log("updating user", user);
	const query =
		"UPDATE Users SET Name = $2, Address = $3, Email = $4, Language = $5, Phone = $6, PatientID = $7 WHERE UserID = $1 RETURNING *";
	const values = [userId, name, address, email, language, phone, patientId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error updating user:", err);
			throw err;
		});
};
