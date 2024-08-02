import { Router } from "express";
import { saveGFitCode } from "../controllers/credentialsController.mjs";

const router = Router();

router.post("/gfit-code", saveGFitCode);

export default router;
