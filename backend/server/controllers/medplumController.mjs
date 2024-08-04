import fs from "fs";
import { MedplumClient, createReference } from "@medplum/core";
import { getEpicPatient } from "./epicController.mjs";
import CONFIG from "../../config.mjs";
const medplum = new MedplumClient();
await medplum.startClientLogin(
	CONFIG.MEDPLUM_CLIENT_ID,
	CONFIG.MEDPLUM_CLIENT_SECRET
);
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPatientDetails = async (req, res) => {
	try {
		const patientId = req.params.patientId;
		const patientDetails = await retrieveCleanedPatientDetailsFromEpic(
			patientId
		);
		res.status(200).json(patientDetails);
		try {
			const user = req._dbUser;
			const jsonPath = path.resolve(
				__dirname,
				`../../uploads/${user.userid}/ehr.json`
			);
			await fs.promises.writeFile(jsonPath, JSON.stringify(patientDetails));
		} catch (err) {
			console.error("Error writing patient details to file:", err);
		}
	} catch (err) {
		console.error("Error fetching patient details:", err);
		res
			.status(500)
			.json({ status: "fail", message: "Failed to fetch patient details" });
	}
};

export const retrieveCleanedPatientDetailsFromEpic = async (patientId) => {
	// Retrieve the patient from Epic
	const epicClient = await getEpicPatient(medplum, patientId);
	const medplumPatient = await medplum.searchResources(
		"Patient",
		`identifier=${patientId}`
	);
	const medplumId = medplumPatient[0].id;

	// Retrieve the patient's medical data from Epic and store it in Medplum
	const resourceTypes = ["DiagnosticReport", "MedicationRequest", "Procedure"];
	await retreiveExternalResources(
		epicClient,
		medplum,
		patientId,
		medplumPatient,
		resourceTypes
	);

	// Retrieve and parse patient details from Medplum
	const patientInfo = await medplum.readPatientEverything(medplumId);
	const parsedInfo = parseFHIRResponse(patientInfo);

	// Create directory if it doesn't exist
	const directoryPath = `./uploads/patient-${medplumId}`;
	fs.mkdirSync(directoryPath, { recursive: true });

	// Save patient details
	const medplumInfoPath = `${directoryPath}/medplumInfo.json`;
	const medplumInfo = JSON.stringify(parsedInfo, null, 2);
	fs.writeFileSync(medplumInfoPath, medplumInfo);
	return parsedInfo;
};

async function retreiveExternalResources(
	client,
	medplum,
	patientId,
	medplumPatient,
	resourceTypes
) {
	for (const resourceType of resourceTypes) {
		const resources = await client.search(resourceType, `patient=${patientId}`);
		for (const entry of resources.entry) {
			const resource = entry.resource;
			if (!resource.identifier) continue;
			resource.subject = createReference(medplumPatient[0]);
			await medplum.createResourceIfNoneExist(
				resource,
				`identifier=${resource.identifier[0].value}`
			);
		}
	}
}

