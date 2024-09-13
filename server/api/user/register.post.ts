import { pool } from "~/server/database/client";
import { object, string } from "yup";
import bcrypt from "bcrypt";
import { handleQueryError } from "~/server/database/error-handler";

interface SignupBody {
  name: string;
  password: string;
  email: string;
}

export default eventHandler<{
  body: { name: string; password: string; email: string };
}>(async (event) => {
  const result = await readValidatedBody(event, validateData);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
    });
  }
  const reqBody = result.body!;

  const isFieldsUnique = await validateUniqueFields(reqBody);
  if (!isFieldsUnique)
    throw createError({
      statusCode: 409,
      statusMessage: "The username or email already exists.",
    });

  const success = await registerNewUser(reqBody);
  if (!success) throw createError({});

  setResponseStatus(event, 201);
  return "success";
});

async function registerNewUser(params: SignupBody) {
  const { name, password, email } = params;
  const passwordHash = await hashPassword(password);
  const text = `
   INSERT INTO users(name, password, email, created_at)
   VALUES($1, $2, $3, $4);
  `;

  try {
    await pool.query(text, [
      name,
      passwordHash,
      email,
      new Date().toISOString(),
    ]);
    return true;
  } catch (e) {
    handleQueryError(e);
    return false;
  }
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
    return { success: false, errors: e.errors };
  }

  return { success: true, body: reqBody as SignupBody };
}

async function validateUniqueFields(params: SignupBody) {
  const { name, email } = params;
  const query = `
  SELECT name
  FROM users
  WHERE name = $1 OR email = $2;
  `;

  try {
    const { rows } = await pool.query(query, [name, email]);
    return !(rows.length > 0);
  } catch (e) {
    handleQueryError(e);
    return false;
  }
}

async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
