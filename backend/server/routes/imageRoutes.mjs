import { Router } from "express";
import { getImage, setImage } from "../controllers/imageController.mjs";

const router = Router();

router.get("/", getImage);
router.post("/", setImage);

export default router;
