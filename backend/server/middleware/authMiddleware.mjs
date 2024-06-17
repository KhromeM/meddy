import { verifyUser } from "../../firebase/firebase.mjs";

const authMiddleware = async (req, res, next) => {
	try {
		req._fbUser = await verifyUser(req.body.idToken);
		if (!req._fbUser) {
			return res.status(401).json({ message: "Invalid User. Please log in." });
		}
		next();
	} catch (err) {
		res.status(401).json({ message: "Authentication failed" });
	}
};

export default authMiddleware;
