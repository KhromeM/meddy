const stage1Prompt = (data, condition) => `
You are the first stage in a 6-stage medical research pipeline:
1. Data Scanning and Pattern Identification (current stage)
2. Pattern Connection and Low Probability Inference
3. Probability Assessment and Confidence Ranking
4. Focused Analysis and Prediction Refinement
5. Final Report Generation
6. JSON Formatting and File Output

Your specific task is to scan the provided medical data and list out all observable patterns, trends, and anomalies that could be relevant to ${condition}. Do not make any interpretations or diagnoses at this stage, as this will be done in later stages.

Focus on:
1. Identifying recurring values or trends in numeric data that might relate to ${condition}
2. Noting any unusual or outlier values that could be significant for ${condition}
3. Recognizing patterns in categorical data that might be relevant to ${condition}
4. Highlighting any missing or potentially erroneous data that could affect the analysis of ${condition}

Provide your findings in a clear, bullet-point format. Be thorough and objective, listing ALL patterns you observe that could potentially relate to ${condition}, without filtering for relevance.

Your output should be 250 - 500 words.

Full patient data:
${JSON.stringify(data, null, 2)}

Your output will be passed to the next stage for further analysis.
`;

const stage2Prompt = (stage1Output, data, condition) => `
You are the second stage in a 6-stage medical research pipeline:
1. Data Scanning and Pattern Identification (completed)
2. Pattern Connection and Low Probability Inference (current stage)
3. Probability Assessment and Confidence Ranking
4. Focused Analysis and Prediction Refinement
5. Final Report Generation
6. JSON Formatting and File Output

You have received the output from Stage 1, which contains a list of observed patterns in the user's medical data potentially relevant to ${condition}. Your task is to connect these patterns and make low probability inferences specifically related to ${condition}. Consider potential relationships between different data points, even if they seem unlikely. Think creatively and broadly about how these patterns might relate to ${condition}.

Focus on:
1. Identifying potential correlations between different patterns that could be indicative of ${condition}
2. Suggesting possible causal relationships related to ${condition}, no matter how unlikely
3. Hypothesizing about underlying mechanisms of ${condition} that could explain multiple patterns
4. Considering rare or unusual manifestations of ${condition} that fit the data

Present your inferences in a numbered list, explaining the reasoning behind each one and its potential connection to ${condition}. Don't filter out any ideas at this stage - include all possibilities, no matter how improbable they might seem.

Stage 1 Output:
${stage1Output}

Your output should be 250 - 500 words.

Full patient data:
${JSON.stringify(data, null, 2)}

Your output will be passed to the next stage for further analysis.
`;

const stage3Prompt = (stage1Output, stage2Output, data, condition) => `
You are the third stage in a 6-stage medical research pipeline:
1. Data Scanning and Pattern Identification (completed)
2. Pattern Connection and Low Probability Inference (completed)
3. Probability Assessment and Confidence Ranking (current stage)
4. Focused Analysis and Prediction Refinement
5. Final Report Generation
6. JSON Formatting and File Output

You have received output from Stage 2, which contains a list of potential inferences and hypotheses based on patterns in the user's medical data, specifically related to ${condition}. Your task is to assess the probability of each inference and rank them based on your confidence in their relevance to ${condition}. Use your medical knowledge to evaluate the likelihood of each hypothesis.

Focus on:
1. Assigning a probability score (0-100%) to each inference based on its likelihood of being related to ${condition}
2. Ranking the inferences from most to least likely in terms of their relevance to ${condition}
3. Providing a brief explanation for each probability assessment, considering the specifics of ${condition}
4. Identifying which inferences warrant further investigation in the context of ${condition}

Present your assessment in a table format with columns for rank, inference, probability score, and explanation. Avoid doing the detailed analysis that will be performed in the next stage.

Stage 1 Output:
${stage1Output}

Stage 2 Output:
${stage2Output}

Your output should be 250 - 500 words.

Full patient data:
${JSON.stringify(data, null, 2)}

Your output will be passed to the next stage for further analysis.
`;

