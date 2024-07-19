import { Router } from "express";
import { getDetailsFromMedplum } from "../controllers/medplumController.mjs";

const router = Router();

router.get("/", getDetailsFromMedplum);

export default router;
