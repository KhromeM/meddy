import { Router } from "express";
import {
	getChatHistory,
	postChatMessage,
} from "../controllers/chatController.mjs";

import { postAudioTrans } from "../controllers/groqSpeechToTextController.mjs";
import { transcriptClassify } from "../controllers/classifierController.mjs";

const router = Router();

router.get("/", getChatHistory);
router.post("/", postChatMessage);
// router.post("/groq-stt", postAudioTrans);
// router.post("/classify", transcriptClassify);

export default router;
