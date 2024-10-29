import { pool } from "~/server/utils/database/client";
import { object, string } from "yup";
import bcrypt from "bcrypt";
import { rethrowQueryError } from "~/server/utils/database/error-handler";

interface User {
  name: string;
  password: string;
  email: string;
}

export default eventHandler<{
  body: { name: string; password: string; email: string };
}>(async (event) => {
  const user = await readValidatedBody(event, validateData);

  try {
    const userId = await registerNewUser(user);
    setResponseStatus(event, 201);
    return { userId };
  } catch (e) {
    rethrowQueryError(e);
  }
});

async function registerNewUser(params: User) {
  let { name, password, email } = params;
  email = email.toLowerCase();
  const passwordHash = await hashPassword(password);
  const text = `
   INSERT INTO users(name, password, email, created_at)
   VALUES($1, $2, $3, $4)
   RETURNING user_id;
  `;

  const {
    rows: [{ user_id }],
  } = await pool.query(text, [
    name,
    passwordHash,
    email,
    new Date().toISOString(),
  ]);
  return user_id;
}

async function validateData(reqBody: unknown) {
  const schema = object({
    name: string()
      .required()
      .max(50, "User name must be at most 50 characters"),
    password: string()
      .required()
      .max(50, "Password must be at most 50 characters."),
    email: string().required().email(),
  });
  try {
    await schema.validate(reqBody);
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid Data: ${e}`,
    });
  }

  return reqBody as User;
}

async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
