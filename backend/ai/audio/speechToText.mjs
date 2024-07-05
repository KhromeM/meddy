import fs from "fs";
import Groq from "groq-sdk";
import WebSocket from "ws";

const model = "whisper-large-v3";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function transcribeSpeech(audioFilePath, language = "en") {
  let audioFileStream = fs.createReadStream(audioFilePath);

  const transcription = await groq.audio.transcriptions.create({
    file: audioFileStream,
    model: model,
    prompt: "Specify context or spelling",
    response_format: "json",
    language: language, // Optional
    temperature: 0.0,
  });
  console.log(transcription.text);
}

async function translateSpeech(audioFilePath) {
  let audioFileStream = fs.createReadStream(audioFilePath);

  const translation = await groq.audio.translations.create({
    file: audioFileStream,
    model: model,
    prompt: "Specify context or spelling",
    response_format: "json",
    temperature: 0.0,
  });
  console.log(translation.text);
}

async function speechToText() {
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on("connection", (ws) => {
    let transcription = "";

    ws.on("message", async (message) => {
      if (message instanceof Buffer) {
        const audioChunk = Buffer.from(message, "base64");
        const audioFileStream = fs.createReadStream(audioChunk);

        const transcription = await transcribeSpeech(audioFileStream);
        transcription += transcription;
      } else {
        ws.send(transcription);
      }
    });
  });
}
