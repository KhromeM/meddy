import db from "../../db/db.mjs";

export const createAppointment = async (req, res) => {
	const { date, transcript, transcriptSummary, description, userId, doctorId } = req.body;
	if (!date || !userId || !doctorId) {
		return res.status(400).json({
			status: "fail",
			message:
				"date, userId, and doctorId are required. transcript, transcriptSummary, and description are optional.",
		});
	}
	try {
		const appointment = await db.createAppointment(
			date,
			transcript,
			transcriptSummary,
			description,
			userId,
			doctorId
		);
		res.status(201).json({ appointment });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not create appointment" });
	}
};

export const getAllAppointments = async (req, res) => {
	try {
		const appointments = await db.getAllAppointments();
		res.status(200).json({ appointments });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not retrieve appointments" });
	}
};

export const getAppointmentById = async (req, res) => {
	const { appointmentId } = req.params;
	if (!appointmentId) {
		return res.status(400).json({ status: "fail", message: "appointmentId is required" });
	}
	try {
		const appointment = await db.getAppointmentById(appointmentId);
		res.status(200).json({ appointment });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not retrieve appointment" });
	}
};

export const insertTranscript = async (req, res) => {
	const { appointmentId } = req.params;
	const { transcript, transcriptSummary } = req.body;
	if (!appointmentId) {
		return res.status(400).json({ status: "fail", message: "appointmentId is required" });
	}
	if (!transcript) {
		return res.status(400).json({ status: "fail", message: "transcript is required" });
	}
	try {
		const appointment = await db.insertTranscript(appointmentId, transcript, transcriptSummary);
		res.status(200).json({ appointment });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not insert transcript" });
	}
};

export const updateAppointment = async (req, res) => {
	const { appointmentId } = req.params;
	const { date, transcript, transcriptSummary, description, userId, doctorId } = req.body;
	if (!appointmentId) {
		return res.status(400).json({ status: "fail", message: "appointmentId is required" });
	}
	if (!date || !userId || !doctorId) {
		return res.status(400).json({
			status: "fail",
			message:
				"date, userId, and doctorId are required. transcript, transcriptSummary, and description are optional.",
		});
	}
	try {
		const appointment = await db.updateAppointment(
			appointmentId,
			date,
			transcript,
			transcriptSummary,
			description,
			userId,
			doctorId
		);
		res.status(200).json({ appointment });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not update appointment" });
	}
};

export const deleteAppointment = async (req, res) => {
	const { appointmentId } = req.params;
	if (!appointmentId) {
		return res.status(400).json({ status: "fail", message: "appointmentId is required" });
	}
	try {
		await db.deleteAppointment(appointmentId);
		res.status(200).json({ message: "Deleted appointment successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not delete appointment" });
	}
};
