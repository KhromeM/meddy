import { pool } from "../db/dbConfig.mjs";

before(async () => {
	console.log("STARTING TESTS:");
});

describe("Test startup", () => {
	it("Runs tests", () => {
		console.log("Tests are running.");
	});
});

after(async () => {
	await pool.end();
	console.log(pool);
});
