import { getAuthURL, getToken } from "../../utils/googleAuth.mjs";
import db from "../../db/db.mjs";

export const getGoogleFitAuthUrl = (req, res) => {
	const url = getAuthURL();
	res.json({ url });
};

export const handleGoogleFitCallback = async (req, res) => {
	const { code } = req.body;
	const userId = req._dbUser.userid;

	try {
		const tokens = await getToken(code);
		await db.saveGFitTokens(
			userId,
			tokens.access_token,
			tokens.refresh_token,
			new Date(tokens.expiry_date)
		);
		res.json({
			success: true,
			message: "Successfully authenticated with Google Fit",
		});
	} catch (error) {
		console.error("Error in Google Fit callback:", error);
		res.status(400).json({ error: "Failed to authenticate with Google Fit" });
	}
};
