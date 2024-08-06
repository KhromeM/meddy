import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { summarizeFHIR } from "../../utils/summarizeFHIR.mjs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const multerConfig = multer.diskStorage({
	destination: function (req, file, cb) {
		const userDir = join(
			__dirname,
			"../../uploads",
			req._dbUser.userid.toString()
		);
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
	console.log(req._dbUser);
	upload.single("file")(req, res, (err) => {
		if (err) {
			return res.status(400).json({ message: err.message });
		}
		console.log(
			"Uploaded file at: ",
			join(__dirname, "../../uploads", req._dbUser.name, req.file.filename)
		);
		res.status(200).json({ message: "File uploaded successfully" });
	});
};

export const getFile = (req, res) => {
	const filename = req.query.filename;
	console.log(filename);
	const filePath = join(__dirname, "../../uploads", req._dbUser.name, filename);
	if (fs.existsSync(filePath)) {
		res.sendFile(filePath);
	} else {
		res.status(404).json({ message: "File not found" });
	}
};

export const uploadHealthData = (req, res) => {
	try {
		const ehrDir = join(
			__dirname,
			"../../uploads",
			req._dbUser.userid.toString(),
			"ehr"
		);
		if (!fs.existsSync(ehrDir)) {
			fs.mkdirSync(ehrDir, { recursive: true });
		}

		const ehrUpload = multer({
			storage: multer.diskStorage({
				destination: function (req, file, cb) {
					cb(null, ehrDir);
				},
				filename: function (req, file, cb) {
					cb(null, file.originalname);
				},
			}),
		}).single("file");

		ehrUpload(req, res, (err) => {
			if (err) {
				return res.status(400).json({ message: err.message });
			}

			res
				.status(200)
				.json({ message: "Health data file uploaded successfully" });

			(async () => {
				try {
					const data = await fs.promises.readFile(
						path.join(ehrDir, req.file.originalname),
						"utf-8"
					);
					// await summarizeFHIR(req._dbUser, data); // turned off to save money
				} catch (error) {
					console.error(
						"Error getting llm analysis data:",
						error,
						req._dbUser,
						req.file.originalname
					);
				}
			})();
		});
	} catch (error) {
		console.error("Error in uploadHealthData:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getAllHealthData = (req, res) => {
	try {
		const ehrDir = join(
			__dirname,
			"../../uploads",
			req._dbUser.userid.toString(),
			"ehr"
		);

		if (!fs.existsSync(ehrDir)) {
			return res.status(200).json({ files: [] });
		}

		fs.readdir(ehrDir, (err, files) => {
			if (err) {
				console.error("Error reading health data directory:", err);
				return res
					.status(500)
					.json({ message: "Error reading health data directory" });
			}
			res.status(200).json({ files: files });
		});
	} catch (error) {
		console.error("Error in getAllHealthData:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getHealthFileByName = (req, res) => {
	try {
		const filename = req.params.filename;
		const filePath = path.join(
			__dirname,
			"../../uploads",
			req._dbUser.userid.toString(),
			"ehr",
			filename
		);

		if (fs.existsSync(filePath)) {
			fs.readFile(filePath, "utf8", (err, data) => {
				if (err) {
					console.error("Error reading file:", err);
					res.status(500).json({ message: "Error reading file" });
				} else {
					res.json({ content: data });
				}
			});
		} else {
			res.status(404).json({ message: "File not found" });
		}
	} catch (error) {
		console.error("Error in getHealthFileByName:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteHealthData = (req, res) => {
	try {
		if (!req.params.filename) {
			return res.status(400).json({ message: "Filename is required" });
		}

		const filename = req.params.filename;
		const filePath = join(
			__dirname,
			"../../uploads",
			req._dbUser.userid.toString(),
			"ehr",
			filename
		);

		fs.unlink(filePath, (err) => {
			if (err) {
				console.error("Error deleting file:", err);
				return res
					.status(404)
					.json({ message: "File not found or could not be deleted" });
			}
			res
				.status(200)
				.json({ message: "Health data file deleted successfully" });
		});
	} catch (error) {
		console.error("Error in deleteHealthData:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
