import db from "../../db/db.mjs";
import { getToken, getAuthURL } from "../../utils/googleAuth.mjs";

export const saveGFitCode = async (req, res) => {
	const { code } = req.body;
	const userId = req._dbUser.userid;
	try {
		const token = await getToken(code);
		await db.saveCredentials(userId, "google_fit", token);
		res.status(200).json({ status: "success" });
	} catch (err) {
		console.error(
			"Error saving Google Fit token:",
			err,
			err?.response?.data?.error_description
		);
		res
			.status(500)
			.json({ status: "fail", message: "Could not save Google Fit token" });
	}
};

export const getGFitUrl = async (req, res) => {
	try {
		const url = getAuthURL();
		res.status(200).json({ status: "success", data: { url } });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ status: "fail", message: "Could not get Google Fit url" });
	}
};
