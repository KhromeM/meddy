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

export default router;
