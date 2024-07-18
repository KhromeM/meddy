import db from "../../db/db.mjs";

export const createDoctor = async (req, res) => {
	const { doctorId, name } = req.body;

	if (!doctorId) {
		return res.status(400).json({ status: "fail", message: "Doctor ID is required" });
	}

	if (!name) {
		return res.status(400).json({ status: "fail", message: "Name is required" });
	}

	try {
		const doctor = await db.createDoctor(doctorId, name);
		res.status(201).json({ doctor });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not create doctor" });
	}
};

export const getDoctorById = async (req, res) => {
	const { doctorId } = req.params;

	if (!doctorId) {
		return res.status(400).json({ status: "fail", message: "Doctor ID is required" });
	}

	try {
		const doctor = await db.getDoctorById(doctorId);
		res.status(200).json({ doctor });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not retrieve doctor" });
	}
};

export const updateDoctor = async (req, res) => {
	const { doctorId } = req.params;
	const { name } = req.body;

	if (!doctorId) {
		return res.status(400).json({ status: "fail", message: "Doctor ID is required" });
	}

	if (!name) {
		return res.status(400).json({ status: "fail", message: "Name is required" });
	}

	try {
		const doctor = await db.updateDoctor(doctorId, name);
		res.status(200).json({ doctor });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: "fail", message: "Could not update doctor" });
	}
};
