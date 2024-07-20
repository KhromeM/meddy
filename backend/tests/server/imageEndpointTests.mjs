import { expect } from "chai";
import supertest from "supertest";
import { app, server } from "../../server.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Image API Tests", function () {
	this.timeout(10000);
	let request = supertest(app);
	const testUser = { userid: "DEVELOPER" };
	const imagePath = path.join(__dirname, "../test_assets/cookies.jpeg");

	beforeEach(async () => {
		request = supertest(app);
	});

	after(async () => {
		server.close();
	});

	it("Retrieve image endpoint test", async () => {
		const response = await request
			.get("/api/image")
			.send({ image: "cookies.jpeg", idToken: "dev" });
		expect(response.status).to.equal(200);
		expect(response.headers["content-type"]).to.equal("image/jpeg");
		expect(response.body).to.be.an.instanceof(Buffer);
	});

	it("Upload image endpoint test", async () => {
		const imageBuffer = await fs.promises.readFile(imagePath);
		const base64Image = imageBuffer.toString("base64");

		const response = await request.post("/api/image").send({
			image: {
				name: "cookies2.jpeg",
				data: base64Image,
			},
			idToken: "dev",
		});

		expect(response.status).to.equal(200);
		expect(response.body.message).to.equal("File uploaded successfully");

		// Verify the file was actually saved
		const uploadedFilePath = path.join(
			__dirname,
			"../../uploads",
			testUser.userid,
			"cookies2.jpeg"
		);
		const fileExists = await fs.promises
			.access(uploadedFilePath)
			.then(() => true)
			.catch(() => false);
		expect(fileExists).to.be.true;
	});
});
