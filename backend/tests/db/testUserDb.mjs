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
		const user = await createUser(
			"test_user",
			"Test User",
			"123 Test St",
			"test@example.com",
			"English",
			"123-456-7890",
			"erXuFYUfucBZaryVksYEcMg3"
		);
		expect(user).to.have.property("userid", "test_user");
		expect(user).to.have.property("name", "Test User");
		expect(user).to.have.property("address", "123 Test St");
		expect(user).to.have.property("email", "test@example.com");
		expect(user).to.have.property("language", "English");
		expect(user).to.have.property("phone", "123-456-7890");
		expect(user).to.have.property("patientid", "erXuFYUfucBZaryVksYEcMg3");
	});

	it("createUser with minimal info", async () => {
		const user = await createUser("minimal_user", "Minimal User", null, null, null, null, null);
		expect(user).to.have.property("userid", "minimal_user");
		expect(user).to.have.property("name", "Minimal User");
		expect(user).to.have.property("address").to.be.null;
		expect(user).to.have.property("email").to.be.null;
		expect(user).to.have.property("language").to.be.null;
		expect(user).to.have.property("phone").to.be.null;
		expect(user).to.have.property("patientid").to.be.null;
	});

	it("getUserById", async () => {
		await createUser(
			"test_user",
			"Test User",
			"123 Test St",
			"test@example.com",
			"English",
			"123-456-7890",
			"erXuFYUfucBZaryVksYEcMg3"
		);
		const user = await getUserById("test_user");
		expect(user).to.have.property("userid", "test_user");
		expect(user).to.have.property("name", "Test User");
		expect(user).to.have.property("address", "123 Test St");
		expect(user).to.have.property("email", "test@example.com");
		expect(user).to.have.property("language", "English");
		expect(user).to.have.property("phone", "123-456-7890");
		expect(user).to.have.property("patientid", "erXuFYUfucBZaryVksYEcMg3");
	});

	it("updateUser", async () => {
		await createUser(
			"test_user",
			"Test User",
			"123 Test St",
			"test@example.com",
			"English",
			"123-456-7890",
			"erXuFYUfucBZaryVksYEcMg3"
		);
		const updatedUser = await updateUser(
			"test_user",
			"Updated User",
			"456 Updated St",
			"updated@example.com",
			"French",
			"987-654-3210",
			"eq081-VQEgP8drUUqCWzHfw3"
		);
		expect(updatedUser).to.have.property("userid", "test_user");
		expect(updatedUser).to.have.property("name", "Updated User");
		expect(updatedUser).to.have.property("address", "456 Updated St");
		expect(updatedUser).to.have.property("email", "updated@example.com");
		expect(updatedUser).to.have.property("language", "French");
		expect(updatedUser).to.have.property("phone", "987-654-3210");
		expect(updatedUser).to.have.property("patientid", "eq081-VQEgP8drUUqCWzHfw3");
	});
});
