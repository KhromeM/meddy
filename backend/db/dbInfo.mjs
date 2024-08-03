import { pool } from "./dbConfig.mjs";
import { getUserById } from "./dbUser.mjs";
import { getUserAppointments } from "./dbAppointments.mjs";
import { getRecentMessagesByUserId } from "./dbMessages.mjs";
import { retrieveCleanedPatientDetailsFromEpic } from "../server/controllers/medplumController.mjs";

// Medications Methods
export const createMedication = (userId, name, dosage) => {
	const query = "INSERT INTO Medications (UserID, Name, Dosage) VALUES ($1, $2, $3) RETURNING *";
	const values = [userId, name, dosage];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error creating medication:", err);
			throw err;
		});
};

export const getAllMedications = () => {
	const query = "SELECT * FROM Medications";
	return pool
		.query(query)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting all medications:", err);
			throw err;
		});
};

export const getUserMedications = (userId) => {
	const query = "SELECT * FROM Medications WHERE UserID = $1";
	const values = [userId];
	return pool
		.query(query, values)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting user medications:", err);
			throw err;
		});
};

export const getMedicationById = (medicationId) => {
	const query = "SELECT * FROM Medications WHERE MedicationID = $1";
	const values = [medicationId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error getting medication:", err);
			throw err;
		});
};

export const updateMedication = (medicationId, userId, name, dosage) => {
	const query =
		"UPDATE Medications SET UserID = $1, Name = $2, Dosage = $3 WHERE MedicationID = $4 RETURNING *";
	const values = [userId, name, dosage, medicationId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error updating medication:", err);
			throw err;
		});
};

export const deleteMedication = (medicationId) => {
	const query = "DELETE FROM Medications WHERE MedicationID = $1 RETURNING *";
	const values = [medicationId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error deleting medication:", err);
			throw err;
		});
};

// Reminders Methods
export const createReminder = (userId, medicationName, hoursUntilRepeat, time) => {
	const query =
		"INSERT INTO Reminders (UserID, MedicationName, HoursUntilRepeat, Time) VALUES ($1, $2, $3, $4) RETURNING *";
	const values = [userId, medicationName, hoursUntilRepeat, time];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error creating reminder:", err);
			throw err;
		});
};

export const getAllReminders = () => {
	const query = "SELECT * FROM Reminders";
	return pool
		.query(query)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting all reminders:", err);
			throw err;
		});
};

export const getUserReminders = (userId) => {
	const query = "SELECT * FROM Reminders WHERE UserID = $1";
	const values = [userId];
	return pool
		.query(query, values)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting user reminders:", err);
			throw err;
		});
};

export const getReminderById = (reminderId) => {
	const query = "SELECT * FROM Reminders WHERE ReminderID = $1";
	const values = [reminderId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error getting reminder:", err);
			throw err;
		});
};

export const updateReminder = (reminderId, userId, medicationName, hoursUntilRepeat, time) => {
	const query =
		"UPDATE Reminders SET UserID = $1, MedicationName = $2, HoursUntilRepeat = $3, Time = $4 WHERE ReminderID = $5 RETURNING *";
	const values = [userId, medicationName, hoursUntilRepeat, time, reminderId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error updating reminder:", err);
			throw err;
		});
};

export const deleteReminder = (reminderId) => {
	const query = "DELETE FROM Reminders WHERE ReminderID = $1 RETURNING *";
	const values = [reminderId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error deleting reminder:", err);
			throw err;
		});
};

// Allergies Methods
export const createAllergy = (userId, name) => {
	const query = "INSERT INTO Allergies (UserID, Name) VALUES ($1, $2) RETURNING *";
	const values = [userId, name];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error creating allergy:", err);
			throw err;
		});
};

export const getAllAllergies = () => {
	const query = "SELECT * FROM Allergies";
	return pool
		.query(query)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting all allergies:", err);
			throw err;
		});
};

export const getUserAllergies = (userId) => {
	const query = "SELECT * FROM Allergies WHERE UserID = $1";
	const values = [userId];
	return pool
		.query(query, values)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting user allergies:", err);
			throw err;
		});
};

export const getAllergyById = (allergyId) => {
	const query = "SELECT * FROM Allergies WHERE AllergyID = $1";
	const values = [allergyId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error getting allergy:", err);
			throw err;
		});
};

export const updateAllergy = (allergyId, userId, name) => {
	const query = "UPDATE Allergies SET UserID = $1, Name = $2 WHERE AllergyID = $3 RETURNING *";
	const values = [userId, name, allergyId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error updating allergy:", err);
			throw err;
		});
};

export const deleteAllergy = (allergyId) => {
	const query = "DELETE FROM Allergies WHERE AllergyID = $1 RETURNING *";
	const values = [allergyId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error deleting allergy:", err);
			throw err;
		});
};

// Conditions Methods
export const createCondition = (userId, name) => {
	const query = "INSERT INTO Conditions (UserID, Name) VALUES ($1, $2) RETURNING *";
	const values = [userId, name];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error creating condition:", err);
			throw err;
		});
};

export const getAllConditions = () => {
	const query = "SELECT * FROM Conditions";
	return pool
		.query(query)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting all conditions:", err);
			throw err;
		});
};

export const getUserConditions = (userId) => {
	const query = "SELECT * FROM Conditions WHERE UserID = $1";
	const values = [userId];
	return pool
		.query(query, values)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting user conditions:", err);
			throw err;
		});
};

export const getConditionById = (conditionId) => {
	const query = "SELECT * FROM Conditions WHERE ConditionID = $1";
	const values = [conditionId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error getting condition:", err);
			throw err;
		});
};

export const updateCondition = (conditionId, userId, name) => {
	const query = "UPDATE Conditions SET UserID = $1, Name = $2 WHERE ConditionID = $3 RETURNING *";
	const values = [userId, name, conditionId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error updating condition:", err);
			throw err;
		});
};

export const deleteCondition = (conditionId) => {
	const query = "DELETE FROM Conditions WHERE ConditionID = $1 RETURNING *";
	const values = [conditionId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error deleting condition:", err);
			throw err;
		});
};

export const getUserInfo = async (userId) => {
	try {
		const user = await getUserById(userId);
		const medications = await getUserMedications(userId);
		const reminders = await getUserReminders(userId);
		const appointments = await getUserAppointments(userId);
		const chatHistory = await getRecentMessagesByUserId(userId, 5);
		let medplumInfo = {};

		// Get medplum information
		if (user.patientid) {
			medplumInfo = await retrieveCleanedPatientDetailsFromEpic(user.patientid);
		}

		return {
			user: {
				userid: user.userid,
				name: user.name,
				address: user.address,
				email: user.email,
				language: user.language,
				phone: user.phone,
				patientid: user.patientid,
			},
			chathistory: chatHistory.map((message) => ({
				role: message.source.toLowerCase(),
				content: message.text,
			})),
			medications: medications.map((med) => ({
				id: med.medicationid,
				name: med.name,
				dosage: med.dosage,
			})),
			appointments: appointments.map((apt) => ({
				id: apt.appointmentid,
				doctorid: apt.doctorid,
				date: apt.date,
				description: apt.description,
				transcript: apt.transcript,
				transcriptsummary: apt.transcriptsummary,
			})),
			reminders: reminders.map((rem) => ({
				id: rem.reminderid,
				medicationname: rem.medicationname,
				hoursuntilrepeat: rem.hoursuntilrepeat,
				time: rem.time,
			})),
			medplumInfo: medplumInfo,
		};
	} catch (error) {
		console.error("Error getting user info:", error);
		throw error;
	}
};
