import db from "../../db/db.mjs";
import { fetchGoogleFitData } from "../../utils/googleFit.mjs";

export const getGFitData = async (req, res) => {
	const user = req._dbUser;

	try {
		const data = await fetchGoogleFitData(user.userid);
		if (!data) {
			return res
				.status(500)
				.json({ status: "fail", message: "Could not get google fit data" });
		}
		return res.status(200).json({ data });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ status: "fail", message: "Could not get google fit data" });
	}
};
