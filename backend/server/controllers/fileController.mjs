import path from "path";
import fs from "fs";
import multer from "multer";

const multerConfig = multer.diskStorage({
	destination: function (req, file, cb) {
		const userDir = path.join(__dirname, "../uploads", req._dbUser.userId);
		if (!fs.existsSync(userDir)) {
			fs.mkdirSync(userDir, { recursive: true });
		}
		cb(null, userDir);
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage: multerConfig });

export const uploadFile = (req, res) => {
	upload.single("file")(req, res, (err) => {
		if (err) {
			return res.status(400).json({ message: err.message });
		}
		console.log(
			"Uploaded file at: ",
			path.join(__dirname, "uploads", req._dbUser.name, req.file.filename)
		);
		res.status(200).json({ message: "File uploaded successfully" });
	});
};

export const getFile = (req, res) => {
	const filePath = path.join(
		__dirname,
		"uploads",
		req._dbUser.name,
		req.params.fileName
	);
	if (fs.existsSync(filePath)) {
		res.sendFile(filePath);
	} else {
		res.status(404).json({ message: "File not found" });
	}
};
