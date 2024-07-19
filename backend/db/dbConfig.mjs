import pg from "pg";
import CONFIG from "../config.mjs";

export const pool = new pg.Pool({
	user: "postgres",
	host: "localhost",
	database: CONFIG.DB_NAME,
	password: "51015",
	port: 5432,
});
