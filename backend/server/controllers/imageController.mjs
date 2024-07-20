import fs from "fs/promises";
import path from "path";
import { getContentType } from "../../utils/contentType.mjs";

export const getImage = async (req, res) => {
	const user = req._dbUser;
	const { image } = req.body.data;
	const imagePath = path.resolve(
		__dirname,
		`../../uploads/${user.userid}/${image}`
	);

	try {
		await fs.access(imagePath);
		const data = await fs.readFile(imagePath);
		const contentType = getContentType(image);
		res.contentType(contentType);
		res.send(data);
	} catch (error) {
		if (error.code === "ENOENT") {
			res.status(404).send("Image not found");
		} else {
			console.error("Error reading image:", error);
			res.status(500).send("Error retrieving image");
		}
	}
};

export const setImage = async (req, res) => {
	const user = req._dbUser;
	if (!req.data?.image) {
		return res.status(400).send("No image was uploaded.");
	}
	const image = req.data?.image;

	const uploadPath = path.resolve(
		__dirname,
		`../../uploads/${user.userid}/${image.name}`
	);

	try {
		await fs.mkdir(path.dirname(uploadPath), { recursive: true });
		await fs.writeFile(uploadPath, image.data);
		res.send("File uploaded successfully");
	} catch (error) {
		console.error("Error saving image:", error);
		res.status(500).send("Error uploading file");
	}
};
