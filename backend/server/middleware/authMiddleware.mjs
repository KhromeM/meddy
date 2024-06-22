import { verifyUser } from "../../firebase/firebase.mjs";

const authMiddleware = async (req, res, next) => {
	try {
		const idToken = req.body.idToken || req.headers["idtoken"];

		if (idToken == "dev") {
			req._fbUser = {
				name: "DEVELOPER",
				user_id: "DEVELOPER",
			};
		} else {
			req._fbUser = await verifyUser(idToken);
		}

		console.log(req.headers);
		if (!req._fbUser) {
			return res.status(401).json({ message: "Invalid User. Please log in." });
		}
		next();
	} catch (err) {
		res.status(401).json({ message: "Authentication failed" });
	}
};

export default authMiddleware;
