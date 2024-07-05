import { Router } from "express";
import {
  getChatHistory,
  postChatMessage,
  postChatMessageStream,
} from "../controllers/chatController.mjs";

const router = Router();

router.get("/", getChatHistory);
router.post("/", postChatMessage);
router.post("/stream", postChatMessageStream);
router.get("/transcribe");
router.get("/translate");

export default router;
