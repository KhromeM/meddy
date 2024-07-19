import { MedplumClient } from "@medplum/core";
const medplum = new MedplumClient();

export const getDetailsFromMedplum = async (req, res) => {
	await medplum.startClientLogin(process.env.MEDPLUM_CLIENT_ID, process.env.MEDPLUM_CLIENT_SECRET);
	const patientInfo = await medplum.readPatientEverything("efc0549c-aaf4-4d0f-95c0-72c909b2e9c2");
	console.log(patientInfo);
	res.status(200).json({ message: "getDetailsFromMedplum" });
};
