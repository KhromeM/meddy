import Groq from "groq-sdk";

const model = "whisper-large-v3";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Speech to text with optional language parameter (default is English)
// Optional language parameter might result in faster transcription
// Language codes: https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
export async function transcribeSpeech(stream, tscLanguage = "en") {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: stream,
      model: model,
      prompt: "Specify context or spelling",
      response_format: "json",
      language: tscLanguage,
      temperature: 0.0,
    });

    return transcription.text;
  } catch (error) {
    console.error("Error transcribing speech:", error);
    throw error;
  }
}

// Always translates to only English by default
export async function translateSpeech(stream) {
  try {
    const translation = await groq.audio.translations.create({
      file: stream,
      model: model,
      prompt: "Specify context or spelling",
      response_format: "json",
      temperature: 0.0,
    });

    return translation.text;
  } catch (error) {
    console.error("Error translating speech:", error);
    throw error;
  }
}
