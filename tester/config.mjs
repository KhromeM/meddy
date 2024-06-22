import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
	serverURL: "http://localhost:8000",
	idToken: process.env.IDTOKEN,
};
