import { randomInt } from "crypto";
import fs from "fs";
import Groq from "groq-sdk";

const model = "whisper-large-v3";

const filePath1EN =
  "/home/shashank/FullStackProjects/meddy/backend/ai/audio/harvard.wav";
const filePath2ES =
  "/home/shashank/FullStackProjects/meddy/backend/ai/audio/spanish_elephant_story.mp3";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let audioFileStream = fs.createReadStream(filePath2ES);

async function transcribeSpeech() {
  const transcription = await groq.audio.transcriptions.create({
    file: audioFileStream,
    model: model,
    prompt: "Specify context or spelling",
    response_format: "json",
    // language: "es", // Optional
    temperature: 0.0,
  });
  console.log(transcription.text);
}

async function translateSpeech() {
  const translation = await groq.audio.translations.create({
    file: audioFileStream,
    model: model,
    prompt: "Specify context or spelling",
    response_format: "json",
    temperature: 0.0,
  });
  console.log(translation.text);
}

transcribeSpeech();
// translateSpeech();
