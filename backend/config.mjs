import dotenv from "dotenv";
dotenv.config();
const port = 8000;
const isTestEnv = process.env.NODE_ENV === "test";

export default {
	port: process.env.PORT || port,
	OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	GEMINI_API_KEY: process.env.GEMINI_API_KEY,
	TEST: isTestEnv,
	DB_NAME: isTestEnv ? "meddysql_test" : "meddysql",
};
