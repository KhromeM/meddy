import { Router } from "express";
import { getGFitData, gFitScores } from "../controllers/gfitController.mjs";

const router = Router();

router.get("/", getGFitData);
router.get("/report", gFitScores);

export default router;
