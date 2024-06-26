import { pool } from "./dbConfig.mjs";

/**
 * Create a new user
 * @param {number} id - The id of the user
 * @param {string} name - The name of the user
 * @returns {Promise<Object>} - A promise that resolves to the created user object
 */
export function createUser(userId, name) {
	var query = "INSERT INTO Users (UserID, Name) VALUES ($1, $2) RETURNING *";
	var values = [userId, name];
	return pool
		.query(query, values)
		.then(function (res) {
			return res.rows[0];
		})
		.catch(function (err) {
			console.error("Error creating user:", err);
			throw err;
		});
}

/**
 * Get a user by ID
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} - A promise that resolves to the user object
 */
export function getUserById(userId) {
	var query = "SELECT * FROM Users WHERE UserID = $1";
	var values = [userId];
	return pool
		.query(query, values)
		.then(function (res) {
			return res.rows[0];
		})
		.catch(function (err) {
			console.error("Error getting user:", err);
			throw err;
		});
}

/**
 * Update a user by ID
 * @param {number} userId - The ID of the user
 * @param {string} name - The new name of the user
 * @returns {Promise<Object>} - A promise that resolves to the updated user object
 */
export function updateUser(userId, name) {
	var query = "UPDATE Users SET Name = $1 WHERE UserID = $2 RETURNING *";
	var values = [name, userId];
	return pool
		.query(query, values)
		.then(function (res) {
			return res.rows[0];
		})
		.catch(function (err) {
			console.error("Error updating user:", err);
			throw err;
		});
}
