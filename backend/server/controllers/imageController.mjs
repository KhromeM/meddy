import fs from "fs/promises";
import path from "path";
import { getContentType } from "../../utils/contentType.mjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getImage = async (req, res) => {
	const user = req._dbUser;
	const image = req.query.image;

  if (!image) {
    return res.status(400).send("Image parameter is required");
  }
  
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
	const image = req.body?.image;

	if (!image || !image.name) {
		return res.status(400).send("No image was uploaded.");
	}

	const uploadPath = path.resolve(
		__dirname,
		`../../uploads/${user.userid}/${image.name}`
	);
	const buffer = Buffer.from(image.data, "base64");
	try {
		await fs.mkdir(path.dirname(uploadPath), { recursive: true });
		await fs.writeFile(uploadPath, buffer);
		res.status(200).json({
			message: "File uploaded successfully",
			success: true,
		});
	} catch (error) {
		console.error("Error saving image:", error);
		res.status(500).send("Error uploading file");
	}
};
