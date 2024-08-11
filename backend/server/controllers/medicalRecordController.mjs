import { getTotalMedicalRecordsByUserId } from "../../db/dbMedicalRecords.mjs";
import { createTotalSummary } from "../../utils/summarizeFHIR.mjs";

export const getTotalMedicalRecordsByUserIdController = async (req, res) => {
	try {
		const user = req._dbUser;
		const records = await getTotalMedicalRecordsByUserId(user.userid);
		if (records.length == 0) {
			records.push(defaultRecord);
		}
		res.status(200).json(records[0]);
	} catch (error) {
		console.error("Error in getTotalMedicalRecordsByUserIdController:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const generateTotalReportController = async (req, res) => {
	try {
		const user = req._dbUser;
		getTotalMedicalRecordsByUserId(user.userid);
		res.status(200).json("Attempting to generate comprehensive report");
	} catch (error) {
		console.error("Error in getTotalMedicalRecordsByUserIdController:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const defaultRecord = maleRecord;
const maleRecord = {
	metabolicHealth: {
		actionPlan: {
			longTerm: [
				"Gradually increase daily step count to 10,000 steps",
				"Incorporate strength training exercises 2-3 times a week",
				"Schedule annual metabolic panel tests with your physician",
			],
			shortTerm: [
				"Reduce refined carbohydrate intake by 25%",
				"Start intermittent fasting with a 14-hour fasting window",
				"Replace sugary drinks with herbal teas or infused water",
			],
		},
		details: {
			goldTest: {
				name: "HbA1c Test",
				range:
					"Below 5.7% is normal, 5.7-6.4% is prediabetes, 6.5% or higher indicates diabetes",
				recommendation:
					"Your HbA1c is slightly elevated. Focus on reducing simple carbohydrates and increasing physical activity to improve insulin sensitivity.",
				result: "5.9%",
			},
			secondaryTests: [
				{
					name: "Fasting Blood Glucose",
					range: "70-100 mg/dL",
					recommendation:
						"Your fasting glucose is within normal range, but on the higher end. Continue monitoring and implement dietary changes to maintain healthy levels.",
					result: "98 mg/dL",
				},
				{
					name: "Lipid Panel",
					range:
						"Total Cholesterol: <200 mg/dL, LDL Cholesterol: <100 mg/dL, HDL Cholesterol: >60 mg/dL, Triglycerides: <150 mg/dL",
					recommendation:
						"Your lipid panel shows slightly elevated LDL. Consider increasing fiber intake and incorporating more omega-3 fatty acids in your diet.",
					result:
						"Total Cholesterol: 195 mg/dL, LDL: 110 mg/dL, HDL: 55 mg/dL, Triglycerides: 140 mg/dL",
				},
			],
		},
		generalRecommendation:
			"Your metabolic health indicators suggest you're at risk for prediabetes. Implementing lifestyle changes now can significantly improve your long-term health outcomes.",
		name: "Metabolic Health",
		oneLineSummary:
			"Your metabolic health requires attention; focus on diet and exercise to improve insulin sensitivity and lipid profile.",
		score: 68,
	},
	heartHealth: {
		actionPlan: {
			longTerm: [
				"Aim to lose 10-15 pounds through diet and exercise",
				"Practice stress-reduction techniques like meditation or yoga",
			],
			shortTerm: [
				"Reduce sodium intake to less than 2,300 mg per day",
				"Begin a walking routine, starting with 15 minutes daily",
			],
		},
		details: {
			goldTest: {
				name: "Lipid Panel",
				range:
					"Total Cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >60 mg/dL, Triglycerides: <150 mg/dL",
				recommendation:
					"Focus on increasing HDL levels through regular exercise and incorporating healthy fats in your diet.",
				result:
					"Total Cholesterol: 210 mg/dL, LDL: 130 mg/dL, HDL: 45 mg/dL, Triglycerides: 160 mg/dL",
			},
			secondaryTests: [
				{
					name: "Blood Pressure",
					range: "90/60 to 120/80 mmHg",
					recommendation:
						"Your blood pressure is in the prehypertensive range. Reduce sodium intake and increase potassium-rich foods in your diet.",
					result: "135/85 mmHg",
				},
				{
					name: "C-Reactive Protein (CRP)",
					range:
						"<1 mg/L is low risk, 1-3 mg/L is average risk, >3 mg/L is high risk",
					recommendation:
						"Your CRP levels indicate moderate inflammation. Consider an anti-inflammatory diet and discuss further testing with your doctor.",
					result: "2.5 mg/L",
				},
			],
		},
		generalRecommendation:
			"Your heart health indicators suggest room for improvement. Focus on a heart-healthy diet, regular exercise, and stress management to reduce your cardiovascular risk.",
		name: "Heart Health",
		oneLineSummary:
			"Your heart health needs attention; lifestyle changes can significantly improve your cardiovascular risk profile.",
		score: 72,
	},
	gutHealth: {
		actionPlan: {
			longTerm: [
				"Gradually increase fiber intake to 25-30 grams per day",
				"Introduce a wider variety of fermented foods into your diet",
			],
			shortTerm: [
				"Start a food journal to identify potential food sensitivities",
				"Incorporate a daily probiotic supplement",
			],
		},
		details: {
			goldTest: {
				name: "Comprehensive Stool Analysis",
				range: "High diversity is optimal",
				recommendation:
					"Your gut microbiome diversity is lower than ideal. Focus on increasing plant diversity in your diet and consider a prebiotic supplement.",
				result: "Low microbial diversity",
			},
			secondaryTests: [
				{
					name: "Lactulose Breath Test",
					range: "Less than 20 ppm rise in hydrogen",
					recommendation:
						"Your results suggest possible small intestinal bacterial overgrowth (SIBO). Consult with a gastroenterologist for potential treatment options.",
					result: "25 ppm rise in hydrogen",
				},
				{
					name: "Zonulin",
					range: "<30 ng/mL",
					recommendation:
						"Your zonulin levels suggest increased intestinal permeability. Focus on gut-healing foods and discuss potential underlying causes with your doctor.",
					result: "45 ng/mL",
				},
			],
		},
		generalRecommendation:
			"Your gut health shows signs of imbalance. Prioritize increasing dietary fiber, incorporating fermented foods, and addressing potential food sensitivities to improve your gut microbiome and overall digestive health.",
		name: "Gut Health",
		oneLineSummary:
			"Your gut health needs improvement; focus on dietary changes and potential treatment for SIBO.",
		score: 65,
	},
	brainHealth: {
		actionPlan: {
			longTerm: [
				"Engage in cognitive training exercises 3-4 times a week",
				"Learn a new language or musical instrument",
			],
			shortTerm: [
				"Establish a consistent sleep schedule aiming for 7-9 hours per night",
				"Incorporate 30 minutes of aerobic exercise daily",
			],
		},
		details: {
			goldTest: {
				name: "Montreal Cognitive Assessment (MoCA)",
				range: "26-30 points is considered normal cognitive function",
				recommendation:
					"Your score indicates mild cognitive impairment. Focus on brain-boosting activities and discuss potential underlying causes with your doctor.",
				result: "Score: 24/30",
			},
			secondaryTests: [
				{
					name: "Brain-Derived Neurotrophic Factor (BDNF) Levels",
					range: "8,000-46,000 pg/mL",
					recommendation:
						"Your BDNF levels are on the lower end. Increase aerobic exercise and consider omega-3 supplementation to boost BDNF production.",
					result: "10,000 pg/mL",
				},
				{
					name: "Sleep Study",
					range: "Normal sleep architecture with 4-5 sleep cycles per night",
					recommendation:
						"Your sleep study shows reduced deep sleep. Improve sleep hygiene and consider cognitive behavioral therapy for insomnia.",
					result: "Reduced slow-wave sleep, frequent awakenings",
				},
			],
		},
		generalRecommendation:
			"Your cognitive function shows some areas of concern. Prioritize sleep quality, regular exercise, and cognitive engagement to support brain health and potentially improve cognitive performance.",
		name: "Brain Health",
		oneLineSummary:
			"Your cognitive function needs attention; focus on sleep, exercise, and mental stimulation.",
		score: 76,
	},
	immuneSystem: {
		actionPlan: {
			longTerm: [
				"Gradually increase daily vegetable intake to 5-7 servings",
				"Practice regular stress-reduction techniques like deep breathing or meditation",
			],
			shortTerm: [
				"Start taking a high-quality vitamin D3 supplement",
				"Incorporate immune-boosting foods like garlic, ginger, and turmeric into daily meals",
			],
		},
		details: {
			goldTest: {
				name: "Complete Blood Count (CBC)",
				range:
					"Varies by cell type (white blood cells, lymphocytes, neutrophils, etc.)",
				recommendation:
					"Your white blood cell count is slightly low. Focus on immune-boosting nutrients and discuss potential underlying causes with your doctor.",
				result:
					"White Blood Cell Count: 3.8 x 10^9/L (Normal range: 4.5-11.0 x 10^9/L)",
			},
			secondaryTests: [
				{
					name: "Vitamin D Level",
					range: "30-50 ng/mL (adequate for most adults)",
					recommendation:
						"Your vitamin D levels are insufficient. Start supplementation and increase safe sun exposure to boost levels.",
					result: "22 ng/mL",
				},
				{
					name: "Natural Killer Cell Activity",
					range: "Percentage of target cells killed in 4 hours: >20%",
					recommendation:
						"Your NK cell activity is lower than optimal. Focus on stress reduction and consider adaptogenic herbs to support immune function.",
					result: "15% target cells killed",
				},
			],
		},
		generalRecommendation:
			"Your immune system shows signs of suboptimal function. Prioritize nutrient-dense foods, manage stress levels, and address vitamin D deficiency to support and strengthen your immune system.",
		name: "Immune System",
		oneLineSummary:
			"Your immune function needs support; focus on nutrition, stress management, and vitamin D supplementation.",
		score: 70,
	},
	musculoskeletalHealth: {
		actionPlan: {
			longTerm: [
				"Incorporate weight-bearing exercises 3 times a week",
				"Schedule a follow-up DEXA scan in 2 years",
			],
			shortTerm: [
				"Start a daily weight-bearing exercise routine, such as brisk walking or jogging",
				"Increase calcium and vitamin D intake through diet and supplementation",
			],
		},
		details: {
			goldTest: {
				name: "DEXA Scan (Bone Density)",
				range:
					"T-score above -1.0 is normal, -1.0 to -2.5 indicates osteopenia, below -2.5 indicates osteoporosis",
				recommendation:
					"Your T-score indicates osteopenia. Focus on increasing calcium and vitamin D intake, and incorporate regular weight-bearing exercises.",
				result: "T-score: -1.8",
			},
			secondaryTests: [
				{
					name: "Vitamin D Level",
					range: "30 - 50 ng/mL",
					recommendation:
						"Your vitamin D levels are insufficient. Start supplementation and increase safe sun exposure to support bone health.",
					result: "25 ng/mL",
				},
				{
					name: "Serum Calcium",
					range: "8.5 - 10.2 mg/dL",
					recommendation:
						"Your serum calcium is within normal range. Continue to monitor and maintain adequate calcium intake through diet and supplementation if necessary.",
					result: "9.2 mg/dL",
				},
			],
		},
		generalRecommendation:
			"Your bone density is lower than ideal, indicating osteopenia. Prioritize calcium and vitamin D intake, engage in regular weight-bearing exercises, and consider discussing medication options with your doctor if lifestyle changes don't improve your bone density.",
		name: "Musculoskeletal Health",
		oneLineSummary:
			"Your bone density shows signs of osteopenia; focus on nutrition and weight-bearing exercises to improve bone health.",
		score: 74,
	},
	hormonalProfile: {
		actionPlan: {
			longTerm: [
				"Schedule bi-annual hormone panel tests to monitor thyroid function and testosterone levels",
				"Consider consultation with an endocrinologist for personalized hormone optimization strategies",
			],
			shortTerm: [
				"Begin a daily stress reduction practice like meditation or deep breathing exercises",
				"Optimize sleep hygiene to support hormonal balance",
			],
		},
		details: {
			goldTest: {
				name: "Comprehensive Hormone Panel",
				range:
					"Varies by hormone and individual factors such as age and gender.",
				recommendation:
					"Your testosterone levels are on the lower end of normal. Focus on strength training, optimizing sleep, and discuss potential supplementation with your doctor.",
				result:
					"Testosterone: 320 ng/dL (Normal range for males: 300-1000 ng/dL)",
			},
			secondaryTests: [
				{
					name: "Thyroid Function Test (TSH, Free T4)",
					range: "TSH: 0.4-4.0 mIU/L, Free T4: 0.8-1.8 ng/dL",
					recommendation:
						"Your TSH is slightly elevated, indicating potential subclinical hypothyroidism. Monitor closely and consider lifestyle changes to support thyroid function.",
					result: "TSH: 4.5 mIU/L, Free T4: 0.9 ng/dL",
				},
				{
					name: "Cortisol (Morning)",
					range: "10-20 mcg/dL",
					recommendation:
						"Your morning cortisol is on the higher end, suggesting potential chronic stress. Implement stress reduction techniques and consider adaptogenic herbs.",
					result: "19 mcg/dL",
				},
			],
		},
		generalRecommendation:
			"Your hormonal profile shows some imbalances, particularly in thyroid function and stress hormones. Focus on stress management, sleep optimization, and discuss potential thyroid support with your healthcare provider.",
		name: "Hormonal Profile",
		oneLineSummary:
			"Your hormonal balance needs attention; focus on thyroid health, stress management, and testosterone optimization.",
		score: 78,
	},
	summary: {
		summary:
			"Based on the comprehensive health assessment, there are several areas that require attention to optimize your overall health and well-being. Your metabolic health shows signs of prediabetes, indicating a need for dietary changes and increased physical activity. Heart health metrics suggest room for improvement, particularly in blood pressure and cholesterol levels. Gut health appears compromised, with potential issues like SIBO and increased intestinal permeability that need addressing. Cognitive function shows mild impairment, emphasizing the importance of sleep quality and mental stimulation. Your immune system could benefit from nutritional support and stress management. Bone health indicates early stages of osteopenia, requiring focus on nutrition and weight-bearing exercises. Hormonal imbalances, particularly in thyroid and stress hormones, suggest the need for lifestyle modifications and potential medical intervention. Overall, while there are challenges, many of these health concerns can be significantly improved through targeted lifestyle changes, including diet optimization, regular exercise, stress management, and sleep improvement. Regular follow-ups with healthcare providers and specialists are recommended to monitor progress and adjust interventions as needed.",
	},
};
const femaleRecord = {
	metabolicHealth: {
		actionPlan: {
			longTerm: [
				"Gradually increase daily step count to 12,000 steps",
				"Incorporate high-intensity interval training (HIIT) 2 times a week",
				"Schedule quarterly metabolic panel tests with your physician",
			],
			shortTerm: [
				"Reduce added sugar intake by 50%",
				"Start meal prepping to ensure balanced, portion-controlled meals",
				"Replace one meal a day with a high-protein, low-carb option",
			],
		},
		details: {
			goldTest: {
				name: "HbA1c Test",
				range:
					"Below 5.7% is normal, 5.7-6.4% is prediabetes, 6.5% or higher indicates diabetes",
				recommendation:
					"Your HbA1c is within the normal range, but on the higher end. Focus on maintaining a balanced diet and regular exercise to prevent progression to prediabetes.",
				result: "5.6%",
			},
			secondaryTests: [
				{
					name: "Fasting Blood Glucose",
					range: "70-100 mg/dL",
					recommendation:
						"Your fasting glucose is within normal range. Continue monitoring and maintain a healthy lifestyle to keep it stable.",
					result: "92 mg/dL",
				},
				{
					name: "Insulin Resistance (HOMA-IR)",
					range:
						"<2 is optimal, 2-2.5 is early insulin resistance, >2.5 indicates significant insulin resistance",
					recommendation:
						"Your HOMA-IR indicates early insulin resistance. Focus on reducing refined carbohydrates and increasing physical activity to improve insulin sensitivity.",
					result: "2.3",
				},
			],
		},
		generalRecommendation:
			"While your metabolic health indicators are mostly within normal ranges, there are early signs of insulin resistance. Implementing lifestyle changes now can prevent the development of more serious metabolic issues.",
		name: "Metabolic Health",
		oneLineSummary:
			"Your metabolic health is generally good, but shows early signs of insulin resistance; focus on diet and exercise to maintain and improve metabolic function.",
		score: 78,
	},
	heartHealth: {
		actionPlan: {
			longTerm: [
				"Aim to increase HDL cholesterol through regular aerobic exercise",
				"Learn and practice a stress-management technique like progressive muscle relaxation",
			],
			shortTerm: [
				"Increase omega-3 fatty acid intake through diet or supplementation",
				"Begin a daily meditation practice, starting with 5 minutes and gradually increasing",
			],
		},
		details: {
			goldTest: {
				name: "Lipid Panel",
				range:
					"Total Cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >60 mg/dL, Triglycerides: <150 mg/dL",
				recommendation:
					"Your HDL levels are lower than optimal. Focus on increasing aerobic exercise and incorporating healthy fats in your diet to boost HDL levels.",
				result:
					"Total Cholesterol: 180 mg/dL, LDL: 100 mg/dL, HDL: 45 mg/dL, Triglycerides: 140 mg/dL",
			},
			secondaryTests: [
				{
					name: "Blood Pressure",
					range: "90/60 to 120/80 mmHg",
					recommendation:
						"Your blood pressure is optimal. Continue with your current lifestyle habits to maintain these healthy levels.",
					result: "115/75 mmHg",
				},
				{
					name: "High-Sensitivity C-Reactive Protein (hs-CRP)",
					range:
						"<1 mg/L is low risk, 1-3 mg/L is average risk, >3 mg/L is high risk",
					recommendation:
						"Your hs-CRP levels indicate average cardiovascular risk. Consider an anti-inflammatory diet and discuss further prevention strategies with your doctor.",
					result: "1.8 mg/L",
				},
			],
		},
		generalRecommendation:
			"Your heart health indicators are generally good, with room for improvement in HDL cholesterol levels. Focus on increasing aerobic exercise, managing stress, and incorporating heart-healthy foods to optimize your cardiovascular health.",
		name: "Heart Health",
		oneLineSummary:
			"Your heart health is good overall, with opportunity to improve HDL cholesterol; focus on aerobic exercise and heart-healthy diet.",
		score: 82,
	},
	gutHealth: {
		actionPlan: {
			longTerm: [
				"Gradually increase fiber intake to 25-30 grams per day",
				"Work with a nutritionist to develop a personalized gut-health diet plan",
			],
			shortTerm: [
				"Start a food and symptom journal to identify potential food intolerances",
				"Incorporate a daily probiotic supplement",
			],
		},
		details: {
			goldTest: {
				name: "Comprehensive Stool Analysis",
				range: "High diversity is optimal",
				recommendation:
					"Your gut microbiome diversity is moderate. Focus on increasing the variety of plant-based foods in your diet to improve diversity.",
				result: "Moderate microbial diversity",
			},
			secondaryTests: [
				{
					name: "Intestinal Permeability Test (Lactulose/Mannitol)",
					range: "Lactulose/Mannitol Ratio < 0.03",
					recommendation:
						"Your intestinal permeability is slightly increased. Focus on gut-healing foods and consider discussing potential underlying causes with your doctor.",
					result: "Lactulose/Mannitol Ratio: 0.04",
				},
				{
					name: "Fecal Calprotectin",
					range: "<50 μg/g",
					recommendation:
						"Your fecal calprotectin levels are within normal range, indicating low intestinal inflammation. Continue with your current dietary habits that support gut health.",
					result: "35 μg/g",
				},
			],
		},
		generalRecommendation:
			"Your gut health shows some areas for improvement, particularly in microbial diversity and intestinal permeability. Prioritize increasing dietary fiber, incorporating a variety of plant-based foods, and consider gut-healing nutrients to improve your overall gut health.",
		name: "Gut Health",
		oneLineSummary:
			"Your gut health is moderate; focus on increasing microbial diversity and addressing mild intestinal permeability issues.",
		score: 75,
	},
	brainHealth: {
		actionPlan: {
			longTerm: [
				"Engage in cognitive training exercises 4-5 times a week",
				"Join a local book club or discussion group for mental stimulation",
			],
			shortTerm: [
				"Establish a consistent sleep schedule aiming for 7-8 hours per night",
				"Start a daily mindfulness meditation practice, beginning with 10 minutes",
			],
		},
		details: {
			goldTest: {
				name: "Montreal Cognitive Assessment (MoCA)",
				range: "26-30 points is considered normal cognitive function",
				recommendation:
					"Your score indicates normal cognitive function. Continue engaging in mentally stimulating activities to maintain and potentially improve cognitive performance.",
				result: "Score: 28/30",
			},
			secondaryTests: [
				{
					name: "Brain-Derived Neurotrophic Factor (BDNF) Levels",
					range: "8,000-46,000 pg/mL",
					recommendation:
						"Your BDNF levels are within normal range. Continue with regular exercise and consider cognitive challenges to maintain or increase BDNF production.",
					result: "25,000 pg/mL",
				},
				{
					name: "Sleep Quality Assessment",
					range: "0-21, lower scores indicate better sleep quality",
					recommendation:
						"Your sleep quality score indicates room for improvement. Focus on sleep hygiene practices and consider cognitive behavioral therapy for insomnia if issues persist.",
					result: "Score: 8 (Mild sleep quality issues)",
				},
			],
		},
		generalRecommendation:
			"Your cognitive function is currently normal, but there's always room for enhancement. Prioritize sleep quality, regular mental stimulation, and consider incorporating meditation to support long-term brain health and potentially improve cognitive performance.",
		name: "Brain Health",
		oneLineSummary:
			"Your cognitive function is normal; focus on maintaining and enhancing it through mental stimulation and improved sleep quality.",
		score: 85,
	},
	immuneSystem: {
		actionPlan: {
			longTerm: [
				"Gradually increase daily fruit and vegetable intake to 7-9 servings",
				"Develop a consistent exercise routine, aiming for 150 minutes of moderate activity per week",
			],
			shortTerm: [
				"Start taking a high-quality vitamin C and zinc supplement",
				"Incorporate immune-boosting herbs like echinacea and elderberry into your diet",
			],
		},
		details: {
			goldTest: {
				name: "Complete Blood Count (CBC)",
				range:
					"Varies by cell type (white blood cells, lymphocytes, neutrophils, etc.)",
				recommendation:
					"Your white blood cell count is within normal range, indicating a well-functioning immune system. Continue with healthy lifestyle habits to maintain this.",
				result:
					"White Blood Cell Count: 6.5 x 10^9/L (Normal range: 4.5-11.0 x 10^9/L)",
			},
			secondaryTests: [
				{
					name: "Vitamin D Level",
					range: "30-50 ng/mL (adequate for most adults)",
					recommendation:
						"Your vitamin D levels are slightly low. Consider supplementation and increase safe sun exposure to boost levels.",
					result: "28 ng/mL",
				},
				{
					name: "Immunoglobulin A (IgA)",
					range: "70-400 mg/dL",
					recommendation:
						"Your IgA levels are within normal range, indicating good mucosal immunity. Continue with a balanced diet rich in prebiotics to support gut-associated lymphoid tissue.",
					result: "250 mg/dL",
				},
			],
		},
		generalRecommendation:
			"Your immune system function appears to be generally good, with some room for improvement in vitamin D levels. Focus on maintaining a nutrient-dense diet, regular exercise, and addressing the slight vitamin D deficiency to further strengthen your immune system.",
		name: "Immune System",
		oneLineSummary:
			"Your immune function is good overall; focus on maintaining it through nutrition and addressing mild vitamin D deficiency.",
		score: 80,
	},
	musculoskeletalHealth: {
		actionPlan: {
			longTerm: [
				"Incorporate resistance training exercises 2-3 times a week",
				"Schedule a follow-up DEXA scan in 2 years",
			],
			shortTerm: [
				"Start a daily weight-bearing exercise routine, such as brisk walking or jogging",
				"Increase calcium intake through diet, aiming for 1000-1200 mg daily",
			],
		},
		details: {
			goldTest: {
				name: "DEXA Scan (Bone Density)",
				range:
					"T-score above -1.0 is normal, -1.0 to -2.5 indicates osteopenia, below -2.5 indicates osteoporosis",
				recommendation:
					"Your T-score is within the normal range, but on the lower end. Focus on maintaining bone density through weight-bearing exercises and adequate calcium and vitamin D intake.",
				result: "T-score: -0.8",
			},
			secondaryTests: [
				{
					name: "Vitamin D Level",
					range: "30 - 50 ng/mL",
					recommendation:
						"Your vitamin D levels are slightly low. Consider supplementation and increase safe sun exposure to support bone health.",
					result: "28 ng/mL",
				},
				{
					name: "Serum Calcium",
					range: "8.5 - 10.2 mg/dL",
					recommendation:
						"Your serum calcium is within normal range. Continue to monitor and maintain adequate calcium intake through diet.",
					result: "9.5 mg/dL",
				},
			],
		},
		generalRecommendation:
			"Your bone density is currently normal, but on the lower end of the range. Prioritize weight-bearing exercises, ensure adequate calcium intake, and address the mild vitamin D deficiency to maintain and potentially improve your bone health.",
		name: "Musculoskeletal Health",
		oneLineSummary:
			"Your bone density is normal but could be improved; focus on weight-bearing exercises and nutrition to maintain and enhance bone health.",
		score: 82,
	},
	hormonalProfile: {
		actionPlan: {
			longTerm: [
				"Schedule annual hormone panel tests to monitor estrogen, progesterone, and thyroid function",
				"Consider consultation with a gynecologist or endocrinologist for personalized hormone optimization strategies",
			],
			shortTerm: [
				"Begin a daily stress reduction practice like yoga or deep breathing exercises",
				"Optimize sleep hygiene to support hormonal balance",
			],
		},
		details: {
			goldTest: {
				name: "Comprehensive Hormone Panel",
				range: "Varies by hormone and phase of menstrual cycle",
				recommendation:
					"Your estrogen levels are slightly low for your age and menstrual cycle phase. Consider discussing potential lifestyle changes or supplementation with your healthcare provider.",
				result:
					"Estradiol: 45 pg/mL (Normal range for follicular phase: 30-120 pg/mL)",
			},
			secondaryTests: [
				{
					name: "Thyroid Function Test (TSH, Free T4)",
					range: "TSH: 0.4-4.0 mIU/L, Free T4: 0.8-1.8 ng/dL",
					recommendation:
						"Your thyroid function tests are within normal range. Continue to monitor annually and maintain a healthy lifestyle to support thyroid health.",
					result: "TSH: 2.5 mIU/L, Free T4: 1.2 ng/dL",
				},
				{
					name: "Cortisol (Morning)",
					range: "10-20 mcg/dL",
					recommendation:
						"Your morning cortisol is on the higher end, suggesting potential chronic stress. Implement stress reduction techniques and consider adaptogenic herbs.",
					result: "18 mcg/dL",
				},
			],
		},
		generalRecommendation:
			"Your hormonal profile shows some imbalances, particularly in estrogen levels and stress hormones. Focus on stress management, sleep optimization, and discuss potential support for estrogen levels with your healthcare provider.",
		name: "Hormonal Profile",
		oneLineSummary:
			"Your hormonal balance needs some attention; focus on supporting estrogen levels and managing stress for optimal hormonal health.",
		score: 76,
	},
	summary: {
		summary:
			"Based on the comprehensive health assessment, your overall health is good with some areas for improvement. Your metabolic health shows early signs of insulin resistance, indicating a need for dietary changes and increased physical activity. Heart health metrics are generally good, with room for improvement in HDL cholesterol levels. Gut health appears to have some mild issues with microbial diversity and intestinal permeability that could benefit from dietary changes. Cognitive function is normal, but there's opportunity for enhancement through mental stimulation and improved sleep quality. Your immune system is functioning well, with a need to address mild vitamin D deficiency. Bone health is normal but could be improved through targeted exercise and nutrition. Hormonal balance shows some areas of concern, particularly in estrogen levels and stress hormones. Many of these health aspects can be positively influenced through lifestyle modifications, including optimizing diet, regular exercise, stress management, and sleep improvement. Regular follow-ups with healthcare providers are recommended to monitor progress and adjust interventions as needed. Your proactive approach to health is commendable, and with some targeted improvements, you can enhance your overall well-being and potentially prevent future health issues.",
	},
};
