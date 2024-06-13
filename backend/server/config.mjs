import dotenv from "dotenv";
dotenv.config();
const baseURL = "http://trymeddy.com";
const port = 8000;

export default {
	port: process.env.PORT || port,
	baseURL: baseURL,
	URL: baseURL + toString(port),
};
