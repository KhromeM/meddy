import dotenv from "dotenv";
dotenv.config();
const baseURL = "http://localhost:";
const port = 8000;

export default {
	port: process.env.PORT || port,
	baseURL: baseURL,
	URL: baseURL + toString(port),
};
