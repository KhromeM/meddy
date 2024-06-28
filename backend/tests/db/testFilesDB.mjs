import { expect } from "chai";
import { pool } from "../../db/dbConfig.mjs";
import { createFile, getFileById, updateFile } from "../../db/dbFiles.mjs";
import { createUser } from "../../db/dbUser.mjs";

let user1, user2;

describe("DB File Functions", () => {
	before(async () => {
		await pool.query("DELETE FROM Files");
		await pool.query("DELETE FROM Users");
		user1 = await createUser("test_user1", "Test User 1");
		user2 = await createUser("test_user2", "Test User 2");
	});

	afterEach(async () => {
		await pool.query("DELETE FROM Files");
	});

	after(async () => {
		await pool.query("DELETE FROM Users");
	});

	it("createFile", async () => {
		const file = await createFile(
			user1.userid,
			"png",
			"test_image.png",
			1024,
			"/path/to/test_image.png",
			"http://example.com/test_image.png"
		);
		expect(file).to.have.property("userid", user1.userid);
		expect(file).to.have.property("type", "png");
		expect(file).to.have.property("name", "test_image.png");
		expect(file).to.have.property("bytesize", 1024);
		expect(file).to.have.property("localpath", "/path/to/test_image.png");
		expect(file).to.have.property(
			"accessurl",
			"http://example.com/test_image.png"
		);
	});

	it("getFileById", async () => {
		const createdFile = await createFile(
			user1.userid,
			"png",
			"test_image.png",
			1024,
			"/path/to/test_image.png",
			"http://example.com/test_image.png"
		);
		const file = await getFileById(createdFile.fileid);
		expect(file).to.have.property("userid", user1.userid);
		expect(file).to.have.property("type", "png");
		expect(file).to.have.property("name", "test_image.png");
		expect(file).to.have.property("bytesize", 1024);
		expect(file).to.have.property("localpath", "/path/to/test_image.png");
		expect(file).to.have.property(
			"accessurl",
			"http://example.com/test_image.png"
		);
	});

	it("updateFile", async () => {
		const createdFile = await createFile(
			user1.userid,
			"png",
			"test_image.png",
			1024,
			"/path/to/test_image.png",
			"http://example.com/test_image.png"
		);
		const updatedFile = await updateFile(
			createdFile.fileid,
			user1.userid,
			"mp4",
			"updated_video.mp4",
			2048,
			"/path/to/updated_video.mp4",
			"http://example.com/updated_video.mp4"
		);
		expect(updatedFile).to.have.property("userid", user1.userid);
		expect(updatedFile).to.have.property("type", "mp4");
		expect(updatedFile).to.have.property("name", "updated_video.mp4");
		expect(updatedFile).to.have.property("bytesize", 2048);
		expect(updatedFile).to.have.property(
			"localpath",
			"/path/to/updated_video.mp4"
		);
		expect(updatedFile).to.have.property(
			"accessurl",
			"http://example.com/updated_video.mp4"
		);
	});

	it("user1 should not access user2's files", async () => {
		const file1 = await createFile(
			user1.userid,
			"png",
			"test_image1.png",
			1024,
			"/path/to/test_image1.png",
			"http://example.com/test_image1.png"
		);
		const file2 = await createFile(
			user2.userid,
			"png",
			"test_image2.png",
			2048,
			"/path/to/test_image2.png",
			"http://example.com/test_image2.png"
		);

		// Ensure user1's file can be accessed by user1
		const fetchedFile1 = await getFileById(file1.fileid);
		expect(fetchedFile1).to.have.property("userid", user1.userid);
		expect(fetchedFile1).to.have.property("name", "test_image1.png");

		// Ensure user2's file can be accessed by user2
		const fetchedFile2 = await getFileById(file2.fileid);
		expect(fetchedFile2).to.have.property("userid", user2.userid);
		expect(fetchedFile2).to.have.property("name", "test_image2.png");

		// Ensure user1 cannot access user2's file
		try {
			await getFileById(file2.fileid);
		} catch (err) {
			expect(err).to.exist;
		}
	});
});
