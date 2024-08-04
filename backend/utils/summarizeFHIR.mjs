import { createFHIRSummarizerPrompt } from "../ai/prompts/summarizeRecords.mjs";
import { getModel } from "../ai/langAi/setupVertexAI.mjs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const responseSchema = {
	type: "object",
	properties: {
		summary: {
			type: "string",
			description:
				"About 1000 words. A detailed summary of the patient's health status.",
		},
		metabolicHealth: {
			type: "object",
			properties: {
				score: {
					type: "number",
					description:
						"Numerical score (-1 or 0-100) for metabolic health. -1 if insufficient information.",
				},
				oneLineSummary: {
					type: "string",
					description:
						"Brief summary of metabolic health. 'NA' if insufficient information.",
				},
				thoroughSummary: {
					type: "string",
					description:
						"Detailed 4-5 line summary of metabolic health. 'NA' if insufficient information.",
				},
				goldTest: {
					type: "string",
					description:
						"Most important test for metabolic health. 'NA' if insufficient information.",
				},
				result: {
					type: "string",
					description:
						"Result of the metabolic health gold test. 'NA' if insufficient information.",
				},
				range: {
					type: "string",
					description:
						"Normal range for the metabolic health gold test. 'NA' if insufficient information.",
				},
				recommendation: {
					type: "string",
					description:
						"Health recommendation for metabolic health. 'NA' if insufficient information.",
				},
			},
			required: [
				"score",
				"oneLineSummary",
				"thoroughSummary",
				"goldTest",
				"result",
				"range",
				"recommendation",
			],
		},
		heartHealth: {
			type: "object",
			properties: {
				score: {
					type: "number",
					description:
						"Numerical score (-1 or 0-100) for heart health. -1 if insufficient information.",
				},
				oneLineSummary: {
					type: "string",
					description:
						"Brief summary of heart health. 'NA' if insufficient information.",
				},
				thoroughSummary: {
					type: "string",
					description:
						"Detailed 4-5 line summary of heart health. 'NA' if insufficient information.",
				},
				goldTest: {
					type: "string",
					description:
						"Most important test for heart health. 'NA' if insufficient information.",
				},
				result: {
					type: "string",
					description:
						"Result of the heart health gold test. 'NA' if insufficient information.",
				},
				range: {
					type: "string",
					description:
						"Normal range for the heart health gold test. 'NA' if insufficient information.",
				},
				recommendation: {
					type: "string",
					description:
						"Health recommendation for heart health. 'NA' if insufficient information.",
				},
			},
			required: [
				"score",
				"oneLineSummary",
				"thoroughSummary",
				"goldTest",
				"result",
				"range",
				"recommendation",
			],
		},
		gutHealth: {
			type: "object",
			properties: {
				score: {
					type: "number",
					description:
						"Numerical score (-1 or 0-100) for gut health. -1 if insufficient information.",
				},
				oneLineSummary: {
					type: "string",
					description:
						"Brief summary of gut health. 'NA' if insufficient information.",
				},
				thoroughSummary: {
					type: "string",
					description:
						"Detailed 4-5 line summary of gut health. 'NA' if insufficient information.",
				},
				goldTest: {
					type: "string",
					description:
						"Most important test for gut health. 'NA' if insufficient information.",
				},
				result: {
					type: "string",
					description:
						"Result of the gut health gold test. 'NA' if insufficient information.",
				},
				range: {
					type: "string",
					description:
						"Normal range for the gut health gold test. 'NA' if insufficient information.",
				},
				recommendation: {
					type: "string",
					description:
						"Health recommendation for gut health. 'NA' if insufficient information.",
				},
			},
			required: [
				"score",
				"oneLineSummary",
				"thoroughSummary",
				"goldTest",
				"result",
				"range",
				"recommendation",
			],
		},
		brainHealth: {
			type: "object",
			properties: {
				score: {
					type: "number",
					description:
						"Numerical score (-1 or 0-100) for brain health. -1 if insufficient information.",
				},
				oneLineSummary: {
					type: "string",
					description:
						"Brief summary of brain health. 'NA' if insufficient information.",
				},
				thoroughSummary: {
					type: "string",
					description:
						"Detailed 4-5 line summary of brain health. 'NA' if insufficient information.",
				},
				goldTest: {
					type: "string",
					description:
						"Most important test for brain health. 'NA' if insufficient information.",
				},
				result: {
					type: "string",
					description:
						"Result of the brain health gold test. 'NA' if insufficient information.",
				},
				range: {
					type: "string",
					description:
						"Normal range for the brain health gold test. 'NA' if insufficient information.",
				},
				recommendation: {
					type: "string",
					description:
						"Health recommendation for brain health. 'NA' if insufficient information.",
				},
			},
			required: [
				"score",
				"oneLineSummary",
				"thoroughSummary",
				"goldTest",
				"result",
				"range",
				"recommendation",
			],
		},
		immuneSystem: {
			type: "object",
			properties: {
				score: {
					type: "number",
					description:
						"Numerical score (-1 or 0-100) for immune system health. -1 if insufficient information.",
				},
				oneLineSummary: {
					type: "string",
					description:
						"Brief summary of immune system health. 'NA' if insufficient information.",
				},
				thoroughSummary: {
					type: "string",
					description:
						"Detailed 4-5 line summary of immune system health. 'NA' if insufficient information.",
				},
				goldTest: {
					type: "string",
					description:
						"Most important test for immune system health. 'NA' if insufficient information.",
				},
				result: {
					type: "string",
					description:
						"Result of the immune system health gold test. 'NA' if insufficient information.",
				},
				range: {
					type: "string",
					description:
						"Normal range for the immune system health gold test. 'NA' if insufficient information.",
				},
				recommendation: {
					type: "string",
					description:
						"Health recommendation for immune system health. 'NA' if insufficient information.",
				},
			},
			required: [
				"score",
				"oneLineSummary",
				"thoroughSummary",
				"goldTest",
				"result",
				"range",
				"recommendation",
			],
		},
		musculoskeletalHealth: {
			type: "object",
			properties: {
				score: {
					type: "number",
					description:
						"Numerical score (-1 or 0-100) for musculoskeletal health. -1 if insufficient information.",
				},
				oneLineSummary: {
					type: "string",
					description:
						"Brief summary of musculoskeletal health. 'NA' if insufficient information.",
				},
				thoroughSummary: {
					type: "string",
					description:
						"Detailed 4-5 line summary of musculoskeletal health. 'NA' if insufficient information.",
				},
				goldTest: {
					type: "string",
					description:
						"Most important test for musculoskeletal health. 'NA' if insufficient information.",
				},
				result: {
					type: "string",
					description:
						"Result of the musculoskeletal health gold test. 'NA' if insufficient information.",
				},
				range: {
					type: "string",
					description:
						"Normal range for the musculoskeletal health gold test. 'NA' if insufficient information.",
				},
				recommendation: {
					type: "string",
					description:
						"Health recommendation for musculoskeletal health. 'NA' if insufficient information.",
				},
			},
			required: [
				"score",
				"oneLineSummary",
				"thoroughSummary",
				"goldTest",
				"result",
				"range",
				"recommendation",
			],
		},
		hormonalProfile: {
			type: "object",
			properties: {
				score: {
					type: "number",
					description:
						"Numerical score (-1 or 0-100) for hormonal health. -1 if insufficient information.",
				},
				oneLineSummary: {
					type: "string",
					description:
						"Brief summary of hormonal health. 'NA' if insufficient information.",
				},
				thoroughSummary: {
					type: "string",
					description:
						"Detailed 4-5 line summary of hormonal health. 'NA' if insufficient information.",
				},
				goldTest: {
					type: "string",
					description:
						"Most important test for hormonal health. 'NA' if insufficient information.",
				},
				result: {
					type: "string",
					description:
						"Result of the hormonal health gold test. 'NA' if insufficient information.",
				},
				range: {
					type: "string",
					description:
						"Normal range for the hormonal health gold test. 'NA' if insufficient information.",
				},
				recommendation: {
					type: "string",
					description:
						"Health recommendation for hormonal health. 'NA' if insufficient information.",
				},
			},
			required: [
				"score",
				"oneLineSummary",
				"thoroughSummary",
				"goldTest",
				"result",
				"range",
				"recommendation",
			],
		},
	},
	required: [
		"summary",
		"metabolicHealth",
		"heartHealth",
		"gutHealth",
		"brainHealth",
		"immuneSystem",
		"musculoskeletalHealth",
		"hormonalProfile",
	],
};

export const summarizeFHIR = async (user) => {
	if (!user) {
		user = { userid: "DEVELOPER" };
	}
	let data;
	try {
		const jsonPath = path.resolve(
			__dirname,
			`../uploads/${user.userid}/ehr2.json`
		);
		data = await fs.promises.readFile(jsonPath, "utf-8");
	} catch (err) {
		console.error("Error reading patient ehr:", err);
	}
	console.log("Word count: ", data.split(" ").length * 1.5);
	//get data
	const chatHistory = [
		{
			role: "user",
			parts: [{ text: data }],
		},
	];
	const sysPrompt = createFHIRSummarizerPrompt();

	const request = {
		contents: chatHistory,
		systemInstruction: {
			parts: [{ text: sysPrompt }],
		},
	};
	const generativeModel = getModel(responseSchema);
	const result = await generativeModel.generateContent(request);
	const response = JSON.parse(
		result.response.candidates[0].content.parts[0].text
	);
	const respString = JSON.stringify(response);
	console.log(respString);
	fs.writeFileSync("./resp.json", respString);
	return response;
};
summarizeFHIR();
