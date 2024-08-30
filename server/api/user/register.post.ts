import { client } from "~/server/database/client";

export default eventHandler(async (event) => {
  try {
    await registerNewUser("Paul", "123456", "paul@gmail.com");
  } catch (err) {
    if (err instanceof Error) return err.message;
    return err;
  }

  return "success";
});

function registerNewUser(username: string, password: string, email: string) {
  // Validation

  const query = `
   INSERT INTO users(name, password, email, created_at)
   VALUES('${username}', '${password}', '${email}', '${new Date().toISOString()}');
  `;

  return new Promise<void>((rsv, rjt) =>
    client.query(query, (err: any, result: { rows: any }) => {
      if (err) {
        console.error("Error executing query", err);
        rjt(new Error("Query Error"));
      } else {
        console.log("Query result:", result.rows);
        rsv();
      }
    }),
  );
}
