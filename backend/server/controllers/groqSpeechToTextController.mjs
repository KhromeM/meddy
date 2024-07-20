import {
  transcribeSpeech,
  translateSpeech,
} from "../../ai/audio/speechToTextGroq.mjs";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import multer from "multer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const multerConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    const userDir = join(
      __dirname,
      "../../uploads",
      req._dbUser.userid.toString()
    );
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multerConfig });

export const postAudioTrans = [
  upload.single("audio"),
  async (req, res) => {
    try {
      const { language = "en", translate = "false" } = req.body;
      const audioFile = req.file;

      if (!audioFile) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      const fileStream = fs.createReadStream(audioFile.path);

      let result;
      if (translate === "true") {
        result = await translateSpeech(fileStream);
      } else {
        result = await transcribeSpeech(fileStream, language);
      }

      // Clean up the temporary file
      fs.unlink(audioFile.path, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });

      res.json({ result });
    } catch (error) {
      console.error("Error processing audio:", error);
      res
        .status(500)
        .json({ error: "Error processing audio", details: error.message });
    } finally {
      res.end();
    }
  },
];