function parseFHIRResponse(patientInfo) {
	const result = {
		resourceTypes: {},
	};

	patientInfo.entry.forEach((entry) => {
		const resource = entry.resource;
		const resourceType = resource.resourceType;

		// Skip CareTeam, DiagnosticReport, Media, and Provenance resources
		if (["CareTeam", "Media", "Provenance"].includes(resourceType)) {
			return;
		}

		if (!result.resourceTypes[resourceType]) {
			result.resourceTypes[resourceType] = [];
		}

		const processedResource = {
			type: resourceType,
		};

		// Process common fields
		if (resource.display) {
			processedResource.display = resource.code.coding[0].display;
		}
		if (resource.effectiveDateTime) {
			processedResource.date = resource.effectiveDateTime;
		} else if (resource.period && resource.period.start) {
			processedResource.date = resource.period.start;
		} else if (resource.authoredOn) {
			processedResource.date = resource.authoredOn;
		}
		if (resource.valueCodeableConcept) {
			processedResource.value = resource.valueCodeableConcept.coding[0].display;
		}

		// Process resource-specific fields
		switch (resourceType) {
			case "Patient":
				processedResource.name =
					resource.name[0].given.join(" ") + " " + resource.name[0].family;
				processedResource.gender = resource.gender;
				processedResource.birthDate = resource.birthDate;
				processedResource.address =
					resource.address[0].line.join(", ") +
					", " +
					resource.address[0].city +
					", " +
					resource.address[0].state +
					" " +
					resource.address[0].postalCode;
				if (resource.extension) {
					resource.extension.forEach((ext) => {
						if (ext.url.includes("us-core-race")) {
							processedResource.race = ext.extension.find(
								(e) => e.url === "text"
							).valueString;
						} else if (ext.url.includes("us-core-ethnicity")) {
							processedResource.ethnicity = ext.extension.find(
								(e) => e.url === "text"
							).valueString;
						} else if (ext.url.includes("us-core-birthsex")) {
							processedResource.birthSex = ext.valueCode;
						}
					});
				}
				break;
			case "RelatedPerson":
				processedResource.name =
					resource.name[0].given.join(" ") + " " + resource.name[0].family;
				if (resource.relationship && resource.relationship.length > 0) {
					processedResource.relation =
						resource.relationship[0].coding[0].display;
				}
				break;
			case "Observation":
				if (resource.category) {
					processedResource.category = resource.category[0].coding[0].display;
				}
				break;
			case "Immunization":
				processedResource.vaccineCode = resource.vaccineCode.coding[0].display;
				break;
			case "Procedure":
				if (resource.code && resource.code.text) {
					processedResource.procedureDescription = resource.code.text;
					if (resource.performedPeriod) {
						processedResource.startDate = resource.performedPeriod.start;
						processedResource.endDate = resource.performedPeriod.end;
					}
					if (resource.reasonReference && resource.reasonReference[0].display) {
						processedResource.reason = resource.reasonReference[0].display;
					}
				} else {
					return;
				}
				break;
			case "Condition":
				processedResource.onsetDate = resource.onsetDateTime;
				processedResource.abatementDate = resource.abatementDateTime;
				processedResource.clinicalStatus =
					resource.clinicalStatus.coding[0].code;
				break;
			case "Encounter":
				processedResource.class = resource.class.code;
				if (resource.reasonCode) {
					processedResource.reason = resource.reasonCode[0].coding[0].display;
				} else {
					return;
				}
				break;
			case "DocumentReference":
				processedResource.status = resource.status;
				processedResource.category = resource.category[0].coding[0].display;
				processedResource.date = resource.date;
				processedResource.content = atob(resource.content[0].attachment.data);
				break;
			case "MedicationRequest":
				processedResource.status = resource.status;
				processedResource.intent = resource.intent;
				if (
					resource.medicationReference &&
					resource.medicationReference.display
				) {
					processedResource.medication = resource.medicationReference.display;
				}
				if (
					resource.dosageInstruction &&
					resource.dosageInstruction[0] &&
					resource.dosageInstruction[0].text
				) {
					processedResource.dosageInstructions =
						resource.dosageInstruction[0].text;
				}
				if (resource.requester) {
					processedResource.prescribingDoctor = resource.requester.display;
				}
				if (resource.reasonReference) {
					processedResource.reason = resource.reasonReference[0].reference;
				}
				break;
			case "CarePlan":
				processedResource.status = resource.status;
				processedResource.intent = resource.intent;
				if (resource.category) {
					processedResource.category = resource.category.map(
						(cat) => cat.coding[0].display || cat.coding[0].code
					);
				}
				if (resource.activity) {
					processedResource.activities = resource.activity.map((act) => ({
						code: act.detail.code.coding[0].code,
						display: act.detail.code.coding[0].display,
						status: act.detail.status,
					}));
				}
				if (resource.addresses) {
					processedResource.addresses = resource.addresses.map(
						(addr) => addr.reference
					);
				}
				break;
			case "DiagnosticReport":
				if (resource.conclusionCode && resource.conclusionCode.length > 0) {
					const display = resource.conclusionCode[0].coding.find(
						(coding) => coding.display
					)?.display;
					if (display) {
						processedResource.finding = display;
					} else {
						return;
					}
				} else {
					return;
				}
				break;
			case "Appointment":
				processedResource.startDate = resource.start;
				processedResource.endDate = resource.end;
				processedResource.status = resource.status;
				processedResource.id = resource.id;
				break;
		}

		if (resource.location) {
			processedResource.location =
				resource.location.display || resource.location[0].location.display;
		}

		result.resourceTypes[resourceType].push(processedResource);
	});

	return result;
}

export const createAppointment = async (patientId, appointment) => {
	const medplumPatient = await medplum.searchResources(
		"Patient",
		`identifier=${patientId}`
	);
	appointment.participant = [
		{
			actor: createReference(medplumPatient[0]),
			status: "accepted",
		},
	];
	await medplum.createResource(appointment);
	return appointment;
};

export const updateAppointment = async (
	appointmentId,
	startDate,
	endDate,
	description
) => {
	const appointment = await medplum.readResource("Appointment", appointmentId);
	appointment.start = startDate;
	appointment.end = endDate;
	appointment.description = description;
	await medplum.updateResource(appointment);
	return appointment;
};

export const deleteAppointment = async (appointmentId) => {
	const response = await medplum.deleteResource("Appointment", appointmentId);
	return response;
};
