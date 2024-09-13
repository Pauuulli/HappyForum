import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  password: "541455",
  host: "localhost",
  port: 5432,
  database: "PaulGorForum",
});
//const client = new Client();

// try{
//   await client.connect();
//   console.log("Connected to PostgreSQL database");
// }
// catch(e){
//   console.error("Error connecting to PostgreSQL database", e);
// }

// function runQuery(qstr: string){
//   return new Promise<{rows: any}>((rsv, rjt) =>
//     client.query(qstr, (err: any, result: { rows: any }) => {
//       if (err) {
//         console.error("Error executing query", err);
//         rjt(new Error("Query Error"));
//       } else {
//         console.log("Query result:", result.rows);
//         rsv(result);
//       }
//     }),
//   );
// }

export { pool };
