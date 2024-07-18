import { pool } from "./dbConfig.mjs";

/**
 * Create a new appointment
 * @param {Date} date - The date and time of the appointment
 * @param {string} transcript - The transcript of the appointment (if it exists)
 * @param {string} transcriptSummary - The summary of the transcript (if it exists)
 * @param {string} description - The description of the appointment
 * @param {string} userId - The ID of the user
 * @param {string} doctorId - The ID of the doctor
 * @returns {Promise<Object>} - A promise that resolves to the created appointment object
 */
export const createAppointment = (date, transcript, transcriptSummary, description, userId, doctorId) => {
	const query =
		"INSERT INTO Appointments (Date, Transcript, TranscriptSummary, Description, UserID, DoctorID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
	const values = [date, transcript, transcriptSummary, description, userId, doctorId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error creating appointment:", err);
			throw err;
		});
};

/**
 * Get all appointments
 */
export const getAllAppointments = () => {
	const query = "SELECT * FROM Appointments";
	return pool
		.query(query)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting all appointments:", err);
			throw err;
		});
};

/**
 * Get all appointments for a specific user
 */
export const getUserAppointments = (userId) => {
	const query = "SELECT * FROM Appointments WHERE UserID = $1";
	const values = [userId];
	return pool
		.query(query, values)
		.then((res) => res.rows)
		.catch((err) => {
			console.error("Error getting user appointments:", err);
			throw err;
		});
};

/**
 * Get an appointment by ID
 * @param {string} appointmentId - The ID of the appointment
 * @returns {Promise<Object>} - A promise that resolves to the appointment object
 */
export const getAppointmentById = (appointmentId) => {
	const query = "SELECT * FROM Appointments WHERE AppointmentID = $1";
	const values = [appointmentId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error getting appointment:", err);
			throw err;
		});
};

/**
 * Insert or update a transcript and its summary for an appointment
 * @param {string} appointmentId - The ID of the appointment
 * @param {string} transcript - The transcript of the appointment
 * @param {string} transcriptSummary - The summary of the transcript
 * @returns {Promise<Object>} - A promise that resolves to the updated appointment object
 */
export const insertTranscript = (appointmentId, transcript, transcriptSummary) => {
	const query =
		"UPDATE Appointments SET Transcript = $1, TranscriptSummary = $2 WHERE AppointmentID = $3 RETURNING *";
	const values = [transcript, transcriptSummary, appointmentId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error updating transcript:", err);
			throw err;
		});
};

/**
 * Update an appointment
 * @param {string} appointmentId - The ID of the appointment
 * @param {Date} date - The date and time of the appointment
 * @param {string} transcript - The transcript of the appointment
 * @param {string} transcriptSummary - The summary of the transcript
 * @param {string} description - The description of the appointment
 * @param {string} userId - The ID of the user
 * @param {string} doctorId - The ID of the doctor
 * @returns {Promise<Object>} - A promise that resolves to the updated appointment object
 */
export const updateAppointment = (
	appointmentId,
	date,
	transcript,
	transcriptSummary,
	description,
	userId,
	doctorId
) => {
	const query =
		"UPDATE Appointments SET Date = $1, Transcript = $2, TranscriptSummary = $3, Description = $4, UserID = $5, DoctorID = $6 WHERE AppointmentID = $7 RETURNING *";
	const values = [date, transcript, transcriptSummary, description, userId, doctorId, appointmentId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error updating appointment:", err);
			throw err;
		});
};

/**
 * Delete an appointment
 * @param {string} appointmentId - The ID of the appointment to delete
 * @returns {Promise<Object>} - A promise that resolves to the deleted appointment object
 */
export const deleteAppointment = (appointmentId) => {
	const query = "DELETE FROM Appointments WHERE AppointmentID = $1 RETURNING *";
	const values = [appointmentId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error deleting appointment:", err);
			throw err;
		});
};
