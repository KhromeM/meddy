import fs from "fs";
import { MedplumClient } from "@medplum/core";
import { getEpicPatient } from "./epicController.mjs";
const medplum = new MedplumClient();
await medplum.startClientLogin(process.env.MEDPLUM_CLIENT_ID, process.env.MEDPLUM_CLIENT_SECRET);

export const getPatientDetails = async (req, res) => {
	try {
		// Get Epic info
		const epicPatient = await getEpicPatient(medplum, "erXuFYUfucBZaryVksYEcMg3");
		console.log(epicPatient);

		// Retrieve and parse patient details from Medplum
		const patientId = req.params.patientId;
		const patientInfo = await medplum.readPatientEverything(patientId);
		const parsedInfo = parsePatientInfo(patientInfo);

		// Create directory if it doesn't exist
		const directoryPath = `./uploads/patient-${patientId}`;
		fs.mkdirSync(directoryPath, { recursive: true });

		// Save patient details
		const medplumInfoPath = `${directoryPath}/medplumInfo.json`;
		const medplumInfo = JSON.stringify(parsedInfo, null, 2);
		fs.writeFileSync(medplumInfoPath, medplumInfo);

		res.status(200).json(parsedInfo);
	} catch (err) {
		console.error("Error fetching patient details from Medplum:", err);
		res.status(500).json({ status: "fail", message: "Failed to fetch patient details from Medplum" });
	}
};

function parsePatientInfo(patientInfo) {
	const result = {
		resourceTypes: {},
	};

	patientInfo.entry.forEach((entry) => {
		const resource = entry.resource;
		const resourceType = resource.resourceType;

		// Skip CareTeam, DiagnosticReport, Media, and Provenance resources
		if (["CareTeam", "DiagnosticReport", "Media", "Provenance"].includes(resourceType)) {
			return;
		}

		if (!result.resourceTypes[resourceType]) {
			result.resourceTypes[resourceType] = [];
		}

		const processedResource = {
			type: resourceType,
		};

		// Process common fields
		if (resource.code) {
			processedResource.code = resource.code.coding[0].code;
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
				processedResource.name = resource.name[0].given.join(" ") + " " + resource.name[0].family;
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
							processedResource.race = ext.extension.find((e) => e.url === "text").valueString;
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
				processedResource.name = resource.name[0].given.join(" ") + " " + resource.name[0].family;
				if (resource.relationship && resource.relationship.length > 0) {
					processedResource.relation = resource.relationship[0].coding[0].display;
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
				if (resource.performedPeriod) {
					processedResource.startDate = resource.performedPeriod.start;
					processedResource.endDate = resource.performedPeriod.end;
				}
				if (resource.reasonReference) {
					processedResource.reason = resource.reasonReference[0].display;
				}
				break;
			case "Condition":
				processedResource.onsetDate = resource.onsetDateTime;
				processedResource.abatementDate = resource.abatementDateTime;
				processedResource.clinicalStatus = resource.clinicalStatus.coding[0].code;
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
				if (resource.medicationReference) {
					processedResource.medicationId = resource.medicationReference.reference.split("/")[1];
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
					processedResource.addresses = resource.addresses.map((addr) => addr.reference);
				}
				break;
		}

		if (resource.location) {
			processedResource.location = resource.location.display || resource.location[0].location.display;
		}

		result.resourceTypes[resourceType].push(processedResource);
	});

	return result;
}
