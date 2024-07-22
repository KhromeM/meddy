import { MedplumClient } from "@medplum/core";
import { createPrivateKey, randomBytes } from "crypto";
import { SignJWT } from "jose";
import fetch from "node-fetch";

export const getEpicPatient = async (medplum, epicPatientId) => {
	const privateKeyString = process.env.EPIC_PRIVATE_KEY;
	const clientId = process.env.EPIC_CLIENT_ID;
	if (!privateKeyString || !clientId) return undefined;

	const privateKey = createPrivateKey(privateKeyString);
	const baseUrl = "https://fhir.epic.com/interconnect-fhir-oauth/";
	const tokenUrl = "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token";
	const fhirUrlPath = "api/FHIR/R4/";

	// Construct Epic MedplumClient base
	const epicClient = new MedplumClient({
		fetch,
		baseUrl,
		tokenUrl,
		fhirUrlPath,
		clientId,
	});

	// Construct JWT assertion
	const jwt = await new SignJWT({})
		.setProtectedHeader({ alg: "RS384", typ: "JWT" })
		.setIssuer(clientId)
		.setSubject(clientId)
		.setAudience(tokenUrl)
		.setJti(randomBytes(16).toString("hex"))
		.setIssuedAt()
		.setExpirationTime("5m")
		.sign(privateKey);

	// Start the JWT assertion login
	await epicClient.startJwtAssertionLogin(jwt);

	// Read resource
	const patient = await epicClient.readResource("Patient", epicPatientId);
	if (!patient) throw new Error(`Failed to find the given Epic patient ID: ${epicPatientId}`);

	// Create resource for Epic patient in local Medplum repository
	await medplum.createResourceIfNoneExist(patient, `identifier=${epicPatientId}`);
	return patient;
};