const stage4Prompt = (
	stage1Output,
	stage2Output,
	stage3Output,
	data,
	condition
) => `
You are the fourth stage in a 6-stage medical research pipeline:
1. Data Scanning and Pattern Identification (completed)
2. Pattern Connection and Low Probability Inference (completed)
3. Probability Assessment and Confidence Ranking (completed)
4. Focused Analysis and Prediction Refinement (current stage)
5. Final Report Generation
6. JSON Formatting and File Output

You have received output from Stage 3, which contains a ranked list of inferences with probability scores related to ${condition}. Your task is to narrow the focus to the most probable inferences and refine the predictions specifically for ${condition}. Concentrate on the top-ranked hypotheses and develop them further.

Focus on:
1. Selecting the top 3-5 most probable inferences related to ${condition}
2. Diving deeper into these selected inferences, considering their specific relevance to ${condition}
3. Identifying additional data that could confirm or refute these hypotheses in the context of ${condition}
4. Refining predictions based on this focused analysis, specifically for ${condition}
5. Considering potential interactions between the most likely inferences and how they might collectively indicate the presence or risk of ${condition}

Provide a detailed analysis for each selected inference, including potential implications for ${condition} and any recommended follow-up actions or tests specific to ${condition}. Avoid generating the final report or user message, as this will be done in the next stage.

Your output should be 250 - 500 words.

Stage 1 Output:
${stage1Output}

Stage 2 Output:
${stage2Output}

Stage 3 Output:
${stage3Output}

Full patient data:
${JSON.stringify(data, null, 2)}

Your output will be passed to the final stage for report generation.
`;

const stage5Prompt = (
	stage1Output,
	stage2Output,
	stage3Output,
	stage4Output,
	data,
	condition
) => `
You are the fifth stage in a 6-stage medical research pipeline:
1. Data Scanning and Pattern Identification (completed)
2. Pattern Connection and Low Probability Inference (completed)
3. Probability Assessment and Confidence Ranking (completed)
4. Focused Analysis and Prediction Refinement (completed)
5. Final Report Generation (current stage)
6. JSON Formatting and File Output

You have received output from all previous stages. Your task is to synthesize all the information and generate a comprehensive, user-friendly report specifically addressing ${condition}. 

Focus on:
1. Summarizing the key findings from all previous stages as they relate to ${condition}
2. Presenting the most likely health scenarios based on the data, specifically in the context of ${condition}
3. Providing clear, actionable recommendations for managing or preventing ${condition}
4. Emphasizing positive aspects of the user's health in relation to ${condition}
5. Framing any risks related to ${condition} as opportunities for proactive health management


Stage 1 Output:
${stage1Output}

Stage 2 Output:
${stage2Output}

Stage 3 Output:
${stage3Output}

Stage 4 Output:
${stage4Output}

Full patient data:
${JSON.stringify(data, null, 2)}

Your output should be 250 - 500 words.`;

const stage6Prompt = (stage5Output, condition) => `
You are the final stage in a 6-stage medical research pipeline:
1. Data Scanning and Pattern Identification (completed)
2. Pattern Connection and Low Probability Inference (completed)
3. Probability Assessment and Confidence Ranking (completed)
4. Focused Analysis and Prediction Refinement (completed)
5. Final Report Generation (completed)
6. JSON Formatting and File Output (current stage)

Your task is to take the output from Stage 5 and format it into a structured JSON object. The content should remain unchanged, but organized into the specified JSON format.

Stage 5 Output:
${stage5Output}

Please format the above output into the following JSON structure:

{
  "detailedReport": "Comprehensive markdown report on the user's health in relation to ${condition}",
  "recommendations": ["List of gentle, actionable health recommendations for managing or preventing ${condition}"],
  "limitations": "Any limitations or caveats in the analysis specific to ${condition}",
  "riskAssessment": "Overall risk evaluation (0-10) for ${condition} with context to avoid alarm",
  "userMessage": "1-2 sentances for the user about their health in relation to ${condition}",
  "confidence": "Overall confidence in the assessment of ${condition} (low/medium/high)"
}
  Remember, your paramount duty is to inform without causing fear or alarm. Always err on the side of reassurance while maintaining honesty about ${condition}.

Ensure that all relevant information from the Stage 5 output is included in the appropriate sections of the JSON object.

CRITICAL: ONLY OUTPUT VALID JSON. 
YOUR WHOLE OUTPUT SHOULD BE ABLED TO BE PARSED AS VALID JSON.
`;

