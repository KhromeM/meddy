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

const defaultRecord = {
	metabolicHealth: {
		actionPlan: {
			longTerm: [
				"Maintain a healthy weight through a balanced diet and regular exercise.",
				"Get regular checkups, including blood sugar, cholesterol, and blood pressure monitoring.",
				"Consult a nutritionist or registered dietitian for personalized dietary guidance.",
			],
			shortTerm: [
				"Incorporate daily physical activity, aiming for at least 30 minutes of moderate-intensity exercise.",
				"Limit processed foods, sugary drinks, and unhealthy fats.",
				"Increase intake of fruits, vegetables, and whole grains.",
			],
		},
		details: {
			goldTest: {
				name: "HbA1c Test",
				range:
					"Below 5.7% is normal, 5.7-6.4% is prediabetes, 6.5% or higher indicates diabetes",
				recommendation:
					"While you haven't taken an HbA1c test recently, it's crucial to get tested as it's the gold standard for diagnosing and monitoring metabolic health.",
				result: "Not available",
			},
			secondaryTests: [
				{
					name: "Fasting Blood Glucose",
					range: "70-100 mg/dL",
					recommendation:
						"Fasting blood glucose is a snapshot of your blood sugar levels.  It's important to get this test done to understand your risk.",
					result: "Not available",
				},
				{
					name: "Lipid Panel",
					range:
						"Total Cholesterol: <200 mg/dL, LDL Cholesterol: <100 mg/dL, HDL Cholesterol: >60 mg/dL, Triglycerides: <150 mg/dL",
					recommendation:
						"A lipid panel assesses your cholesterol levels, providing insights into your cardiovascular risk. Consider getting this test done soon.",
					result: "Not available",
				},
			],
		},
		generalRecommendation:
			"While there's limited information about your medical history, focusing on a healthy lifestyle can significantly benefit your metabolic well-being. Prioritize regular exercise, a balanced diet, and routine checkups.",
		name: "Metabolic Health",
		oneLineSummary:
			"Information about your metabolic health is limited; however, adopting a proactive approach to your well-being is always recommended.",
		score: 50,
	},
	heartHealth: {
		actionPlan: {
			longTerm: [
				"Annual heart health check-up",
				"Maintain regular exercise routine",
			],
			shortTerm: ["Monitor blood pressure daily", "Increase intake of omega-3"],
		},
		details: {
			goldTest: {
				name: "Lipid Panel",
				range: "125 - 200 mg/dL",
				recommendation:
					"Include more fiber in your diet to maintain healthy cholesterol levels.",
				result: "Total Cholesterol: 180 mg/dL",
			},
			secondaryTests: [
				{
					name: "Coronary Calcium Score",
					range: "0 - 10",
					recommendation:
						"Continue with regular cardiovascular exercise and a diet low in saturated fats.",
					result: "0",
				},
				{
					name: "Blood Pressure",
					range: "90/60 to 120/80 mmHg",
					recommendation:
						"Monitor sodium intake and stay hydrated to maintain optimal blood pressure.",
					result: "120/80 mmHg",
				},
			],
		},
		generalRecommendation:
			"Maintain your current heart-healthy lifestyle. Consider adding more omega-3 rich foods to your diet.",
		name: "Heart Health",
		oneLineSummary: "Your heart health is excellent. Keep up the good work!",
		score: 92,
	},
	gutHealth: {
		actionPlan: {
			longTerm: [
				"Experiment with different types of fiber-rich foods",
				"Consider periodic probiotic supplementation",
			],
			shortTerm: [
				"Add a daily serving of fermented foods",
				"Increase water intake to support digestion",
			],
		},
		details: {
			goldTest: {
				name: "Comprehensive Stool Analysis",
				range: "High diversity is optimal",
				recommendation:
					"Incorporate a wider variety of plant-based foods into your diet to support gut microbiome diversity.",
				result: "Moderate microbial diversity",
			},
			secondaryTests: [
				{
					name: "Hydrogen Breath Test",
					range: "Less than 20 ppm rise in hydrogen",
					recommendation:
						"Maintain a balanced diet with adequate fiber to prevent small intestinal bacterial overgrowth.",
					result: "Negative for SIBO",
				},
				{
					name: "Fecal Calprotectin",
					range: "Less than 50 µg/g",
					recommendation:
						"Continue current diet and lifestyle habits to maintain low inflammation in the gut.",
					result: "45 µg/g",
				},
			],
		},
		generalRecommendation:
			"Increase fiber intake and consider adding fermented foods to your diet.",
		name: "Gut Health",
		oneLineSummary:
			"Your gut health is good, but there's room for improvement in microbial diversity.",
		score: 82,
	},
	brainHealth: {
		actionPlan: {
			longTerm: [
				"Periodic cognitive function tests",
				"Join a brain health program",
			],
			shortTerm: [
				"Engage in daily brain exercises",
				"Ensure 7-8 hours of sleep",
			],
		},
		details: {
			goldTest: {
				name: "Quantitative EEG",
				range: "Normal frequency distribution",
				recommendation:
					"Continue with mental stimulation activities such as puzzles and learning new skills.",
				result: "Normal patterns",
			},
			secondaryTests: [
				{
					name: "MRI Scan",
					range: "Normal structural integrity",
					recommendation:
						"Incorporate regular physical exercise to support brain health.",
					result: "No abnormalities detected",
				},
				{
					name: "Neurocognitive Testing",
					range: "Average to above average",
					recommendation:
						"Maintain a balanced diet rich in antioxidants and omega-3 fatty acids.",
					result: "Above average",
				},
			],
		},
		generalRecommendation:
			"Engage in regular cognitive exercises and ensure you're getting enough quality sleep.",
		name: "Brain Health",
		oneLineSummary:
			"Your cognitive function is strong. Keep challenging your brain!",
		score: 88,
	},
	immuneSystem: {
		actionPlan: {
			longTerm: [
				"Incorporate immune-boosting foods like citrus fruits, berries, garlic, ginger, and turmeric into your daily diet.",
				"Get an annual flu shot and stay up-to-date on recommended vaccinations.",
				"Consider engaging in stress-reducing activities such as yoga, meditation, or spending time in nature.",
				"Ensure you are getting adequate sleep (7-9 hours per night) to support optimal immune function.",
			],
			shortTerm: [
				"Increase your intake of fruits and vegetables to ensure you're getting enough vitamins and antioxidants.",
				"Prioritize getting 7-9 hours of quality sleep each night to support immune function.",
				"Manage stress levels through relaxation techniques, exercise, or hobbies you enjoy.",
			],
		},
		details: {
			goldTest: {
				name: "Complete Blood Count (CBC)",
				range:
					"Varies by cell type (white blood cells, lymphocytes, neutrophils, etc.)",
				recommendation:
					"A CBC provides a snapshot of your overall health and can indicate if there are any underlying infections or conditions affecting your immune system. Consult with your doctor to interpret your specific results and discuss any necessary follow-up.",
				result: "Not available in provided data",
			},
			secondaryTests: [
				{
					name: "C-Reactive Protein (CRP)",
					range: "0-10 mg/L (higher levels indicate inflammation)",
					recommendation:
						"CRP is a marker of inflammation in the body. Elevated levels could indicate an immune response to an infection or chronic condition. Discuss your CRP levels with your doctor to determine if further investigation is needed.",
					result: "Not available in provided data",
				},
				{
					name: "Vitamin D Level",
					range: "30-50 ng/mL (adequate for most adults)",
					recommendation:
						"Vitamin D plays a crucial role in immune function. If your levels are low, your doctor may recommend supplementation or increased sun exposure. Maintain adequate vitamin D levels to support your immune health.",
					result: "Not available in provided data",
				},
			],
		},
		generalRecommendation:
			"While specific information about your immune system is limited in the provided data, focusing on a healthy lifestyle can generally support and strengthen your immune system.",
		name: "Immune System",
		oneLineSummary:
			"Based on the available information, a detailed assessment of your immune system health cannot be provided. Incorporating general healthy habits is always recommended.",
		score: 50,
	},
	musculoskeletalHealth: {
		actionPlan: {
			longTerm: [
				"Join a strength training program",
				"Schedule regular posture assessments",
			],
			shortTerm: [
				"Start a daily stretching routine",
				"Incorporate calcium-rich foods into your diet",
			],
		},
		details: {
			goldTest: {
				name: "DEXA Scan (Bone Density)",
				range: "T-score above -1.0 is normal",
				recommendation:
					"Maintain calcium and vitamin D intake, and engage in regular weight-bearing exercises.",
				result: "T-score: -0.5",
			},
			secondaryTests: [
				{
					name: "Vitamin D Level",
					range: "30 - 50 ng/mL",
					recommendation:
						"Consider moderate sun exposure or vitamin D supplementation to optimize levels.",
					result: "32 ng/mL",
				},
				{
					name: "Functional Movement Screen",
					range: "14+ indicates low injury risk",
					recommendation:
						"Work on improving mobility and stability through targeted exercises.",
					result: "Score: 15/21",
				},
			],
		},
		generalRecommendation:
			"Incorporate weight-bearing exercises and stretching into your routine.",
		name: "Musculoskeletal Health",
		oneLineSummary:
			"Your musculoskeletal system is in good condition. Focus on maintaining bone density and flexibility.",
		score: 87,
	},
	hormonalProfile: {
		actionPlan: {
			longTerm: [
				"Maintain a healthy lifestyle, including regular exercise and a balanced diet, to support overall hormonal balance.",
				"Discuss with your doctor about long-term hormone monitoring to track any potential impacts from medication use.",
			],
			shortTerm: [
				"Continue monitoring for any changes in your health and discuss any concerns with your physician.",
				"No immediate actions related to hormonal health are needed based on the provided information.",
			],
		},
		details: {
			goldTest: {
				name: "Comprehensive Hormone Panel",
				range:
					"Varies by hormone and individual factors such as age and gender.",
				recommendation:
					"While there's no indication for this test currently, it's a good idea to discuss with your doctor about appropriate hormone testing based on your age, overall health, and medical history.",
				result: "Not available in the provided data.",
			},
			secondaryTests: [
				{
					name: "Thyroid Function Test (TSH, Free T4)",
					range: "TSH: 0.4-4.0 mIU/L, Free T4: 0.8-1.8 ng/dL (varies by lab)",
					recommendation:
						"Although not routinely recommended for everyone, discussing thyroid function testing with your doctor can help establish a baseline and address any potential concerns.",
					result: "Not available in the provided data.",
				},
				{
					name: "Testosterone (for males)",
					range: "300-1000 ng/dL (varies by lab and age)",
					recommendation:
						"Monitoring testosterone levels may be relevant in the future, especially as you age, to address any potential age-related hormonal changes.",
					result: "Not available in the provided data.",
				},
			],
		},
		generalRecommendation:
			"While the provided information doesn't contain specific hormonal data, maintaining a healthy lifestyle contributes to hormonal balance. Continue routine checkups and discuss any concerns with your physician.",
		name: "Hormonal Profile",
		oneLineSummary:
			"Limited information available regarding your hormonal health. Routine checkups and a healthy lifestyle are advised.",
		score: 75,
	},
	summary: {
		summary:
			"Derrick, based on the information provided, you're doing well overall. Your heart health is excellent - keep up the great work!  Your musculoskeletal system is in good shape, but incorporating weight-bearing exercises and stretching will help maintain bone density and flexibility. Your gut health is good, but adding more fiber and fermented foods to your diet could enhance your gut microbiome diversity.  Cognitively, you're doing fantastic! Continue challenging yourself mentally to keep your brain sharp. We don't have much information about your metabolic or immune health, but maintaining a healthy lifestyle with a balanced diet and regular exercise can positively impact both.  Remember, this assessment is based on limited information. Regular checkups with your doctor are crucial to monitor your health comprehensively and address any specific concerns. Keep up the excellent work in prioritizing your health, Derrick!",
	},
};
