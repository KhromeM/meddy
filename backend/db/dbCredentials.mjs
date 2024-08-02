import { pool } from "./dbConfig.mjs";

export const saveGFitToken = async (userId, gFitToken) => {
	const query = `
        INSERT INTO Credentials (UserID, GFitToken)
        VALUES ($1, $2)
        ON CONFLICT (UserID) 
        DO UPDATE SET GFitToken = $2
        RETURNING *
    `;
	const values = [userId, gFitToken];

	try {
		const result = await pool.query(query, values);
		return result.rows[0];
	} catch (err) {
		console.error("Error saving Google Fit token:", err);
		throw err;
	}
};

export const getGFitToken = async (userId) => {
	const query = "SELECT GFitToken FROM Credentials WHERE UserID = $1";
	const values = [userId];

	try {
		const result = await pool.query(query, values);
		return result.rows[0]?.GFitToken;
	} catch (err) {
		console.error("Error getting Google Fit token:", err);
		throw err;
	}
};
