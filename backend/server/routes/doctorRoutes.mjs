import { Router } from "express";
import { createDoctor, getDoctorById, updateDoctor } from "../controllers/doctorController.mjs";

const router = Router();

router.post("/", createDoctor);
router.get("/:doctorId", getDoctorById);
router.put("/:doctorId", updateDoctor);

export default router;
