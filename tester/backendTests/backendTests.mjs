import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { CONFIG } from "../config.mjs";
const baseURL = CONFIG.serverURL;
const idToken = "dev" || CONFIG.idToken;

// const form = new FormData();
// form.append("file", fs.createReadStream("./assets/brk.txt"));
// axios
// 	.post(baseURL + "/api/file", form, {
// 		headers: {
// 			...form.getHeaders(),
// 			idToken,
// 		},
// 	})
// 	.then((response) => {
// 		console.log("File uploaded successfully:", response.data);
// 	})
// 	.catch((error) => {
// 		console.error("Error uploading file:", error);
// 	});

const filename = "brk.txt";
axios
	.get(`${baseURL}/api/file`, {
		params: { filename },
		headers: { idToken },
		responseType: "stream",
	})
	.then((response) => {
		response.data.on("end", () => {
			console.log("File read sucessfully!");
		});
		response.data.on("data", (chunk) => {
			console.log(chunk.toString());
		});
	});
