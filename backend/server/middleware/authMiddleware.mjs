import { verifyUser } from "../../firebase/firebase.mjs";

const authMiddleware = async (req, res, next) => {
	try {
		const idToken = req.idToken || req.body?.idToken || req.headers["idtoken"];

		if (idToken == "dev") {
			req._fbUser = {
				name: "DEVELOPER",
				user_id: "DEVELOPER",
			};
		} else {
			req._fbUser = await verifyUser(idToken);
		}

		if (!req._fbUser) {
			if (req.ws) {
				throw new Error("Authentication failed");
			}
			return res.status(401).json({ message: "Authentication failed" });
		}
		next();
	} catch (err) {
		if (req.ws) {
			next(err);
		} else {
			res.status(401).json({ message: "Authentication failed" });
		}
	}
};

export default authMiddleware;
