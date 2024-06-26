import dotenv from "dotenv";
dotenv.config();
const port = 8000;

export default {
	port: process.env.PORT || port,
	OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	GEMINI_API_KEY: process.env.GEMINI_KEY,
};
