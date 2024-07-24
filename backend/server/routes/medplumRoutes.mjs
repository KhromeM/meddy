import { Router } from "express";
import { getPatientDetails } from "../controllers/medplumController.mjs";

const router = Router();

router.get("/:patientId", getPatientDetails);

export default router;
