import { pool } from "./dbConfig.mjs";

export const createMedicalRecord = async (
	userId,
	medicalData,
	isTotal = false
) => {
	const query = `
        INSERT INTO MedicalRecords (
            UserID, Summary, MetabolicHealth, HeartHealth, GutHealth, 
            BrainHealth, ImmuneSystem, MusculoskeletalHealth, HormonalProfile, IsTotal
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `;
	const values = [
		userId,
		medicalData.summary,
		medicalData.metabolicHealth,
		medicalData.heartHealth,
		medicalData.gutHealth,
		medicalData.brainHealth,
		medicalData.immuneSystem,
		medicalData.musculoskeletalHealth,
		medicalData.hormonalProfile,
		isTotal,
	];

	try {
		const result = await pool.query(query, values);
		return result.rows[0];
	} catch (error) {
		console.error("Error creating medical record:", error);
		throw error;
	}
};

export const getMedicalRecordsByUserId = async (userId) => {
	const query =
		"SELECT * FROM MedicalRecords WHERE UserID = $1 ORDER BY CreatedAt DESC";
	const values = [userId];

	try {
		const result = await pool.query(query, values);
		return result.rows;
	} catch (error) {
		console.error("Error getting medical records:", error);
		throw error;
	}
};

export const getTotalMedicalRecordsByUserId = async (userId) => {
	const query = `
        SELECT * FROM MedicalRecords 
        WHERE UserID = $1 AND IsTotal = true 
        ORDER BY CreatedAt DESC
    `;
	const values = [userId];

	try {
		const result = await pool.query(query, values);
		return result.rows;
	} catch (error) {
		console.error("Error getting total medical records:", error);
		throw error;
	}
};

export const getMedicalRecordById = async (recordId) => {
	const query = "SELECT * FROM MedicalRecords WHERE RecordID = $1";
	const values = [recordId];

	try {
		const result = await pool.query(query, values);
		return result.rows[0];
	} catch (error) {
		console.error("Error getting medical record:", error);
		throw error;
	}
};

export const deleteMedicalRecord = async (recordId) => {
	const query = "DELETE FROM MedicalRecords WHERE RecordID = $1 RETURNING *";
	const values = [recordId];

	try {
		const result = await pool.query(query, values);
		return result.rows[0];
	} catch (error) {
		console.error("Error deleting medical record:", error);
		throw error;
	}
};

export const copyMedicalRecords = async (sourceUserId, targetUserId) => {
	const query = `
        INSERT INTO MedicalRecords (
            UserID, Summary, MetabolicHealth, HeartHealth, GutHealth, 
            BrainHealth, ImmuneSystem, MusculoskeletalHealth, HormonalProfile, IsTotal
        )
        SELECT 
            $2, Summary, MetabolicHealth, HeartHealth, GutHealth, 
            BrainHealth, ImmuneSystem, MusculoskeletalHealth, HormonalProfile, IsTotal
        FROM 
            MedicalRecords
        WHERE 
            UserID = $1
        RETURNING *
    `;
	const values = [sourceUserId, targetUserId];

	try {
		const result = await pool.query(query, values);
		console.log(
			`Copied ${result.rowCount} medical records from user ${sourceUserId} to user ${targetUserId}`
		);
		return result.rows;
	} catch (error) {
		console.error("Error copying medical records:", error);
		throw error;
	}
};
