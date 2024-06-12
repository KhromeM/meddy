import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

const prompt = "Does this look store-bought or homemade?";
const image = {
	inlineData: {
		data: Buffer.from(fs.readFileSync("./experiments/cookies.jpeg")).toString(
			"base64"
		),
		mimeType: "image/jpeg",
	},
};

const result = await model.generateContent([prompt, image]);
console.log(result.response.text());
