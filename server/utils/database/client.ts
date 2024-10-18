import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  password: "541455",
  host: "localhost",
  port: 5432,
  database: "PaulGorForum",
});

export { pool };
