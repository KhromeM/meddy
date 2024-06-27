import { pool } from "./dbConfig.mjs";

/**
 * Create a new user
 * @param {string} userId - The ID of the user
 * @param {string} name - The name of the user
 * @returns {Promise<Object>} - A promise that resolves to the created user object
 */
export const createUser = (userId, name) => {
	const query = "INSERT INTO Users (UserID, Name) VALUES ($1, $2) RETURNING *";
	const values = [userId, name];
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
 * @returns {Promise<Object>} - A promise that resolves to the updated user object
 */
export const updateUser = (userId, name) => {
	const query = "UPDATE Users SET Name = $1 WHERE UserID = $2 RETURNING *";
	const values = [name, userId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error updating user:", err);
			throw err;
		});
};
