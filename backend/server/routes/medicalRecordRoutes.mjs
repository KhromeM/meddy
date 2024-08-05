import { Router } from "express";
import { getTotalMedicalRecordsByUserIdController } from "../controllers/medicalRecordController.mjs";

const router = Router();

router.get("/", getTotalMedicalRecordsByUserIdController);

export default router;
