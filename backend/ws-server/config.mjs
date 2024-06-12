import dotenv from "dotenv";
dotenv.config();
const host = "ws://www.host.com/path";
const port = 8000;

export default {
	port: process.env.PORT || port,
	host,
};
