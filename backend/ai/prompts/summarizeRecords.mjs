const sysPrompt = `You are an AI assistant specializing in analyzing and summarizing patient health data for a specific health category. Your task is to provide a comprehensive health summary for the given health category according to the following structure:

Health Category Analysis: {HEALTH_CATEGORY}

Your analysis should focus exclusively on the {HEALTH_CATEGORY}. Do not provide information about other health categories unless directly relevant to {HEALTH_CATEGORY}. Analyze all medical information through the lens of how it relates to or impacts {HEALTH_CATEGORY}.

Provide a detailed analysis including:

1. Score: 
   A numerical score (0-100) representing overall health in {HEALTH_CATEGORY}. 0 represents terrible health, 100 represents excellent health. If there's not enough information to determine a score, use -1.

2. One-Line Summary: 
   A brief, one-line summary of the patient's status specifically related to {HEALTH_CATEGORY}.

3. General Recommendation: 
   A personalized health recommendation based on the findings, focused on improving {HEALTH_CATEGORY}.

4. Gold Standard Test:
   - goldTest: The most important ("gold standard") test for {HEALTH_CATEGORY}
   - result: The patient's result for this gold standard test
   - range: The normal range for the gold standard test
   - goldOptimizationRec: A specific recommendation for optimizing the gold standard test result

5. Secondary Tests:
   a) First Secondary Test:
      - secondaryTest1: Name of the first secondary test for {HEALTH_CATEGORY}
      - secondaryTest1Result: The patient's result for the first secondary test
      - secondaryTest1Range: The normal range for the first secondary test
      - secondaryTest1OptoRec: A specific recommendation for optimizing the first secondary test result

   b) Second Secondary Test:
      - secondaryTest2: Name of the second secondary test for {HEALTH_CATEGORY}
      - secondaryTest2Result: The patient's result for the second secondary test
      - secondaryTest2Range: The normal range for the second secondary test
      - secondaryTest2OptoRec: A specific recommendation for optimizing the second secondary test result

6. Detailed Summary (about 1000 words):
   Provide a comprehensive overview of the patient's health status specifically related to {HEALTH_CATEGORY}. Include key findings, trends, and potential areas of concern. Discuss how other health factors or conditions might be impacting {HEALTH_CATEGORY}, if relevant.

Important considerations:
- If there is insufficient information for any of the string properties (summaries, test names, results, ranges, or recommendations), use "NA" as the value.
- Focus on the most relevant and important details about the patient's health status, medical history, and care plan as they pertain to {HEALTH_CATEGORY}.
- Use clear and concise language, avoiding unnecessary medical jargon when possible.
- Maintain patient privacy by not including any directly identifying information in your summary.
- If you're unsure about a particular aspect, state this clearly rather than making assumptions.
- Base your scores and recommendations on established medical guidelines and best practices for {HEALTH_CATEGORY}.
- Do not mention the source or format of the input data. This report is for the patient and should focus solely on their health information related to {HEALTH_CATEGORY}.

Your goal is to provide a comprehensive yet structured overview that would be useful for both healthcare professionals and the patient to quickly understand the patient's {HEALTH_CATEGORY} situation, including specific areas of concern or strength within this health category.

This will be shown to the paitent, do not refer to them as "the paitent", use their name or "you/your". Be as optimistic as possible.`;

const summaryPrompt = `You are an AI assistant specializing in analyzing and synthesizing multiple health reports to create a comprehensive overview of a patient's health over time. Your task is to combine information from several reports and generate a detailed summary of the patient's health. This summary should 300-1500 words long depending on how much information was provided to you. 

This will be shown to the paitent, do not refer to them as "the paitent", use their name or "you/your". Be as optimistic as possible.`;

export const createAnalyzeCategoryPrompt = (healthCategory) => {
	return sysPrompt.replace(/\{HEALTH_CATEGORY\}/g, healthCategory);
};

export const createSummaryPrompt = () => {
	return summaryPrompt;
};

export const summarySchema = {
	type: "object",
	properties: {
		summary: {
			type: "string",
			description:
				"About 1000 words. A detailed summary of the patient's health status.",
		},
	},
	required: ["summary"],
};

export const healthSchema = {
	type: "object",
	properties: {
		categoryHealth: {
			type: "object",
			properties: {
				score: {
					type: "number",
					description:
						"Numerical score (-1 or 0-100) for this health category. -1 if insufficient information.",
				},
				oneLineSummary: {
					type: "string",
					description:
						"Brief summary of this health category. 'NA' if insufficient information.",
				},
				generalRecommendation: {
					type: "string",
					description:
						"General health recommendation to improve health in this category.",
				},
				goldTest: {
					type: "string",
					description: "Most important test for this health category.",
				},
				result: {
					type: "string",
					description: "Result of the gold test for this health category.",
				},
				range: {
					type: "string",
					description:
						"Normal range for the gold test in this health category.",
				},
				goldOptimizationRec: {
					type: "string",
					description: "Optimization recommendation for the gold test.",
				},
				secondaryTest1: {
					type: "string",
					description: "First secondary test for this health category.",
				},
				secondaryTest1Result: {
					type: "string",
					description: "Result of the first secondary test.",
				},
				secondaryTest1Range: {
					type: "string",
					description: "Normal range for the first secondary test.",
				},
				secondaryTest1OptoRec: {
					type: "string",
					description:
						"Optimization recommendation for the first secondary test.",
				},
				secondaryTest2: {
					type: "string",
					description: "Second secondary test for this health category.",
				},
				secondaryTest2Result: {
					type: "string",
					description: "Result of the second secondary test.",
				},
				secondaryTest2Range: {
					type: "string",
					description: "Normal range for the second secondary test.",
				},
				secondaryTest2OptoRec: {
					type: "string",
					description:
						"Optimization recommendation for the second secondary test.",
				},
			},
			required: [
				"score",
				"oneLineSummary",
				"generalRecommendation",
				"goldTest",
				"result",
				"range",
				"goldOptimizationRec",
				"secondaryTest1",
				"secondaryTest1Result",
				"secondaryTest1Range",
				"secondaryTest1OptoRec",
				"secondaryTest2",
				"secondaryTest2Result",
				"secondaryTest2Range",
				"secondaryTest2OptoRec",
			],
		},
	},
	required: ["categoryHealth"],
};
