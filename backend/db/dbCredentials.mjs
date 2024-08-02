import { pool } from "./dbConfig.mjs";

export const saveCredentials = async (userId, providerName, credentialData) => {
	const query = `
        INSERT INTO Credentials (
            UserID, 
            ProviderName,
            AccessToken, 
            RefreshToken, 
            Scope, 
            TokenType, 
            ExpiryDate
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (UserID, ProviderName) 
        DO UPDATE SET 
            AccessToken = $3,
            RefreshToken = $4,
            Scope = $5,
            TokenType = $6,
            ExpiryDate = $7
        RETURNING *
    `;
	const values = [
		userId,
		providerName,
		credentialData.access_token,
		credentialData.refresh_token,
		credentialData.scope,
		credentialData.token_type,
		new Date(credentialData.expiry_date).toISOString(),
	];

	try {
		const result = await pool.query(query, values);
		return result.rows[0];
	} catch (err) {
		console.error(`Error saving credentials for ${providerName}:`, err);
		throw err;
	}
};

export const getCredentials = async (userId, providerName) => {
	const query = `
        SELECT 
            AccessToken as access_token, 
            RefreshToken as refresh_token, 
            Scope as scope, 
            TokenType as token_type, 
            ExpiryDate as expiry_date
        FROM Credentials 
        WHERE UserID = $1 AND ProviderName = $2
    `;
	const values = [userId, providerName];

	try {
		const result = await pool.query(query, values);
		if (result.rows[0]) {
			const tokenData = result.rows[0];
			return {
				...tokenData,
				expiry_date: new Date(tokenData.expiry_date).getTime(), // Convert back to timestamp
			};
		}
		return null;
	} catch (err) {
		console.error(`Error getting credentials for ${providerName}:`, err);
		throw err;
	}
};
