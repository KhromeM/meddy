import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { summarizeFHIR } from "../../utils/summarizeFHIR.mjs";

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
		console.log(
			"Uploaded health data file at: ",
			join(ehrDir, req.file.originalname)
		);
		res.status(200).json({ message: "Health data file uploaded successfully" });
		(async () => {
			try {
				const data = await fs.promises.readFile(
					path.join(ehrDir, req.file.originalname),
					"utf-8"
				);
				await summarizeFHIR(req._dbUser, data);
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
};

export const getAllHealthData = (req, res) => {
	const ehrDir = join(
		__dirname,
		"../../uploads",
		req._dbUser.userid.toString(),
		"ehr"
	);

	fs.readdir(ehrDir, (err, files) => {
		if (err) {
			return res
				.status(500)
				.json({ message: "Error reading health data directory" });
		}
		res.status(200).json({ files: files });
	});
};

export const deleteHealthData = (req, res) => {
	if (!req.query.filename) {
		return res.status(400).json({ message: "Filename is required" });
	}

	const filename = req.query.filename;
	const filePath = join(
		__dirname,
		"../../uploads",
		req._dbUser.userid.toString(),
		"ehr",
		filename
	);

	fs.unlink(filePath, (err) => {
		if (err) {
			return res
				.status(404)
				.json({ message: "File not found or could not be deleted" });
		}
		res.status(200).json({ message: "Health data file deleted successfully" });
	});
};