const stage7Prompt = (finalOutput, condition) =>
	`Your task is to take the input and format it into a structured JSON object. The content should remain unchanged, but organized into the specified JSON format.

Input:
${stage5Output}

Please format the above input into the following JSON structure:

{
  "detailedReport": "Comprehensive markdown report on the user's health in relation to ${condition}",
  "recommendations": ["List of gentle, actionable health recommendations for managing or preventing ${condition}"],
  "limitations": "Any limitations or caveats in the analysis specific to ${condition}",
  "riskAssessment": "Overall risk evaluation (0-10) for ${condition} with context to avoid alarm",
  "userMessage": "1-2 sentances for the user about their health in relation to ${condition}",
  "confidence": "Overall confidence in the assessment of ${condition} (low/medium/high)"
}
CRITICAL: ONLY OUTPUT VALID JSON.  YOU FAILED AT THIS BEFORE, THIS TIME THIS MUST BE PERFECT JSON!
YOUR WHOLE OUTPUT SHOULD BE ABLED TO BE PARSED AS VALID JSON.`;

async function runPipeline(data, condition) {
	const stage1Result = await runStage(stage1Prompt(data, condition));
	console.log("Stage 1 done", stage1Result.length);

	const stage2Result = await runStage(
		stage2Prompt(stage1Result, data, condition)
	);
	console.log("Stage 2 done", stage2Result.length);

	const stage3Result = await runStage(
		stage3Prompt(stage1Result, stage2Result, data, condition)
	);
	console.log("Stage 3 done", stage3Result.length);

	const stage4Result = await runStage(
		stage4Prompt(stage1Result, stage2Result, stage3Result, data, condition)
	);
	console.log("Stage 4 done", stage4Result.length);

	const stage5Result = await runStage(
		stage5Prompt(
			stage1Result,
			stage2Result,
			stage3Result,
			stage4Result,
			data,
			condition
		)
	);
	console.log("Stage 5 done", stage5Result.length);

	// Write stage 5 result to file
	fs.writeFileSync("./stage5.txt", stage5Result);

	let finalReport = await runStage(stage6Prompt(stage5Result, condition));
	try {
		return JSON.parse(finalReport);
	} catch (err) {
		console.log("Final report1: ", finalReport);
		console.log("Failed Once");
		try {
			finalReport = await runStage(stage7Prompt(finalReport, condition));
			console.log("Final report2: ", finalReport);
			return JSON.parse(finalReport);
		} catch {
			console.log("Failed twice");
		}
	}
}

import { getChatResponse } from "../langAi/chatStream.mjs";
import { vertexAIModel } from "../langAi/model.mjs";
import fs from "fs";

async function runStage(prompt) {
	const researcher = { userid: "RESEARCHER", name: "RESEARCHER" };
	return await getChatResponse(
		[{ source: "user", text: prompt }],
		researcher,
		vertexAIModel,
		5
	);
}

const patientData = JSON.parse(
	fs.readFileSync("tests/test_assets/patient1.json", "utf-8")
);

const condition = "Heart disease"; // Or any other condition you want to research

runPipeline(patientData, condition)
	.then((finalReport) => console.log("Final Report:", finalReport))
	.catch((error) => console.error("Error:", error));
