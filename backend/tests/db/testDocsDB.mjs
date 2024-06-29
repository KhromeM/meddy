import { expect } from "chai";
import { pool } from "../../db/dbConfig.mjs";
import {
	createDocument,
	getDocumentById,
	getDocumentsByFileId,
	deleteDocumentsByFileId,
	queryWithVec,
} from "../../db/dbDocuments.mjs";
import { createUser } from "../../db/dbUser.mjs";
import { createFile } from "../../db/dbFiles.mjs";

let user1, user2, file1, file2;

describe("DB Document Functions", () => {
	before(async () => {
		await pool.query("DELETE FROM Messages");
		await pool.query("DELETE FROM Documents");
		await pool.query("DELETE FROM Files");
		await pool.query("DELETE FROM Users");
		user1 = await createUser("test_user1", "Test User 1");
		user2 = await createUser("test_user2", "Test User 2");
		file1 = await createFile(
			user1.userid,
			"pdf",
			"test_file1.pdf",
			2048,
			"/path/to/test_file1.pdf",
			"http://example.com/test_file1.pdf"
		);
		file2 = await createFile(
			user2.userid,
			"pdf",
			"test_file2.pdf",
			2048,
			"/path/to/test_file2.pdf",
			"http://example.com/test_file2.pdf"
		);
	});

	afterEach(async () => {
		await pool.query("DELETE FROM Documents");
	});

	after(async () => {
		await pool.query("DELETE FROM Files");
		await pool.query("DELETE FROM Users");
	});

	it("createDocument", async () => {
		const embedding = [0.1, 0.2, 0.3];
		const document = await createDocument(
			user1.userid,
			"Sample text for document",
			embedding,
			"pdf",
			file1.fileid,
			1
		);
		expect(document).to.have.property("userid", user1.userid);
		expect(document).to.have.property("fileid", file1.fileid);
		expect(document).to.have.property("type", "pdf");
		expect(document).to.have.property("text", "Sample text for document");
		// expect(document)
		// 	.to.have.property("embedding")
		// 	.that.is.an("array")
		// 	.that.deep.equals(embedding);
		expect(document).to.have.property("Order", 1);
	});

	it("getDocumentById", async () => {
		const embedding = [0.1, 0.2, 0.3];
		const createdDocument = await createDocument(
			user1.userid,
			"Sample text for document",
			embedding,
			"pdf",
			file1.fileid,
			1
		);
		const document = await getDocumentById(createdDocument.documentid);
		expect(document).to.have.property("userid", user1.userid);
		expect(document).to.have.property("fileid", file1.fileid);
		expect(document).to.have.property("type", "pdf");
		expect(document).to.have.property("text", "Sample text for document");
		// expect(document)
		// 	.to.have.property("embedding")
		// 	.that.is.an("array")
		// 	.that.deep.equals(embedding);
		expect(document).to.have.property("Order", 1);
	});

	it("getDocumentsByFileId", async () => {
		const embedding1 = [0.1, 0.2, 0.3];
		const embedding2 = [0.4, 0.5, 0.6];
		await createDocument(
			user1.userid,
			"First document text",
			embedding1,
			"pdf",
			file1.fileid,
			1
		);
		await createDocument(
			user1.userid,
			"Second document text",
			embedding2,
			"pdf",
			file1.fileid,
			2
		);
		const documents = await getDocumentsByFileId(file1.fileid);
		expect(documents).to.have.lengthOf(2);
		expect(documents[0]).to.have.property("text", "First document text");
		expect(documents[1]).to.have.property("text", "Second document text");
	});

	it("deleteDocumentsByFileId", async () => {
		const embedding = [0.1, 0.2, 0.3];
		await createDocument(
			user1.userid,
			"Sample text for document",
			embedding,
			"pdf",
			file1.fileid,
			1
		);
		await deleteDocumentsByFileId(file1.fileid);
		const documents = await getDocumentsByFileId(file1.fileid);
		expect(documents).to.have.lengthOf(0);
	});

	it("queryWithVec", async () => {
		const embedding1 = [0.1, 0.2, 0.3];
		const embedding2 = embedding1.map((n) => n * 2);
		const embedding3 = embedding1.map((n) => n * 3);
		const embedding4 = embedding1.map((n) => n * 4);
		const embedding5 = embedding1.map((n) => n * 5);
		await createDocument(
			user1.userid,
			"First document text",
			embedding1,
			"pdf",
			file1.fileid,
			1
		);
		await createDocument(
			user1.userid,
			"Second document text",
			embedding2,
			"pdf",
			file1.fileid,
			2
		);
		await createDocument(
			user1.userid,
			"Third document text",
			embedding3,
			"pdf",
			file1.fileid,
			3
		);
		await createDocument(
			user1.userid,
			"Fourth document text",
			embedding4,
			"pdf",
			file1.fileid,
			4
		);
		await createDocument(
			user1.userid,
			"Fifth document text",
			embedding5,
			"pdf",
			file1.fileid,
			5
		);
		const queryVector = [0, 0, 0];
		const result = await queryWithVec(user1.userid, queryVector, 10);
		expect(result).to.have.lengthOf(5);
		expect(result[0]).to.have.property("text", "First document text");
	});
});
