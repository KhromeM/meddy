import { pool } from "./dbConfig.mjs";
import { createQueryVector } from "pgvector";

/**
 * Create a new langchain document in the db (A document is a piece of a file)
 * @param {string} userId - The ID of the user
 * @param {string} text - The text content of the document
 * @param {number[]} embedding - The embedding vector associated with the document
 * @param {string} type - The type of the file the document is from
 * @param {number} fileId - The ID of the associated file
 * @param {number} order - The order of the document in the file
 * @returns {Promise<Object>} - A promise that resolves to the created document object
 */
export const createDocument = (
	userId,
	text,
	embedding,
	type,
	fileId,
	order
) => {
	var query = `
        INSERT INTO Documents (UserID, Text, Embedding, Type, FileID, "Order")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;
	var values = [userId, text, embedding, type, fileId, order];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error creating document:", err);
			throw err;
		});
};

/**
 * Get a document by ID
 * @param {number} documentId - The ID of the document
 * @returns {Promise<Object>} - A promise that resolves to the document object
 */
export const getDocumentById = (documentId) => {
	var query = "SELECT * FROM Documents WHERE DocumentID = $1";
	var values = [documentId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error getting document:", err);
			throw err;
		});
};

/**
 * Get documents by FileID
 * @param {number} fileId - The ID of the file to retrieve documents for
 * @returns {Promise<Array>} - A promise that resolves to an array of document objects
 */
export const getDocumentsByFileId = (fileId) => {
	var query = "SELECT * FROM Documents WHERE FileID = $1";
	var values = [fileId];
	return pool
		.query(query, values)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting documents by FileID:", err);
			throw err;
		});
};

/**
 * Delete documents by FileID
 * @param {number} fileId - The ID of the file whose documents are to be deleted
 * @returns {Promise<void>} - A promise that resolves when deletion is successful
 */
export const deleteDocumentsByFileId = (fileId) => {
	var query = "DELETE FROM Documents WHERE FileID = $1";
	var values = [fileId];
	return pool
		.query(query, values)
		.then(() => {
			console.log(`Documents with FileID ${fileId} deleted successfully.`);
		})
		.catch((err) => {
			console.error("Error deleting documents by FileID:", err);
			throw err;
		});
};

/**
 * Query documents with userid and query vector using cosine distance
 * @param {string} userId - The ID of the user
 * @param {number[]} queryVector - The query embedding vector
 * @param {number} limit - The maximum number of results to return
 * @returns {Promise<Array>} - A promise that resolves to an array of document objects ordered by cosine distance
 */
export const queryWithVec = (userId, queryVector, limit) => {
	var vectorQuery = createQueryVector(queryVector);
	var query = `
        SELECT DocumentID, UserID, Text, Embedding, Type, FileID, "Order",
               vector_cosine_distance(Embedding, $1) AS distance
        FROM Documents
        WHERE UserID = $2
        ORDER BY distance
        LIMIT $3`;
	var values = [vectorQuery, userId, limit];
	return pool
		.query(query, values)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting documents by embedding cosine:", err);
			throw err;
		});
};
