import express from "express";
import {
	createMedication,
	getAllMedications,
	getMedicationById,
	updateMedication,
	deleteMedication,
	createReminder,
	getAllReminders,
	getReminderById,
	updateReminder,
	deleteReminder,
	createAllergy,
	getAllAllergies,
	getAllergyById,
	updateAllergy,
	deleteAllergy,
	createCondition,
	getAllConditions,
	getConditionById,
	updateCondition,
	deleteCondition,
} from "../controllers/infoController.mjs";

const router = express.Router();

// Medication routes
router.post("/medication", createMedication);
router.get("/medication", getAllMedications);
router.get("/medication/:medicationId", getMedicationById);
router.put("/medication/:medicationId", updateMedication);
router.delete("/medication/:medicationId", deleteMedication);

// Reminder routes
router.post("/reminder", createReminder);
router.get("/reminder", getAllReminders);
router.get("/reminder/:reminderId", getReminderById);
router.put("/reminder/:reminderId", updateReminder);
router.delete("/reminder/:reminderId", deleteReminder);

// Allergy routes
router.post("/allergy", createAllergy);
router.get("/allergy", getAllAllergies);
router.get("/allergy/:allergyId", getAllergyById);
router.put("/allergy/:allergyId", updateAllergy);
router.delete("/allergy/:allergyId", deleteAllergy);

// Condition routes
router.post("/condition", createCondition);
router.get("/condition", getAllConditions);
router.get("/condition/:conditionId", getConditionById);
router.put("/condition/:conditionId", updateCondition);
router.delete("/condition/:conditionId", deleteCondition);

export default router;
