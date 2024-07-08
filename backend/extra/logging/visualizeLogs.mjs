import fs from "fs/promises";
import path from "path";

async function parseLogs(logDir) {
	const files = await fs.readdir(logDir);
	const logData = [];

	for (const file of files) {
		if (file.startsWith("LOG_") && file.endsWith(".txt")) {
			const filePath = path.join(logDir, file);
			const content = await fs.readFile(filePath, "utf-8");
			const lines = content.split("\n");
			const data = {
				timestamp: file.replace("LOG_", "").replace(".txt", ""),
				query: lines[0].replace("User query: ", ""),
				queryLength: parseInt(lines[1].replace("User query length: ", "")),
				language: lines[2].replace("User query language: ", ""),
				model: lines[3].replace("LLM model: ", ""),
				llmResponse: lines[4].replace("LLM response: ", ""),
				llmResponseLength: parseInt(
					lines[5].replace("LLM response length: ", "")
				),
				transcriptionLatency: parseInt(lines[6].split(": ")[1]),
				llmLatency: parseInt(lines[7].split(": ")[1]),
				ttsLatency: parseInt(lines[8].split(": ")[1]),
				totalLatency: parseInt(lines[9].split(": ")[1]),
			};
			logData.push(data);
		}
	}
	console.log(logData);
	return logData;
}

async function generateFiles(logData) {
	const htmlContent = await fs.readFile(
		path.join(process.cwd(), "extra", "logging", "template.html"),
		"utf-8"
	);
	const jsContent =
		`const logData = ${JSON.stringify(logData)};\n` +
		(await fs.readFile(
			path.join(process.cwd(), "extra", "logging", "visualization.js"),
			"utf-8"
		));

	const outputDir = path.join(process.cwd(), "extra", "log_visualization");
	await fs.mkdir(outputDir, { recursive: true });

	await fs.writeFile(path.join(outputDir, "index.html"), htmlContent);
	await fs.writeFile(path.join(outputDir, "visualization.js"), jsContent);

	console.log(`Log visualization files saved to ${outputDir}`);
}

async function main() {
	const logDir = path.join(process.cwd(), "extra", "logs");
	const logData = await parseLogs(logDir);
	await generateFiles(logData);
}

main().catch(console.error);
