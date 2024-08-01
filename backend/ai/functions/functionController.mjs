import { getUserById, updateUser } from "../../db/dbUser.mjs";
import { createMedication, createReminder, deleteReminder, deleteMedication } from "../../db/dbInfo.mjs";
import {
	createAppointment,
	updateAppointment,
	deleteAppointment,
} from "../../server/controllers/medplumController.mjs";
import JSON5 from "json5";

export const executeLLMFunction = async (rspObj) => {
	try {
		// Parse input
		// text = text.replace(/\\n/g, "").replace(/\\/g, "").replace(/\t/g, "");
		// const parsedText = JSON5.parse(text.slice(1, -1));
		const functionName = rspObj.function;
		const params = rspObj.params;

		// Execute function with given parameters
		let user, appointment;
		switch (functionName) {
			case "LLMDisplayInformation":
				return params.information;
			case "LLMDidNotUnderstand":
				return params.response;
			case "LLMCannotDo":
				return params.response;
			case "LLMUpdateUserName":
				user = await getUserById(params.userId);
				user.name = params.newName;
				await updateUser(user);
				return params.response;
			case "LLMUpdateUserPhone":
				user = await getUserById(params.userId);
				user.phone = params.newPhoneNumber;
				await updateUser(user);
				return params.response;
			case "LLMUpdateUserAddress":
				user = await getUserById(params.userId);
				user.address = params.newAddress;
				await updateUser(user);
				return params.response;
			case "LLMUpdateUserEmail":
				user = await getUserById(params.userId);
				user.email = params.newEmail;
				await updateUser(user);
				return params.response;
			case "LLMUpdateUserLanguagePreference":
				user = await getUserById(params.userId);
				user.language = params.language;
				await updateUser(user);
				return params.response;
			case "LLMGetMedicationList":
				return params.response;
			case "LLMAddMedication":
				await createMedication(params.userId, params.medicationName, params.dosage);
				return params.response;
			case "LLMDeleteMedication":
				await deleteMedication(params.medicationId);
				return params.response;
			case "LLMShowMedicationReminderList":
				return params.response;
			case "LLMSetMedicationReminder":
				await createReminder(
					params.userId,
					params.medicationName,
					params.hoursUntilRepeat,
					params.time
				);
				return params.response;
			case "LLMDeleteMedicationReminder":
				await deleteReminder(params.reminderId);
				return params.response;
			case "LLMGetAppointmentList":
				return params.response;
			case "LLMScheduleAppointment":
				const appointment = {
					resourceType: "Appointment",
					status: "booked",
					start: params.appointmentStartTime,
					end: params.appointmentEndTime,
					description: params.description,
				};
				await createAppointment(params.patientId, appointment);
				return params.response;
			case "LLMCancelAppointment":
				await deleteAppointment(params.appointmentId);
				return params.response;
			case "LLMRescheduleAppointment":
				await updateAppointment(
					params.appointmentId,
					params.appointmentStartTime,
					params.appointmentEndTime,
					params.description
				);
				return params.response;
			case "LLMGenerateSummaryForAppointment":
				appointment = await getAppointmentById(params.appointmentId);
				return appointment.transcriptsummary;
			default:
				throw new Error(`Function ${functionName} not found`);
		}
	} catch (err) {
		console.log(`Error in LLM function calling:`, err);
		console.log("Response that caused an error: ", JSON5.stringify(text));
		return "Sorry, something went wrong!";
	}
};
