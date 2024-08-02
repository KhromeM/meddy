import db from "../../db/db.mjs";
import { google } from "googleapis";
import CONFIG from "../../config.mjs";

export const getClient = () => {
	const client = new google.auth.OAuth2(
		CONFIG.GOOGLE_CLIENT_ID,
		CONFIG.GOOGLE_CLIENT_SECRET,
		CONFIG.GOOGLE_REDIRECT_URI
	);
	return client;
};

const getAuthURL = () => {
	const client = getClient();
	const url = client.generateAuthUrl({
		access_type: "offline",
		prompt: "consent", // always get refresh token
		scope: CONFIG.oauth2Credentials.scopes,
	});
	return url;
};

export const saveGFitToken = async (req, res) => {
	const { code } = req.body;
	const userId = req._dbUser.userid;
	console.log("GOT GFIT: ", code);
	try {
		const { tokens } = await oauth2Client.getToken(code);
		console.log(tokens);
		const credential = await db.saveGFitToken(userId, tokens.access_token);
		res.status(200).json({ status: "success", data: { credential } });
	} catch (err) {
		console.error("Error saving Google Fit token:", err);
		res
			.status(500)
			.json({ status: "fail", message: "Could not save Google Fit token" });
	}
};
