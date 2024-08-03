import { Router } from "express";
import {
	saveGFitCode,
	getGFitUrl,
} from "../controllers/credentialsController.mjs";

const router = Router();

router.post("/gfitcode", saveGFitCode);
router.get("/gfiturl", getGFitUrl);

export default router;
