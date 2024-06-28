import { pool } from "./dbConfig.mjs";

/**
 * Create a new message
 * @param {string} userId - The ID of the user
 * @param {string} source - The source of the message
 * @param {string} text - The text content of the message
 * @returns {Promise<Object>} - A promise that resolves to the created message object
 */
export const createMessage = (userId, source, text) => {
	const query =
		"INSERT INTO Messages (UserID, Source, Text) VALUES ($1, $2, $3) RETURNING *";
	const values = [userId, source, text];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error creating message:", err);
			throw err;
		});
};

/**
 * Get the most recent n messages for a specific user from most recent
 * @param {string} userId - The ID of the user
 * @param {number} limit - The number of recent messages to retrieve
 * @returns {Promise<Array>} - A promise that resolves to an array of messages
 */
export const getRecentMessagesByUserId = (userId, limit) => {
	const query = `
        SELECT * FROM Messages
        WHERE UserID = $1
        ORDER BY Time DESC
        LIMIT $2
    `;
	const values = [userId, limit];
	return pool
		.query(query, values)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting recent messages:", err);
			throw err;
		});
};
