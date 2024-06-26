import { pool } from "./dbConfig.mjs";
import { createUser, updateUser, getUserById } from "./dbuser.mjs";
import { createMessage, getRecentMessagesByUserId } from "./dbMessages.mjs";
import { createFile, getFileById, updateFile } from "./dbFiles.mjs";

export default {
	createUser,
	getUserById,
	updateUser,
	createMessage,
	createFile,
	getFileById,
	updateFile,
	getRecentMessagesByUserId,
};

// const generateRandomString = (length) =>
// 	Array.from({ length }, () =>
// 		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
// 			Math.floor(Math.random() * 62)
// 		)
// 	).join("");

// (async () => {
// 	const name = "Khrome";
// 	const user = await createUser(95, name);
// 	console.log("Created user: ", name);
// 	console.log(user);
// })();

// (async () => {
// 	const userId = 95;
// 	const user = await getUserById(userId);
// 	console.log(user);
// })();

// async function createAndPrintMessage(userId, source, text) {
// 	const message = await createMessage(userId, source, text);
// 	console.log(message);
// }

// (async () => {
// 	const source = "user";
// 	for (let i = 0; i < 10; i++) {
// 		for (let j = 1; j <= 5; j++) {
// 			const text = "Hello"; //generateRandomString(100);
// 			createAndPrintMessage(j, source, text);
// 		}
// 	}
// })();

// (async () => {
// 	const userId = 5;
// 	const messages = await getRecentMessagesByUserId(userId, 2000);
// 	console.log(messages);
// })();
