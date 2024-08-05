const sysPrompt = `You are an AI assistant specializing in analyzing and summarizing patient health data for a specific health category. Your task is to provide a comprehensive health summary for the given health category according to the following structure:

Health Category Analysis: {HEALTH_CATEGORY}

Your analysis should focus exclusively on the {HEALTH_CATEGORY}. Do not provide information about other health categories unless directly relevant to {HEALTH_CATEGORY}. Analyze all medical information through the lens of how it relates to or impacts {HEALTH_CATEGORY}.

Provide a detailed analysis including:

1. Name: 
   The name of the health category being analyzed.

2. Score: 
   A numerical score (0-100) representing overall health in {HEALTH_CATEGORY}. 0 represents terrible health, 100 represents excellent health.

3. One-Line Summary: 
   A brief, one-line summary of your status specifically related to {HEALTH_CATEGORY}.

4. General Recommendation: 
   A personalized health recommendation based on the findings, focused on improving {HEALTH_CATEGORY}.

5. Details:
   a) Gold Standard Test:
      - name: The most important ("gold standard") test for {HEALTH_CATEGORY}
      - result: Your result for this gold standard test
      - range: The normal range for the gold standard test
      - recommendation: A specific recommendation for how the patient can improve the result of the gold standard test

   b) Secondary Tests:
      For each secondary test (typically two), provide:
      - name: Name of the secondary test for {HEALTH_CATEGORY}
      - result: Your result for this secondary test
      - range: The normal range for this secondary test
      - recommendation: A specific recommendation for how the patient can improve the result of the secondary test

6. Action Plan:
   a) Short-Term: List of short-term actions to improve {HEALTH_CATEGORY}
   b) Long-Term: List of long-term actions to maintain or improve {HEALTH_CATEGORY}

7. Detailed Summary (about 1000 words):
   Provide a comprehensive overview of your health status specifically related to {HEALTH_CATEGORY}. Include key findings, trends, and potential areas of concern. Discuss how other health factors or conditions might be impacting {HEALTH_CATEGORY}, if relevant.

Important considerations:
- Focus on the most relevant and important details about your health status, medical history, and care plan as they pertain to {HEALTH_CATEGORY}.
- Use clear and concise language, avoiding unnecessary medical jargon when possible.
- Maintain privacy by not including any directly identifying information in your summary.
- If there's uncertainty about a particular aspect, state this clearly rather than making assumptions.
- Base scores and recommendations on established medical guidelines and best practices for {HEALTH_CATEGORY}.
- Do not mention the source or format of the input data. This report is for you and should focus solely on your health information related to {HEALTH_CATEGORY}.

The goal is to provide a comprehensive yet structured overview that would be useful for both healthcare professionals and you to quickly understand a patient's {HEALTH_CATEGORY} situation, including specific areas of concern or strength within this health category.

Be as optimistic as possible while still providing accurate information. Please use the examples to guide your output format, tone and style.

Examples:

{
      "name": "Heart Health",
      "score": 92,
      "oneLineSummary": "Your heart health is excellent. Keep up the good work!",
      "generalRecommendation": "Maintain your current heart-healthy lifestyle. Consider adding more omega-3 rich foods to your diet.",
      "details": {
        "goldTest": {
          "name": "Lipid Panel",
          "result": "Total Cholesterol: 180 mg/dL",
          "range": "125 - 200 mg/dL",
          "recommendation": "Include more fiber in your diet to maintain healthy cholesterol levels."
        },
        "secondaryTests": [
          {
            "name": "Coronary Calcium Score",
            "result": "0",
            "range": "0 - 10",
            "recommendation": "Continue with regular cardiovascular exercise and a diet low in saturated fats."
          },
          {
            "name": "Blood Pressure",
            "result": "120/80 mmHg",
            "range": "90/60 to 120/80 mmHg",
            "recommendation": "Monitor sodium intake and stay hydrated to maintain optimal blood pressure."
          }
        ]
      },
      "actionPlan": {
        "shortTerm": [
          "Monitor blood pressure daily",
          "Increase intake of omega-3"
        ],
        "longTerm": [
          "Annual heart health check-up",
          "Maintain regular exercise routine"
        ]
      }
    }

    {
      "name": "Brain Health",
      "score": 88,
      "oneLineSummary": "Your cognitive function is strong. Keep challenging your brain!",
      "generalRecommendation": "Engage in regular cognitive exercises and ensure you're getting enough quality sleep.",
      "details": {
        "goldTest": {
          "name": "Quantitative EEG",
          "result": "Normal patterns",
          "range": "Normal frequency distribution",
          "recommendation": "Continue with mental stimulation activities such as puzzles and learning new skills."
        },
        "secondaryTests": [
          {
            "name": "MRI Scan",
            "result": "No abnormalities detected",
            "range": "Normal structural integrity",
            "recommendation": "Incorporate regular physical exercise to support brain health."
          },
          {
            "name": "Neurocognitive Testing",
            "result": "Above average",
            "range": "Average to above average",
            "recommendation": "Maintain a balanced diet rich in antioxidants and omega-3 fatty acids."
          }
        ]
      },
      "actionPlan": {
        "shortTerm": [
          "Engage in daily brain exercises",
          "Ensure 7-8 hours of sleep"
        ],
        "longTerm": [
          "Periodic cognitive function tests",
          "Join a brain health program"
        ]
      }
    }

    {
      "name": "Immune Health",
      "score": 85,
      "oneLineSummary": "Your immune system is functioning well, with room for improvement.",
      "generalRecommendation": "Focus on stress reduction and increasing your intake of immune-boosting foods.",
      "details": {
        "goldTest": {
          "name": "Complete Blood Count (CBC)",
          "result": "Within normal ranges",
          "range": "Varies by cell type",
          "recommendation": "Maintain a balanced diet rich in fruits, vegetables, and lean proteins."
        },
        "secondaryTests": [
          {
            "name": "C-Reactive Protein (CRP)",
            "result": "1.8 mg/L",
            "range": "0 - 3.0 mg/L",
            "recommendation": "Incorporate anti-inflammatory foods like berries and fatty fish into your diet."
          },
          {
            "name": "Vitamin D Level",
            "result": "28 ng/mL",
            "range": "30 - 50 ng/mL",
            "recommendation": "Consider vitamin D supplementation or increased sun exposure under medical guidance."
          }
        ]
      },
      "actionPlan": {
        "shortTerm": [
          "Start a daily meditation practice",
          "Increase intake of vitamin C-rich foods"
        ],
        "longTerm": [
          "Get an annual flu shot",
          "Develop a consistent sleep schedule"
        ]
      }
    }

    {
      "name": "Hormonal Health",
      "score": 78,
      "oneLineSummary": "Your hormonal balance is generally good, with some areas needing attention.",
      "generalRecommendation": "Focus on stress management and consider dietary changes to support hormonal balance.",
      "details": {
        "goldTest": {
          "name": "Comprehensive Hormone Panel",
          "result": "Slight imbalances noted",
          "range": "Varies by hormone",
          "recommendation": "Consult with an endocrinologist for personalized hormone management strategies."
        },
        "secondaryTests": [
          {
            "name": "Thyroid Stimulating Hormone (TSH)",
            "result": "3.8 mIU/L",
            "range": "0.4 - 4.0 mIU/L",
            "recommendation": "Monitor iodine intake and consider thyroid-supporting nutrients like selenium."
          },
          {
            "name": "Cortisol Rhythm Test",
            "result": "Elevated evening cortisol",
            "range": "Normal diurnal rhythm",
            "recommendation": "Implement stress-reduction techniques and improve sleep hygiene."
          }
        ]
      },
      "actionPlan": {
        "shortTerm": [
          "Start a bedtime relaxation routine",
          "Reduce caffeine intake, especially in the afternoon"
        ],
        "longTerm": [
          "Regular hormone level check-ups",
          "Explore adaptogenic herbs under medical supervision"
        ]
      }
    }

    {
      "name": "Gut Health",
      "score": 82,
      "oneLineSummary": "Your gut health is good, but there's room for improvement in microbial diversity.",
      "generalRecommendation": "Increase fiber intake and consider adding fermented foods to your diet.",
      "details": {
        "goldTest": {
          "name": "Comprehensive Stool Analysis",
          "result": "Moderate microbial diversity",
          "range": "High diversity is optimal",
          "recommendation": "Incorporate a wider variety of plant-based foods into your diet to support gut microbiome diversity."
        },
        "secondaryTests": [
          {
            "name": "Hydrogen Breath Test",
            "result": "Negative for SIBO",
            "range": "< 20 ppm rise in hydrogen",
            "recommendation": "Maintain a balanced diet with adequate fiber to prevent small intestinal bacterial overgrowth."
          },
          {
            "name": "Fecal Calprotectin",
            "result": "45 \u00b5g/g",
            "range": "< 50 \u00b5g/g",
            "recommendation": "Continue current diet and lifestyle habits to maintain low inflammation in the gut."
          }
        ]
      },
      "actionPlan": {
        "shortTerm": [
          "Add a daily serving of fermented foods",
          "Increase water intake to support digestion"
        ],
        "longTerm": [
          "Experiment with different types of fiber-rich foods",
          "Consider periodic probiotic supplementation"
        ]
      }
    }

    {
      "name": "Musculoskeletal Health",
      "score": 87,
      "oneLineSummary": "Your musculoskeletal system is in good condition. Focus on maintaining bone density and flexibility.",
      "generalRecommendation": "Incorporate weight-bearing exercises and stretching into your routine.",
      "details": {
        "goldTest": {
          "name": "DEXA Scan (Bone Density)",
          "result": "T-score: -0.5",
          "range": "T-score above -1.0 is normal",
          "recommendation": "Maintain calcium and vitamin D intake, and engage in regular weight-bearing exercises."
        },
        "secondaryTests": [
          {
            "name": "Vitamin D Level",
            "result": "32 ng/mL",
            "range": "30 - 50 ng/mL",
            "recommendation": "Consider moderate sun exposure or vitamin D supplementation to optimize levels."
          },
          {
            "name": "Functional Movement Screen",
            "result": "Score: 15/21",
            "range": "14+ indicates low injury risk",
            "recommendation": "Work on improving mobility and stability through targeted exercises."
          }
        ]
      },
      "actionPlan": {
        "shortTerm": [
          "Start a daily stretching routine",
          "Incorporate calcium-rich foods into your diet"
        ],
        "longTerm": [
          "Join a strength training program",
          "Schedule regular posture assessments"
        ]
      }
    }
  ],
  "alerts": [
    {
      "message": "Your Vitamin D levels are lower than optimal. Consider supplementation.",
      "severity": "moderate",
      "actionRequired": true
    },
    {
      "message": "Your evening cortisol levels are elevated. Focus on stress reduction techniques.",
      "severity": "moderate",
      "actionRequired": true
    },
    {
      "message": "Your gut microbial diversity could be improved. Increase variety in your diet.",
      "severity": "low",
      "actionRequired": false
    }
  ]
}
    `;

