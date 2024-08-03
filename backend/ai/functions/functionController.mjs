
import { getUserById, updateUser } from "../../db/dbUser.mjs";
import { createMedication, createReminder, deleteReminder, deleteMedication } from "../../db/dbInfo.mjs";
import {
	createAppointment,
	updateAppointment,
	deleteAppointment,
} from "../../server/controllers/medplumController.mjs";
import { summarizeAppointmentFromChatHistory } from "../../utils/saveAppointments.mjs";


export const executeLLMFunction = async (rspObj) => {
	try {
		const functionName = rspObj.function;
		const params = rspObj.params;
		let user, appointment, response;

		switch (functionName) {
			case "LLMDisplayInformation":
				return params.information;
			case "LLMDidNotUnderstand":
				return {
					function: functionName,
					response: params.response,
					success: false,
				};
			case "LLMCannotDo":
				return {
					function: functionName,
					response: params.response,
					success: false,
				};
			case "LLMUpdateUserName":
				user = await getUserById(params.userId);
				user.name = params.newName;
				await updateUser(user);
				response =
					params.response ||
					`Your name has been successfully updated to ${params.newName}!`;
				break;

			case "LLMUpdateUserPhone":
				user = await getUserById(params.userId);
				user.phone = params.newPhoneNumber;
				await updateUser(user);
				response =
					params.response ||
					`Your phone number has been successfully updated to ${params.newPhoneNumber}!`;
				break;

			case "LLMUpdateUserAddress":
				user = await getUserById(params.userId);
				user.address = params.newAddress;
				await updateUser(user);
				response =
					params.response ||
					`Your address has been successfully updated to ${params.newAddress}!`;
				break;

			case "LLMUpdateUserEmail":
				user = await getUserById(params.userId);
				user.email = params.newEmail;
				await updateUser(user);
				response =
					params.response ||
					`Your email has been successfully updated to ${params.newEmail}!`;
				break;

			case "LLMUpdateUserLanguagePreference":
				user = await getUserById(params.userId);
				user.language = params.language;
				await updateUser(user);
				response =
					params.response ||
					`Your language preference has been successfully updated to ${params.language}!`;
				break;
			case "LLMGetMedicationList":
				response = params.response;
				break;
			case "LLMAddMedication":
				await createMedication(
					params.userId,
					params.medicationName,
					params.dosage
				);
				response =
					params.response ||
					`Your medication ${params.medicationName} has been added successfully!`;
				break;
			case "LLMDeleteMedication":
				await deleteMedication(params.medicationId);
				response =
					params.response || `The medication has been deleted successfully.`;
				break;
			case "LLMShowMedicationReminderList":
				response = params.response;
				break;
			case "LLMSetMedicationReminder":
				await createReminder(
					params.userId,
					params.medicationName,
					params.hoursUntilRepeat,
					params.time
				);
				response =
					params.response ||
					`A reminder has been set for your medication ${params.medicationName}!`;
				break;
			case "LLMDeleteMedicationReminder":
				await deleteReminder(params.reminderId);
				response =
					params.response || `The reminder has been deleted successfully!`;
				break;
			case "LLMGetAppointmentList":
				response = params.response;
				break;
			case "LLMScheduleAppointment":
				await createAppointment(
					params.dateTime,
					"",
					"",
					params.description,
					params.userId,
					params.doctorId
				);
				response =
					params.response ||
					`Your appointment has been scheduled successfully!`;
				break;
			case "LLMCancelAppointment":
				await deleteAppointment(params.appointmentId);
				response =
					params.response || `The appointment has been cancelled successfully.`;
				break;
			case "LLMRescheduleAppointment":
				await updateAppointment(
					params.appointmentId,
					params.appointmentStartTime,
					params.appointmentEndTime,
					params.description
				);
				response =
					params.response ||
					`The appointment has been rescheduled successfully`;
				break;
			case "LLMSaveAppointment":
				user = await getUserById(params.userId);
				response = await summarizeAppointmentFromChatHistory(user);
				break;
			case "LLMGenerateSummaryForAppointment":
				appointment = await getAppointmentById(params.appointmentId);
				response = appointment.transcriptsummary;
				break;
			default:
				throw new Error(`Function ${functionName} not found`);
		}

		return { function: functionName, response, success: true };
	} catch (err) {
		console.log(`Error in LLM function calling:`, err);
		console.log("Response that caused an error: ", JSON.stringify(rspObj));
		return {
			function: "unknown",
			response: "Sorry, something went wrong! 😬",
			success: false,
		};
	}
};
