import path from "path";

export function getContentType(filename) {
	const ext = path.extname(filename).toLowerCase();
	switch (ext) {
		case ".jpg":
		case ".jpeg":
			return "image/jpeg";
		case ".png":
			return "image/png";
		case ".gif":
			return "image/gif";
		default:
			return "application/octet-stream";
	}
}
