import { Router } from "express";
import {
	getTotalMedicalRecordsByUserIdController,
	generateTotalReportController,
} from "../controllers/medicalRecordController.mjs";

const router = Router();

router.get("/", getTotalMedicalRecordsByUserIdController);
router.get("/generate", generateTotalReportController);

export default router;
