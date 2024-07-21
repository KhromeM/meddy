const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function uploadImage(imagePath) {
	const imageBuffer = fs.readFileSync(imagePath);
	const base64Image = imageBuffer.toString("base64");

	const requestBody = {
		idToken: "dev",
		message: {
			text: "hello",
		},
	};

	try {
		const response = await axios.post(
			// "https://trymeddy.com/api/image",
			"http://localhost:8000/api/chat",
			requestBody,
			{
				headers: {},
			}
		);

		console.log("Upload successful:", response.data);
		return response.data;
	} catch (error) {
		console.error(
			"Upload failed:",
			error.response ? error.response.data : error.message
		);
		throw error;
	}
}

// Usage
const imagePath = "./bridge.jpeg";

uploadImage(imagePath)
	.then((result) => console.log(result))
	.catch((error) => console.error(error));
