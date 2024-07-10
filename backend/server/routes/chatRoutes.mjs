import { Router } from "express";
import {
  getChatHistory,
  postChatMessage,
  postChatMessageStream,
} from "../controllers/chatController.mjs";

import { postAudioTrans } from "../controllers/speechToTextController.mjs";

const router = Router();

router.get("/", getChatHistory);
router.post("/", postChatMessage);
router.post("/stream", postChatMessageStream);
router.post("/speech-to-text", postAudioTrans);

export default router;
