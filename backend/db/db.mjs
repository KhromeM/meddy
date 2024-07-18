import { createUser, updateUser, getUserById } from "./dbUser.mjs";
import { createMessage, getRecentMessagesByUserId } from "./dbMessages.mjs";
import { createFile, getFileById, updateFile } from "./dbFiles.mjs";
import {
	createDocument,
	getDocumentById,
	getDocumentsByFileId,
	deleteDocumentsByFileId,
} from "./dbDocuments.mjs";
import {
	createAppointment,
	getAllAppointments,
	getAppointmentById,
	insertTranscript,
	updateAppointment,
	deleteAppointment,
} from "./dbAppointments.mjs";
import { createDoctor, getDoctorById, updateDoctor } from "./dbDoctor.mjs";
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
} from "./dbInfo.mjs";

export default {
	createUser,
	getUserById,
	updateUser,
	createMessage,
	createFile,
	getFileById,
	updateFile,
	getRecentMessagesByUserId,
	createDocument,
	getDocumentById,
	getDocumentsByFileId,
	deleteDocumentsByFileId,
	createAppointment,
	getAllAppointments,
	getAppointmentById,
	insertTranscript,
	updateAppointment,
	deleteAppointment,
	createDoctor,
	getDoctorById,
	updateDoctor,
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
};
