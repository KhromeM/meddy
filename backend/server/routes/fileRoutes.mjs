import { Router } from "express";
import {
	uploadFile,
	getFile,
	uploadHealthData,
	getAllHealthData,
	deleteHealthData,
	getHealthFileByName,
} from "../controllers/fileController.mjs";

const router = Router();

router.post("/", uploadFile);
router.get("/", getFile);
router.post("/health", uploadHealthData);
router.get("/health", getAllHealthData);
router.get("/health/:filename", getHealthFileByName);
router.delete("/health/:filename", deleteHealthData);

export default router;
