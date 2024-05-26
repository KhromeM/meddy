import { db } from "./firebase.mjs";

const users = db.collection("users");

export const setUser = async (data) => {
	const { uid } = data;
	const ref = users.doc(uid);
	return await ref.set(data);
};

export const getUser = async (uid) => {
	const ref = users.doc(uid);
	const user = await ref.get();
	if (!user.exists) {
		return {};
	}
	return user.data();
};
