import dotenv from "dotenv";
dotenv.config();
const port = 8000;
const isTestEnv = process.env.NODE_ENV === "test";

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
};
