import { Router } from "express";
import { uploadFile, getFile } from "../controllers/fileController.mjs";

const router = Router();

router.post("/", uploadFile);
router.get("/:fileName", getFile);

export default router;
