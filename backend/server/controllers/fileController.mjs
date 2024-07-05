import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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
