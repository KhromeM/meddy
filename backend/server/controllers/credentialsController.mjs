import db from "../../db/db.mjs";
import { getClient } from "../../utils/googleAuth.mjs";

export const saveGFitToken = async (req, res) => {
	const { code } = req.body;
	const userId = req._dbUser.userid;
	console.log("GOT CODE: ", code);
	const client = getClient();
	try {
		const { tokens } = await client.getToken(code);
		console.log(tokens);
		const credential = await db.saveGFitToken(userId, tokens.access_token);
		res.status(200).json({ status: "success", data: { credential } });
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
