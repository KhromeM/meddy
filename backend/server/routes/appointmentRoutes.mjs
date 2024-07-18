import { Router } from "express";
import {
	createAppointment,
	getAllAppointments,
	getAppointmentById,
	insertTranscript,
	updateAppointment,
	deleteAppointment,
} from "../controllers/appointmentController.mjs";
const router = Router();

router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.get("/:appointmentId", getAppointmentById);
router.put("/:appointmentId/transcript", insertTranscript);
router.put("/:appointmentId", updateAppointment);
router.delete("/:appointmentId", deleteAppointment);

export default router;
