import { pool } from "../db/dbConfig.mjs";

before(async () => {});

after(async () => {
	await pool.end();
});
