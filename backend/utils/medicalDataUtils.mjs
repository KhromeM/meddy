import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import db from "../db/db.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const copyMedicalRecords = async (sourceUserId, targetUserId) => {
	const sourcePath = path.resolve(__dirname, `../uploads/${sourceUserId}/ehr/`);
	const targetPath = path.resolve(__dirname, `../uploads/${targetUserId}/ehr/`);

	try {
		await fs.mkdir(targetPath, { recursive: true });
		await fs.mkdir(sourcePath, { recursive: true });

		const files = await fs.readdir(sourcePath);

		for (const file of files) {
			const sourceFile = path.join(sourcePath, file);
			const targetFile = path.join(targetPath, file);

			await fs.copyFile(sourceFile, targetFile);
		}
		db.copyMedicalRecords(sourceUserId, targetUserId);

		console.log(
			`Successfully copied all EHR files from user ${sourceUserId} to user ${targetUserId}`
		);
	} catch (error) {
		console.error(
			`Error copying EHR files from user ${sourceUserId} to user ${targetUserId}:`,
			error
		);
		throw error;
	}
};
