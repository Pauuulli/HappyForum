import pg from "pg";

const { Client } = pg;
const client = new Client({
  user: "postgres",
  password: "541455",
  host: "localhost",
  port: 5432,
  database: "PaulGorForum",
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err: any) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

export { client };
