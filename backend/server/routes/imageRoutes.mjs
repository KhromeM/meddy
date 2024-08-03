import { Router } from "express";
import { getImage, getBase64Image, setImage } from "../controllers/imageController.mjs";

const router = Router();

router.get("/", getImage);
router.get("/base64", getBase64Image);
router.post("/", setImage);

export default router;
