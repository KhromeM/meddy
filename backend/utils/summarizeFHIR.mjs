import {
	createAnalyzeCategoryPrompt,
	createSummaryPrompt,
	healthSchema,
	summarySchema,
} from "../ai/prompts/summarizeRecords.mjs";
import { getModel, getModelWithCaching } from "../ai/langAi/setupVertexAI.mjs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import db from "../db/db.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const healthCategories = [
	{ name: "Metabolic Health", objName: "metabolicHealth" },
	{ name: "Heart Health", objName: "heartHealth" },
	{ name: "Gut Health", objName: "gutHealth" },
	{ name: "Brain Health", objName: "brainHealth" },
	{ name: "Immune System", objName: "immuneSystem" },
	{ name: "Musculoskeletal Health", objName: "musculoskeletalHealth" },
	{ name: "Hormonal Profile", objName: "hormonalProfile" },
];
export const summarizeFHIR = async (user, data) => {
	// ///////////////////////////////////////
	if (!data) {
		return;
		try {
			const jsonPath = path.resolve(
				__dirname,
				`../uploads/${user.userid}/ehr/ehr2.json`
			);
			data = await fs.promises.readFile(jsonPath, "utf-8");
		} catch (err) {
			console.error("Error reading patient ehr:", err);
		}
	}
	// //////////////////////////////////////
	console.log("Creating medical records for user: ", user.name);

	const sysPrompt = createAnalyzeCategoryPrompt("default");
	const fullPrompt = `${sysPrompt} \n\nUSER DATA: ${data}`;
	let model;
	if (fullPrompt.length > 100000) {
		model = await getModelWithCaching(fullPrompt); // context caching requires a minimum of 32k tokens
		console.log("USING CONTEXT CACHING");
	} else {
		model = getModel(healthSchema);
	}
	const combinedResponse = {};

	const categoryPromises = healthCategories.map(async (category) => {
		const request = {
			contents: [
				{
					role: "user",
					parts: [{ text: `**{HEALTH_CATEGORY} IS ${category.name}**\n\n` }],
				},
			],
			generationConfig: {
				maxOutputTokens: 8192,
				responseMimeType: "application/json",
				responseSchema: healthSchema,
			},
		};
		const result = await model.generateContent(request);
		const categoryResponse = JSON.parse(
			result.response.candidates[0].content.parts[0].text
		);

		return { category, response: categoryResponse };
	});

	const results = await Promise.all(categoryPromises);

	results.forEach(({ category, response }) => {
		combinedResponse[category.objName] = response;
	});

	const chatHistory = [
		{
			role: "user",
			parts: [{ text: data }],
		},
	];

	const summaryRequest = {
		contents: [
			...chatHistory,
			{
				role: "assistant",
				parts: [{ text: JSON.stringify(combinedResponse) }],
			},
		],
		systemInstruction: {
			parts: [{ text: createSummaryPrompt() }],
		},
	};
	model = getModel(summarySchema);
	const summaryResult = await model.generateContent(summaryRequest);
	const summary = JSON.parse(
		summaryResult.response.candidates[0].content.parts[0].text
	);

	combinedResponse.summary = summary;

	// console.log(JSON.stringify(combinedResponse));
	db.createMedicalRecord(user.userid, combinedResponse);
	console.log("Medical record created for user: ", user.name);
	return combinedResponse;
};

export const createTotalSummary = async (user) => {
	try {
		const records = await db.getMedicalRecordsByUserId(user.userid);
		if (records?.length == 0) return null;

		let totalRecord = records.find((record) => record.isTotal);

		const strRecords = records.map((record) => JSON.stringify(record));
		const data = strRecords.join("\n\n");
		console.log("Word count: ", data.split(" ").length * 1.5);

		const chatHistory = [
			{
				role: "user",
				parts: [{ text: data }],
			},
		];

		let generativeModel = getModel(healthSchema);
		const combinedResponse = {};

		const categoryPromises = healthCategories.map(async (category) => {
			const sysPrompt = createAnalyzeCategoryPrompt(category.name);

			const request = {
				contents: chatHistory,
				systemInstruction: {
					parts: [{ text: sysPrompt }],
				},
			};

			const result = await generativeModel.generateContent(request);
			const categoryResponse = JSON.parse(
				result.response.candidates[0].content.parts[0].text
			);

			return { category, response: categoryResponse };
		});

		const results = await Promise.all(categoryPromises);

		results.forEach(({ category, response }) => {
			combinedResponse[category.objName] = response;
		});

		const summaryRequest = {
			contents: [
				...chatHistory,
				{
					role: "assistant",
					parts: [{ text: JSON.stringify(combinedResponse) }],
				},
			],
			systemInstruction: {
				parts: [{ text: createSummaryPrompt() }],
			},
		};
		generativeModel = getModel(summarySchema);
		const summaryResult = await generativeModel.generateContent(summaryRequest);
		const summary = JSON.parse(
			summaryResult.response.candidates[0].content.parts[0].text
		);

		combinedResponse.summary = summary;

		console.log(JSON.stringify(combinedResponse));

		if (totalRecord) {
			await db.deleteMedicalRecord(totalRecord.recordid);
		}
		await db.createMedicalRecord(user.userid, combinedResponse, true);

		return combinedResponse;
	} catch (err) {
		console.error("Error in createTotalSummary:", err);
		throw err;
	}
};

summarizeFHIR({ userid: "DEVELOPER" });
// createTotalSummary({ userid: "DEVELOPER" });
// const records = await db.getMedicalRecordsByUserId("DEVELOPER");
// console.log(records);
