import { Router } from "express";
import { saveGFitToken } from "../controllers/credentialsController.mjs";

const router = Router();

router.post("/gfit-token", saveGFitToken);

export default router;
