import dotenv from "dotenv";
dotenv.config();
const port = 8000;
const isTestEnv = process.env.NODE_ENV === "test";
// const redirectUrl = "https://www.trymeddy.com/chat;
const redirectUrl = "http://localhost:5173/chat";

export default {
	port: isTestEnv ? port + 1 : port,
	OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	GEMINI_API_KEY: process.env.GEMINI_API_KEY,
	GROQ_API_KEY: process.env.GROQ_API_KEY,
	ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
	TEST: isTestEnv,
	DB_NAME: isTestEnv ? "meddysql_test" : "meddysql",
	GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
	ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
	DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
	MEDPLUM_CLIENT_ID: process.env.MEDPLUM_CLIENT_ID,
	MEDPLUM_CLIENT_SECRET: process.env.MEDPLUM_CLIENT_SECRET,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI: redirectUrl,
};
