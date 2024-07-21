const fs = require("fs");
const path = require("path");

async function uploadImage(imagePath) {
	const imageBuffer = fs.readFileSync(imagePath);
	const base64Image = imageBuffer.toString("base64");

	const requestBody = {
		idToken: "dev",
		image: {
			name: "cat.png",
			data: base64Image,
		},
	};

	try {
		const response = await fetch("https://trymeddy.com/api/image", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		console.log("Upload successful:", data);
		return data;
	} catch (error) {
		console.error("Upload failed:", error.message);
		throw error;
	}
}

// Usage
const imagePath = "./cat.png";

uploadImage(imagePath)
	.then((result) => console.log(result))
	.catch((error) => console.error(error));
