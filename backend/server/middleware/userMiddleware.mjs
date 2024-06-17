import { createRequire } from "module";

const require = createRequire(import.meta.url);
const db = require("../../db/db.js");

const userMiddleware = async (req, res, next) => {
	try {
		req._dbUser = await db.getUserById(req._fbUser.user_id);
		if (!req._dbUser) {
			req._dbUser = await db.createUser(req._fbUser.user_id, req._fbUser.name);
			console.log("Created user in db:", req._dbUser);
		}
		next();
	} catch (err) {
		res
			.status(500)
			.json({ status: "fail", message: "Something went wrong. Checkpoint 2" });
	}
};

export default userMiddleware;
