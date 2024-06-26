import pg from "pg";

export const pool = new pg.Pool({
	user: "postgres",
	host: "localhost",
	database: "meddysql",
	password: "password",
	port: 5432,
});
