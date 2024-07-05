import db from "../../db/db.mjs";

const userMiddleware = async (req, res, next) => {
	try {
		req._dbUser = await db.getUserById(req._fbUser.user_id);
		if (!req._dbUser) {
			req._dbUser = await db.createUser(req._fbUser.user_id, req._fbUser.name);
		}
		next();
	} catch (err) {
		if (req.ws) {
			next(err);
		} else {
			res.status(500).json({
				status: "fail",
				message: "Something went wrong. Checkpoint 2",
			});
		}
	}
};

export default userMiddleware;
