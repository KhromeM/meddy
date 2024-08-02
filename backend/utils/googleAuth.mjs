import { google } from "googleapis";
import CONFIG from "../config.mjs";

export const getClient = () => {
	const client = new google.auth.OAuth2(
		CONFIG.GOOGLE_CLIENT_ID,
		CONFIG.GOOGLE_CLIENT_SECRET,
		CONFIG.GOOGLE_REDIRECT_URI
	);
	return client;
};

export const getAuthURL = () => {
	const client = getClient();
	const url = client.generateAuthUrl({
		access_type: "offline",
		prompt: "consent", // always get refresh token
		scope,
	});
	return url;
};

export const getToken = async (code) => {
	const client = getClient();
	try {
		const { tokens } = await client.getToken(code);
		return tokens;
	} catch (error) {
		console.error("Error getting token:", error);
		throw new Error("Invalid oauth code");
	}
};

const scope =
	"https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.blood_glucose.read https://www.googleapis.com/auth/fitness.blood_pressure.read https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.body_temperature.read https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.nutrition.read https://www.googleapis.com/auth/fitness.sleep.read";
