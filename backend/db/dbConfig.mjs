import pg from "pg";
import CONFIG from "../config.mjs";

export const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: CONFIG.DB_NAME,
  password: "16042001",
  port: 5432,
});
