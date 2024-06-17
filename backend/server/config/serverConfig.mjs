import dotenv from "dotenv";
dotenv.config();
const port = 8000;

export default {
	port: process.env.PORT || port,
};
