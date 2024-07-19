import { MedplumClient } from "@medplum/core";
const medplum = new MedplumClient();
await medplum.startClientLogin(process.env.MEDPLUM_CLIENT_ID, process.env.MEDPLUM_CLIENT_SECRET);

export const getPatientDetails = async (req, res) => {
	const patientId = req.params.patientId;
	const patientInfo = await medplum.readPatientEverything(patientId);
	res.status(200).json(patientInfo);
};
