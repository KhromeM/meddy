import {
  transcribeSpeech,
  translateSpeech,
} from "../../ai/audio/speechToText.mjs";

const MAX_CHUNK_SIZE = 24 * 1024 * 1024; // 24MB to be safe

function base64ToBuffer(base64) {
  return Buffer.from(base64, "base64");
}

function chunkBuffer(buffer, maxChunkSize) {
  const chunks = [];
  for (let i = 0; i < buffer.length; i += maxChunkSize) {
    chunks.push(buffer.slice(i, i + maxChunkSize));
  }
  return chunks;
}

async function processAudioChunk(
  audioBuffer,
  tscLanguage,
  isTranslation = false
) {
  const stream = Readable.from(audioBuffer);
  const result = "";

  if (isTranslation) {
    result = await translateSpeech(stream);
  } else {
    result = await transcribeSpeech(stream, tscLanguage);
  }

  return result.text;
}

async function processLargeAudio(audioBuffer, language, translate = false) {
  const chunks = chunkBuffer(audioBuffer, MAX_CHUNK_SIZE);
  let results = [];

  for (const chunk of chunks) {
    const result = await processAudioChunk(chunk, language, translate);
    results.push(result);
  }

  return results.join(" ");
}

export const postAudioTrans = async (req, res) => {
  try {
    const { audioData, language = "en", translate = false } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: "No audio data provided" });
    }

    const audioBuffer = base64ToBuffer(audioData);
    const result = await processLargeAudio(audioBuffer, language, translate);

    res.json({ result });
  } catch (error) {
    console.error("Error processing audio:", error);
    res
      .status(500)
      .json({ error: "Error processing audio", details: error.message });
  } finally {
    res.end();
  }
};
