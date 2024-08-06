import { getUserById, updateUser } from "../../db/dbUser.mjs";
import {
	createMedication,
	createReminder,
	deleteReminder,
	deleteMedication,
} from "../../db/dbInfo.mjs";
// import {
// 	createAppointment,
// 	updateAppointment,
// 	deleteAppointment,
// } from "../../server/controllers/medplumController.mjs";
import { summarizeAppointmentFromChatHistory } from "../../utils/saveAppointments.mjs";
import {
	createAppointment,
	updateAppointment,
	deleteAppointment,
} from "../../db/dbAppointments.mjs";

export const executeLLMFunction = async (rspObj) => {
	try {
		const functionName = rspObj?.function?.toLowerCase();
		const params = rspObj.params;
		let user, appointment, response;

		switch (functionName) {
			case "LLMDisplayInformation".toLowerCase():
				return params.response;
			case "LLMDidNotUnderstand".toLowerCase():
				return {
					function: functionName,
					response: params.response,
					success: false,
				};
			case "LLMCannotDo".toLowerCase():
				return {
					function: functionName,
					response: params.response,
					success: false,
				};
			case "LLMUpdateUserName".toLowerCase():
				user = await getUserById(params.userId);
				user.name = params.newName;
				await updateUser(user);
				response =
					params.response ||
					`Your name has been successfully updated to ${params.newName}!`;
				break;

			case "LLMUpdateUserPhone".toLowerCase():
				user = await getUserById(params.userId);
				user.phone = params.newPhoneNumber;
				await updateUser(user);
				response =
					params.response ||
					`Your phone number has been successfully updated to ${params.newPhoneNumber}!`;
				break;

			case "LLMUpdateUserAddress".toLowerCase():
				user = await getUserById(params.userId);
				user.address = params.newAddress;
				await updateUser(user);
				response =
					params.response ||
					`Your address has been successfully updated to ${params.newAddress}!`;
				break;

			case "LLMUpdateUserEmail".toLowerCase():
				user = await getUserById(params.userId);
				user.email = params.newEmail;
				await updateUser(user);
				response =
					params.response ||
					`Your email has been successfully updated to ${params.newEmail}!`;
				break;

			case "LLMUpdateUserLanguagePreference".toLowerCase():
				user = await getUserById(params.userId);
				user.language = params.language;
				await updateUser(user);
				response =
					params.response ||
					`Your language preference has been successfully updated to ${params.language}!`;
				break;
			case "LLMGetMedicationList".toLowerCase():
				response = params.response;
				break;
			case "LLMAddMedication".toLowerCase():
				await createMedication(
					params.userId,
					params.medicationName,
					params.dosage
				);
				response =
					params.response ||
					`Your medication ${params.medicationName} has been added successfully!`;
				break;
			case "LLMDeleteMedication".toLowerCase():
				await deleteMedication(params.medicationId);
				response =
					params.response || `The medication has been deleted successfully.`;
				break;
			case "LLMShowMedicationReminderList".toLowerCase():
				response = params.response;
				break;
			case "LLMSetMedicationReminder".toLowerCase():
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
			case "LLMDeleteMedicationReminder".toLowerCase():
				await deleteReminder(params.reminderId);
				response =
					params.response || `The reminder has been deleted successfully!`;
				break;
			case "LLMGetAppointmentList".toLowerCase():
				response = params.response;
				break;
			case "LLMScheduleAppointment".toLowerCase():
				user = await getUserById(params.userId);
				createAppointment(appointmentStartTime, "", "", "", user.userid);
				response =
					params.response ||
					`Your appointment has been scheduled successfully!`;
				break;
			case "LLMCancelAppointment".toLowerCase():
				await deleteAppointment(params.appointmentId);
				response =
					params.response || `The appointment has been cancelled successfully.`;
				break;
			case "LLMRescheduleAppointment".toLowerCase():
				await updateAppointment(
					params.appointmentId,
					params.appointmentStartTime
				);
				response =
					params.response ||
					`The appointment has been rescheduled successfully`;
				break;
			case "LLMSaveAppointment".toLowerCase():
				user = await getUserById(params.userId);
				response = await summarizeAppointmentFromChatHistory(user);
				break;
			case "LLMGenerateSummaryForAppointment".toLowerCase():
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
