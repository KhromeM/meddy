import fs from "fs";
import { promisify } from "util";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import CONFIG from "../config.mjs";
import { OpenAIEmbeddings } from "@langchain/openai";

const MODEL_STRING = "text-embedding-3-large";
const model = new OpenAIEmbeddings();
model.modelName = MODEL_STRING;
model.apiKey = CONFIG.OPENAI_API_KEY;
const CHUNK_SIZE = 2048;

const readFile = promisify(fs.readFile);

const readAndChunkFile = async (filePath) => {
	const fileContent = await readFile(filePath, "utf-8");
	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: CHUNK_SIZE,
		chunkOverlap: CHUNK_SIZE / 8,
	});
	const chunks = await textSplitter.splitText(fileContent);
	return chunks;
};

const generateEmbeddingsForChunks = async (chunks) => {
	const embeddings = await model.embedDocuments(chunks);
	for (let i = 0; i < chunks.length; i++) {
		embeddings[i] = { text: chunks[i], vector: embeddings[i] };
	}
	return embeddings;
};

export const getEmbedding = async (text) => {
	return await model.embedQuery(text);
};

export const docToEmbeddings = async (filepath) => {
	const chunks = await readAndChunkFile(filepath);
	const embeddings = await generateEmbeddingsForChunks(chunks);
	return embeddings;
};

let a = await getEmbedding("apple");
console.log(a.length);