const summaryPrompt = `You are an AI assistant specializing in analyzing and synthesizing multiple health reports to create a comprehensive overview of a patient's health over time. Your task is to combine information from several reports and generate a detailed summary of the patient's health. This summary should 300-1500 words long depending on how much information was provided to you. 

This will be shown to the patient, do not refer to them as "the patient", use their name or "you/your". Be as optimistic as possible.`;

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

// export const healthSchema = {
// 	type: "object",
// 	properties: {
// 		categoryHealth: {
// 			type: "object",
// 			properties: {
// 				score: {
// 					type: "number",
// 					description:
// 						"Numerical score (-1 or 0-100) for this health category. -1 if insufficient information.",
// 				},
// 				oneLineSummary: {
// 					type: "string",
// 					description:
// 						"Brief summary of this health category. 'NA' if insufficient information.",
// 				},
// 				generalRecommendation: {
// 					type: "string",
// 					description:
// 						"General health recommendation to improve health in this category.",
// 				},
// 				goldTest: {
// 					type: "string",
// 					description: "Most important test for this health category.",
// 				},
// 				result: {
// 					type: "string",
// 					description: "Result of the gold test for this health category.",
// 				},
// 				range: {
// 					type: "string",
// 					description:
// 						"Normal range for the gold test in this health category.",
// 				},
// 				goldOptimizationRec: {
// 					type: "string",
// 					description: "Optimization recommendation for the gold test.",
// 				},
// 				secondaryTest1: {
// 					type: "string",
// 					description: "First secondary test for this health category.",
// 				},
// 				secondaryTest1Result: {
// 					type: "string",
// 					description: "Result of the first secondary test.",
// 				},
// 				secondaryTest1Range: {
// 					type: "string",
// 					description: "Normal range for the first secondary test.",
// 				},
// 				secondaryTest1OptoRec: {
// 					type: "string",
// 					description:
// 						"Optimization recommendation for the first secondary test.",
// 				},
// 				secondaryTest2: {
// 					type: "string",
// 					description: "Second secondary test for this health category.",
// 				},
// 				secondaryTest2Result: {
// 					type: "string",
// 					description: "Result of the second secondary test.",
// 				},
// 				secondaryTest2Range: {
// 					type: "string",
// 					description: "Normal range for the second secondary test.",
// 				},
// 				secondaryTest2OptoRec: {
// 					type: "string",
// 					description:
// 						"Optimization recommendation for the second secondary test.",
// 				},
// 			},
// 			required: [
// 				"score",
// 				"oneLineSummary",
// 				"generalRecommendation",
// 				"goldTest",
// 				"result",
// 				"range",
// 				"goldOptimizationRec",
// 				"secondaryTest1",
// 				"secondaryTest1Result",
// 				"secondaryTest1Range",
// 				"secondaryTest1OptoRec",
// 				"secondaryTest2",
// 				"secondaryTest2Result",
// 				"secondaryTest2Range",
// 				"secondaryTest2OptoRec",
// 			],
// 		},
// 	},
// 	required: ["categoryHealth"],
// };
export const healthSchema = {
	type: "object",
	properties: {
		name: {
			type: "string",
			description: "Name of the health category",
		},
		score: {
			type: "number",
			description: "Numerical score (0-100) for this health category",
		},
		oneLineSummary: {
			type: "string",
			description: "Brief summary of this health category",
		},
		generalRecommendation: {
			type: "string",
			description:
				"General health recommendation to improve health in this category",
		},
		details: {
			type: "object",
			properties: {
				goldTest: {
					type: "object",
					properties: {
						name: {
							type: "string",
							description:
								"Name of the most important test for this health category",
						},
						result: {
							type: "string",
							description: "Result of the gold test",
						},
						range: {
							type: "string",
							description: "Normal range for the gold test",
						},
						recommendation: {
							type: "string",
							description: "Recommendation based on the gold test result",
						},
					},
					required: ["name", "result", "range", "recommendation"],
				},
				secondaryTests: {
					type: "array",
					items: {
						type: "object",
						properties: {
							name: {
								type: "string",
								description: "Name of the secondary test",
							},
							result: {
								type: "string",
								description: "Result of the secondary test",
							},
							range: {
								type: "string",
								description: "Normal range for the secondary test",
							},
							recommendation: {
								type: "string",
								description:
									"Recommendation based on the secondary test result",
							},
						},
						required: ["name", "result", "range", "recommendation"],
					},
				},
			},
			required: ["goldTest", "secondaryTests"],
		},
		actionPlan: {
			type: "object",
			properties: {
				shortTerm: {
					type: "array",
					items: {
						type: "string",
					},
					description: "Short-term action items",
				},
				longTerm: {
					type: "array",
					items: {
						type: "string",
					},
					description: "Long-term action items",
				},
			},
			required: ["shortTerm", "longTerm"],
		},
	},
	required: [
		"name",
		"score",
		"oneLineSummary",
		"generalRecommendation",
		"details",
		"actionPlan",
	],
};
