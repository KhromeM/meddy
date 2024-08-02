import express from "express";
import {
	getGoogleFitAuthUrl,
	handleGoogleFitCallback,
} from "../controllers/authController.mjs";

const router = express.Router();

router.get("/google-fit-auth-url", getGoogleFitAuthUrl);
router.post("/google-fit-callback", handleGoogleFitCallback);

export default router;
