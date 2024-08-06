import { Router } from "express";
import { getGFitData } from "../controllers/gfitController.mjs";

const router = Router();

router.get("/", getGFitData);

export default router;
