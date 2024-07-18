import { getUserById, updateUser } from "../../db/dbUser.mjs";
import {
	createMedication,
	createReminder,
	deleteReminder,
	getUserMedications,
	deleteMedication,
	getUserReminders,
} from "../../db/dbInfo.mjs";
import {
	createAppointment,
	deleteAppointment,
	getAppointmentById,
	updateAppointment,
	getUserAppointments,
} from "../../db/dbAppointments.mjs";

export const executeLLMFunction = async (text) => {
	try {
		// Parse input
		text = text.replace(/\\n/g, "").replace(/\\/g, "").replace(/\t/g, "");
		console.log(text);
		const parsedText = JSON.parse(text);
		const functionName = parsedText.function;
		const params = parsedText.params;

		// Execute function with given parameters
		let user, appointment;
		switch (functionName) {
			case "LLMDidNotUnderstand":
				return params.response;
			case "LLMCannotDo":
				return params.response;
			case "LLMUpdateUserName":
				user = await getUserById(params.userId);
				user.name = params.newName;
				await updateUser(user);
				return `Your name has been sucessfully updated to ${params.newName}!`;
			case "LLMUpdateUserPhone":
				user = await getUserById(params.userId);
				user.phone = params.newPhoneNumber;
				await updateUser(user);
				return `Your phone number has been sucessfully updated to ${params.newPhoneNumber}!`;
			case "LLMUpdateUserAddress":
				user = await getUserById(params.userId);
				user.address = params.newAddress;
				await updateUser(user);
				return `Your address has been sucessfully updated to ${params.newAddress}!`;
			case "LLMUpdateUserEmail":
				user = await getUserById(params.userId);
				user.email = params.newEmail;
				await updateUser(user);
				return `Your email has been sucessfully updated to ${params.newEmail}!`;
			case "LLMUpdateUserLanguagePreference":
				user = await getUserById(params.userId);
				user.language = params.language;
				await updateUser(user);
				return `Your language preference has been sucessfully updated to ${params.language}!`;
			case "LLMGetMedicationList":
				const medications = await getUserMedications(params.userId);

				if (medications.length === 0) {
					return `You have no medications.`;
				}

				const medicationList = medications.map((med) => `${med.name} (${med.dosage})`).join(", ");
				return `Here are your current medications: ${medicationList}.`;
			case "LLMAddMedication":
				await createMedication(params.userId, params.medicationName, params.dosage);
				return `Your medication ${params.medicationName} has been added successfully!`;
			case "LLMDeleteMedication":
				await deleteMedication(params.medicationId);
				return `The medication has been deleted successfully.`;
			case "LLMShowMedicationReminderList":
				const reminders = await getUserReminders(params.userId);
				const reminderList = reminders
					.map((rem) => `${rem.medicationname} at ${rem.time}`)
					.join(", ");
				return `Here are your medication reminders: ${reminderList}.`;
			case "LLMSetMedicationReminder":
				await createReminder(
					params.userId,
					params.medicationName,
					params.hoursUntilRepeat,
					params.time
				);
				return `A reminder has been set for your medication ${params.medicationName}!`;
			case "LLMDeleteMedicationReminder":
				await deleteReminder(params.reminderId);
				return `The reminder has been deleted successfully!`;
			case "LLMGetAppointmentList":
				const appointments = await getUserAppointments(params.userId);

				if (appointments.length === 0) {
					return `You have no upcoming appointments.`;
				}

				const appointmentList = appointments
					.map((apt) => {
						const date = new Date(apt.date);
						const options = {
							weekday: "short",
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
							timeZone: "UTC",
							hour12: true,
						};
						const formattedDate = date.toLocaleString("en-US", options).replace(",", "");
						return `${apt.description} on ${formattedDate}`;
					})
					.join(", ");
				return `Here are your upcoming appointments: ${appointmentList}.`;
			case "LLMScheduleAppointment":
				await createAppointment(
					params.dateTime,
					"",
					"",
					params.description,
					params.userId,
					params.doctorId
				);
				return `Your appointment has been scheduled successfully!`;
			case "LLMCancelAppointment":
				await deleteAppointment(params.appointmentId);
				return `The appointment has been cancelled successfully.`;
			case "LLMRescheduleAppointment":
				appointment = await getAppointmentById(params.appointmentId);
				appointment.date = params.newDateTime;
				await updateAppointment(
					appointment.appointmentid,
					appointment.date,
					appointment.transcript,
					appointment.transcriptsummary,
					appointment.description,
					appointment.userid,
					appointment.doctorid
				);
				return `The appointment has been rescheduled successfully`;
			case "LLMGenerateSummaryForAppointment":
				appointment = await getAppointmentById(params.appointmentId);
				return appointment.transcriptsummary;
			default:
				throw new Error(`Function ${functionName} not found`);
		}
	} catch (err) {
		console.error(err);
		return `Error in LLM function calling: ${err.message}`;
	}
};
