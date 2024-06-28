import { expect } from "chai";
import { pool } from "../../db/dbConfig.mjs";
import { createUser } from "../../db/dbUser.mjs";
import {
	createMessage,
	getRecentMessagesByUserId,
} from "../../db/dbMessages.mjs";

let user1, user2;

describe("DB Message Functions", () => {
	before(async () => {
		await pool.query("DELETE FROM Messages");
		await pool.query("DELETE FROM Users");
		user1 = await createUser("test_user1", "Test User 1");
		user2 = await createUser("test_user2", "Test User 2");
	});

	afterEach(async () => {
		await pool.query("DELETE FROM Messages");
	});

	after(async () => {
		await pool.query("DELETE FROM Users");
	});

	it("createMessage", async () => {
		const message = await createMessage(
			user1.userid,
			"sourceA",
			"Test message content"
		);
		expect(message).to.have.property("userid", user1.userid);
		expect(message).to.have.property("source", "sourceA");
		expect(message).to.have.property("text", "Test message content");
	});

	it("getRecentMessagesByUserId with limit", async () => {
		const messages = [
			await createMessage(user1.userid, "sourceA", "Message 1"),
			await createMessage(user1.userid, "sourceB", "Message 2"),
			await createMessage(user1.userid, "sourceC", "Message 3"),
		];

		const recentMessages = await getRecentMessagesByUserId(user1.userid, 2);
		expect(recentMessages).to.have.lengthOf(2);
		expect(recentMessages[0]).to.have.property("text", "Message 3");
		expect(recentMessages[1]).to.have.property("text", "Message 2");
	});

	it("getRecentMessagesByUserId with fewer messages than limit", async () => {
		const message = await createMessage(
			user1.userid,
			"sourceA",
			"Only message"
		);

		const recentMessages = await getRecentMessagesByUserId(user1.userid, 5);
		expect(recentMessages).to.have.lengthOf(1);
		expect(recentMessages[0]).to.have.property("text", "Only message");
	});

	it("user1 should not receive user2's messages", async () => {
		await createMessage(user1.userid, "sourceA", "User 1 Message 1");
		await createMessage(user2.userid, "sourceB", "User 2 Message 1");

		const user1Messages = await getRecentMessagesByUserId(user1.userid, 5);
		expect(user1Messages).to.have.lengthOf(1);
		expect(user1Messages[0]).to.have.property("text", "User 1 Message 1");

		const user2Messages = await getRecentMessagesByUserId(user2.userid, 5);
		expect(user2Messages).to.have.lengthOf(1);
		expect(user2Messages[0]).to.have.property("text", "User 2 Message 1");
	});
});
