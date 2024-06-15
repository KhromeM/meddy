var pg = require("pg");

var pool = new pg.Pool({
	user: "postgres",
	host: "localhost",
	database: "meddysql",
	password: "password",
	port: 5432,
});

/**
 * Create a new user
 * @param {number} id - The id of the user
 * @param {string} name - The name of the user
 * @returns {Promise<Object>} - A promise that resolves to the created user object
 */
function createUser(userId, name) {
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
function getUserById(userId) {
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
function updateUser(userId, name) {
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

/**
 * Create a new message
 * @param {number} userId - The ID of the user
 * @param {string} source - The source of the message
 * @param {string} text - The text content of the message
 * @returns {Promise<Object>} - A promise that resolves to the created message object
 */
function createMessage(userId, source, text) {
	var query =
		"INSERT INTO Messages (UserID, Source, Text) VALUES ($1, $2, $3) RETURNING *";
	var values = [userId, source, text];
	return pool
		.query(query, values)
		.then(function (res) {
			return res.rows[0];
		})
		.catch(function (err) {
			console.error("Error creating message:", err);
			throw err;
		});
}

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
function createFile(userId, type, name, byteSize, localPath, accessUrl) {
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
function getFileById(fileId) {
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
function updateFile(
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

/**
 * Get the most recent n messages for a specific user
 * @param {number} userId - The ID of the user
 * @param {number} limit - The number of recent messages to retrieve
 * @returns {Promise<Array>} - A promise that resolves to an array of messages
 */
function getRecentMessagesByUserId(userId, limit) {
	var query = `
    SELECT * FROM Messages
    WHERE UserID = $1
    ORDER BY Time DESC
    LIMIT $2
  `;
	var values = [userId, limit];
	return pool
		.query(query, values)
		.then(function (res) {
			return res.rows;
		})
		.catch(function (err) {
			console.error("Error getting recent messages:", err);
			throw err;
		});
}

module.exports = {
	createUser: createUser,
	getUserById: getUserById,
	updateUser: updateUser,
	createMessage: createMessage,
	createFile: createFile,
	getFileById: getFileById,
	updateFile: updateFile,
	getRecentMessagesByUserId: getRecentMessagesByUserId,
};

const generateRandomString = (length) =>
	Array.from({ length }, () =>
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
			Math.floor(Math.random() * 62)
		)
	).join("");

(async () => {
	const name = "Khrome";
	const user = await createUser(95, name);
	console.log("Created user: ", name);
	console.log(user);
})();

// (async () => {
// 	const userId = 95;
// 	const user = await getUserById(userId);
// 	console.log(user);
// })();

// async function createAndPrintMessage(userId, source, text) {
// 	const message = await createMessage(userId, source, text);
// 	console.log(message);
// }

// (async () => {
// 	const source = "user";
// 	for (let i = 0; i < 10; i++) {
// 		for (let j = 1; j <= 5; j++) {
// 			const text = "Hello"; //generateRandomString(100);
// 			createAndPrintMessage(j, source, text);
// 		}
// 	}
// })();

// (async () => {
// 	const userId = 5;
// 	const messages = await getRecentMessagesByUserId(userId, 2000);
// 	console.log(messages);
// })();
