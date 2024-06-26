import { pool } from "./dbConfig.mjs";

/**
 * Create a new file
 * @param {number} userId - The ID of the user
 * @param {string} type - The type of the file
 * @param {string} name - The name of the file
 * @param {number} byteSize - The size of the file in bytes
 * @param {string} localPath - The local path to the file
 * @param {string} accessUrl - The access URL for the file
 * @returns {Promise<Object>} - A promise that resolves to the created file object
 */
export function createFile(userId, type, name, byteSize, localPath, accessUrl) {
	var query = `
    INSERT INTO Files (UserID, Type, Name, ByteSize, LocalPath, AccessUrl) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *`;
	var values = [userId, type, name, byteSize, localPath, accessUrl];
	return pool
		.query(query, values)
		.then(function (res) {
			return res.rows[0];
		})
		.catch(function (err) {
			console.error("Error creating file:", err);
			throw err;
		});
}

/**
 * Get a file by ID
 * @param {number} fileId - The ID of the file
 * @returns {Promise<Object>} - A promise that resolves to the file object
 */
export function getFileById(fileId) {
	var query = "SELECT * FROM Files WHERE FileID = $1";
	var values = [fileId];
	return pool
		.query(query, values)
		.then(function (res) {
			return res.rows[0];
		})
		.catch(function (err) {
			console.error("Error getting file:", err);
			throw err;
		});
}

/**
 * Update a file by ID
 * @param {number} fileId - The ID of the file
 * @param {number} userId - The ID of the user
 * @param {string} type - The type of the file
 * @param {string} name - The name of the file
 * @param {number} byteSize - The size of the file in bytes
 * @param {string} localPath - The local path to the file
 * @param {string} accessUrl - The access URL for the file
 * @returns {Promise<Object>} - A promise that resolves to the updated file object
 */
export function updateFile(
	fileId,
	userId,
	type,
	name,
	byteSize,
	localPath,
	accessUrl
) {
	var query = `
    UPDATE Files 
    SET UserID = $1, Type = $2, Name = $3, ByteSize = $4, LocalPath = $5, AccessUrl = $6 
    WHERE FileID = $7 
    RETURNING *`;
	var values = [userId, type, name, byteSize, localPath, accessUrl, fileId];
	return pool
		.query(query, values)
		.then(function (res) {
			return res.rows[0];
		})
		.catch(function (err) {
			console.error("Error updating file:", err);
			throw err;
		});
}
