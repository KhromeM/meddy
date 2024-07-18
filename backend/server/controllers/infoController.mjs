import db from "../../db/db.mjs";

// Medication
export const createMedication = async (req, res) => {
	const { userId, name, dosage } = req.body;

	if (!userId || !name || !dosage) {
		return res.status(400).json({
			status: "fail",
			message: "userId, name, and dosage are required.",
		});
	}

	try {
		const medication = await db.createMedication(userId, name, dosage);
		res.status(201).json({ medication });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not create medication" });
	}
};

export const getAllMedications = async (req, res) => {
	try {
		const medications = await db.getAllMedications();
		res.status(200).json({ medications });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not retrieve medications" });
	}
};

export const getMedicationById = async (req, res) => {
	const { medicationId } = req.params;

	if (!medicationId) {
		return res.status(400).json({ status: "fail", message: "medicationId is required" });
	}

	try {
		const medication = await db.getMedicationById(medicationId);
		res.status(200).json({ medication });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not retrieve medication" });
	}
};

export const updateMedication = async (req, res) => {
	const { medicationId } = req.params;
	const { userId, name, dosage } = req.body;

	if (!medicationId || !userId || !name || !dosage) {
		return res.status(400).json({
			status: "fail",
			message: "medicationId, userId, name, and dosage are required.",
		});
	}

	try {
		const medication = await db.updateMedication(medicationId, userId, name, dosage);
		res.status(200).json({ medication });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not update medication" });
	}
};

export const deleteMedication = async (req, res) => {
	const { medicationId } = req.params;

	if (!medicationId) {
		return res.status(400).json({ status: "fail", message: "medicationId is required" });
	}

	try {
		const medication = await db.deleteMedication(medicationId);
		res.status(200).json({ medication });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not delete medication" });
	}
};

// Reminders
export const createReminder = async (req, res) => {
	const { userId, medicationName, hoursUntilRepeat, time } = req.body;

	if (!userId || !medicationName || !hoursUntilRepeat || !time) {
		return res.status(400).json({
			status: "fail",
			message: "userId, medicationName, hoursUntilRepeat, and time are required.",
		});
	}

	try {
		const reminder = await db.createReminder(userId, medicationName, hoursUntilRepeat, time);
		res.status(201).json({ reminder });
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: "error",
			message: "An error occurred while creating the reminder.",
		});
	}
};

export const getAllReminders = async (req, res) => {
	try {
		const reminders = await db.getAllReminders();
		res.status(200).json({ reminders });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not retrieve reminders" });
	}
};

export const getReminderById = async (req, res) => {
	const { reminderId } = req.params;

	if (!reminderId) {
		return res.status(400).json({ status: "fail", message: "reminderId is required" });
	}

	try {
		const reminder = await db.getReminderById(reminderId);
		res.status(200).json({ reminder });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not retrieve reminder" });
	}
};

export const updateReminder = async (req, res) => {
	const { reminderId } = req.params;
	const { userId, medicationName, hoursUntilRepeat, time } = req.body;

	if (!reminderId || !userId || !medicationName || !hoursUntilRepeat || !time) {
		return res.status(400).json({
			status: "fail",
			message: "reminderId, userId, medicationName, hoursUntilRepeat, and time are required.",
		});
	}

	try {
		const updatedReminder = await db.updateReminder(
			reminderId,
			userId,
			medicationName,
			hoursUntilRepeat,
			time
		);
		if (!updatedReminder) {
			return res.status(404).json({ status: "fail", message: "Reminder not found" });
		}
		res.status(200).json({ message: "Updated reminder successfully", data: updatedReminder });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not update reminder" });
	}
};

export const deleteReminder = async (req, res) => {
	const { reminderId } = req.params;

	if (!reminderId) {
		return res.status(400).json({ status: "fail", message: "reminderId is required" });
	}

	try {
		await db.deleteReminder(reminderId);
		res.status(200).json({ message: "Deleted reminder successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not delete reminder" });
	}
};

// Allergies
export const createAllergy = async (req, res) => {
	const { userId, name } = req.body;

	if (!userId || !name) {
		return res.status(400).json({
			status: "fail",
			message: "userId and name are required.",
		});
	}

	try {
		const allergy = await db.createAllergy(userId, name);
		res.status(201).json({ allergy });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not create allergy" });
	}
};

export const getAllAllergies = async (req, res) => {
	try {
		const allergies = await db.getAllAllergies();
		res.status(200).json({ allergies });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not retrieve allergies" });
	}
};

export const getAllergyById = async (req, res) => {
	const { allergyId } = req.params;

	if (!allergyId) {
		return res.status(400).json({ status: "fail", message: "allergyId is required" });
	}

	try {
		const allergy = await db.getAllergyById(allergyId);
		res.status(200).json({ allergy });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not retrieve allergy" });
	}
};

export const updateAllergy = async (req, res) => {
	const { allergyId } = req.params;
	const { userId, name } = req.body;

	if (!allergyId) {
		return res.status(400).json({ status: "fail", message: "allergyId is required" });
	}

	if (!userId || !name) {
		return res.status(400).json({
			status: "fail",
			message: "userId and name are required.",
		});
	}

	try {
		const allergy = await db.updateAllergy(allergyId, userId, name);
		res.status(200).json({ allergy });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not update allergy" });
	}
};

export const deleteAllergy = async (req, res) => {
	const { allergyId } = req.params;

	if (!allergyId) {
		return res.status(400).json({ status: "fail", message: "allergyId is required" });
	}

	try {
		await db.deleteAllergy(allergyId);
		res.status(200).json({ message: "Deleted allergy successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not delete allergy" });
	}
};

// Conditions
export const createCondition = async (req, res) => {
	const { userId, name } = req.body;

	if (!userId || !name) {
		return res.status(400).json({
			status: "fail",
			message: "userId and name are required.",
		});
	}

	try {
		const condition = await db.createCondition(userId, name);
		res.status(201).json({ condition });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not create condition" });
	}
};

export const getAllConditions = async (req, res) => {
	try {
		const conditions = await db.getAllConditions();
		res.status(200).json({ conditions });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not retrieve conditions" });
	}
};

export const getConditionById = async (req, res) => {
	const { conditionId } = req.params;

	if (!conditionId) {
		return res.status(400).json({ status: "fail", message: "conditionId is required" });
	}

	try {
		const condition = await db.getConditionById(conditionId);
		res.status(200).json({ condition });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not retrieve condition" });
	}
};

export const updateCondition = async (req, res) => {
	const { conditionId } = req.params;
	const { userId, name } = req.body;

	if (!conditionId) {
		return res.status(400).json({ status: "fail", message: "conditionId is required" });
	}

	if (!userId || !name) {
		return res.status(400).json({
			status: "fail",
			message: "userId and name are required.",
		});
	}

	try {
		const condition = await db.updateCondition(conditionId, userId, name);
		res.status(200).json({ condition });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not update condition" });
	}
};

export const deleteCondition = async (req, res) => {
	const { conditionId } = req.params;

	if (!conditionId) {
		return res.status(400).json({ status: "fail", message: "conditionId is required" });
	}

	try {
		await db.deleteCondition(conditionId);
		res.status(200).json({ message: "Deleted condition successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not delete condition" });
	}
};
