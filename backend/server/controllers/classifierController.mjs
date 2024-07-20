import { useClassification } from "../../ai/functions/promptClassifier.mjs";
import db from "../../db/db.mjs";

export const transcriptClassify = async (req, res) => {
  try {
    const partialTranscript = req.body.message.text;
    const chatHistory = await db.getRecentMessagesByUserId(
      req._dbUser.userid,
      5
    );

    chatHistory.push({ source: "user", text });
    const result = await useClassification(
      partialTranscript,
      chatHistory,
      req._dbUser
    );

    if (!result) {
      throw new Error("Classifier didn't respond");
    }

    // db.createMessage(req._dbUser.userid, "user", text);
    // db.createMessage(req._dbUser.userid, "llm", result);

    res.status(200).json({ text: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: "Failed to classify" });
  } finally {
    res.end();
  }
};
