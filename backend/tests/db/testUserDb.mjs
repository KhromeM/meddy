import { expect } from "chai";
import { pool } from "../../db/dbConfig.mjs";
import { createUser, getUserById, updateUser } from "../../db/dbUser.mjs";

describe("DB User Functions", () => {
	before(async () => {
		await pool.query("DELETE FROM Users");
	});

	afterEach(async () => {
		await pool.query("DELETE FROM Users");
	});

	it("createUser", async () => {
		const user = await createUser("test_user", "Test User");
		expect(user).to.have.property("userid", "test_user");
		expect(user).to.have.property("name", "Test User");
	});

	it("getUserById", async () => {
		await createUser("test_user", "Test User");
		const user = await getUserById("test_user");
		expect(user).to.have.property("userid", "test_user");
		expect(user).to.have.property("name", "Test User");
	});

	it("updateUser", async () => {
		await createUser("test_user", "Test User");
		const updatedUser = await updateUser("test_user", "Updated User");
		expect(updatedUser).to.have.property("userid", "test_user");
		expect(updatedUser).to.have.property("name", "Updated User");
	});
});
