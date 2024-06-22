import { Router } from "express";
import { uploadFile, getFile } from "../controllers/fileController.mjs";

const router = Router();

router.post("/", uploadFile);
router.get("/", getFile);

export default router;
