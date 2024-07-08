import { pool } from "./dbConfig.mjs";

/**
 * Create a new appointment
 * @param {Timestamp} date - The date and time of the appointment
 * @param {string} transcript - The transcript of the appointment (if it exists)
 * @param {string} userId - The ID of the user
 * @param {string} doctorId - The ID of the doctor
 * @returns {Promise<Object>} - A promise that resolves to the created appointment object
 */
export const createAppointment = (date, transcript, userId, doctorId) => {
	const query =
		"INSERT INTO Appointments (Date, Transcript, UserID, DoctorID) VALUES ($1, $2, $3, $4) RETURNING *";
	const values = [date, transcript, userId, doctorId];
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
 * Get an appointment by ID
 * @param {string} appointmentId - The ID of the user
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
 * Insert a transcript for an appointment
 * @param {string} appointmentId - The ID of the appointment
 * @param {string} transcript - The transcript of the appointment
 * @returns {Promise<Object>} - A promise that resolves to the updated appointment object
 */
export const insertTranscript = (appointmentId, transcript) => {
	const query = "UPDATE Appointments SET Transcript = $1 WHERE AppointmentID = $2 RETURNING *";
	const values = [transcript, appointmentId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error inserting transcript:", err);
			throw err;
		});
};

export const updateAppointment = (appointmentId, date, transcript, userId, doctorId) => {
	const query =
		"UPDATE Appointments SET Date = $1, Transcript = $2, UserID = $3, DoctorID = $4 WHERE AppointmentID = $5 RETURNING *";
	const values = [date, transcript, userId, doctorId, appointmentId];
	return pool
		.query(query, values)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.error("Error updating appointment:", err);
			throw err;
		});
};

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
