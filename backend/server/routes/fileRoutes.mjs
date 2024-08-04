import { Router } from "express";
import {
	uploadFile,
	getFile,
	uploadHealthData,
	getAllHealthData,
	deleteHealthData,
} from "../controllers/fileController.mjs";

const router = Router();

router.post("/", uploadFile);
router.get("/", getFile);
router.post("/health", uploadHealthData);
router.get("/health", getAllHealthData);
router.delete("/health", deleteHealthData);

export default router;
