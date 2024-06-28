import { expect } from "chai";
import fs from "fs";
import { promisify } from "util";
import {
	readAndChunkFile,
	generateEmbeddingsForChunks,
	docToEmbeddings,
	getEmbedding,
} from "../../utils/toVec.mjs";

const readFile = promisify(fs.readFile);

describe("Document Embeddings Module", () => {
	describe("readAndChunkFile", () => {
		it("should read and chunk file correctly", async () => {
			const filePath = "./testfile.txt";
			const fileContent = "This is a test file content.";
			await fs.promises.writeFile(filePath, fileContent);
			const chunks = await readAndChunkFile(filePath);
			await fs.promises.unlink(filePath);

			expect(chunks).to.be.an("array");
			expect(chunks.join("")).to.equal(fileContent);
		});
	});

	describe("generateEmbeddingsForChunks", () => {
		it("should generate embeddings for chunks", async () => {
			const chunks = ["This is a test chunk."];
			const embeddings = await generateEmbeddingsForChunks(chunks);
			expect(embeddings).to.be.an("array");
			expect(embeddings[0]).to.have.property("text", chunks[0]);
			expect(embeddings[0]).to.have.property("vector").that.is.an("array");
		});
	});

	describe("docToEmbeddings", () => {
		it("should read file and generate embeddings", async () => {
			const filePath = "./testfile.txt";
			const fileContent = "This is a test file content.";
			await fs.promises.writeFile(filePath, fileContent);

			const embeddings = await docToEmbeddings(filePath);
			await fs.promises.unlink(filePath);

			expect(embeddings).to.be.an("array");
			expect(embeddings[0]).to.have.property("text", fileContent);
			expect(embeddings[0]).to.have.property("vector").that.is.an("array");
		});
	});

	describe("getEmbedding", () => {
		it("should generate embedding for text", async () => {
			const text = "This is a test query.";
			const embedding = await getEmbedding(text);
			expect(embedding).to.be.an("array");
		});
	});
});
