import { object, string } from "yup";
import bcrypt from "bcrypt";
import { pool } from "~/server/utils/database/client";
import { rethrowQueryError } from "~/server/utils/database/error-handler";
import { setJwtCookies } from "~/server/auth";

interface SigninBody {
  name: string;
  password: string;
}

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, validateUser);
  if (!result.valid)
    throw createError({ statusCode: 400, statusMessage: "Invalid user data." });

  const { name, password } = result.body;
  const user = await getUser(name);
  if (user == null)
    throw createError({ statusCode: 404, statusMessage: "User not found." });
  const { hash, id } = user;

  const success = await comparePassword(password, hash);
  if (!success)
    throw createError({
      statusCode: 401,
      statusMessage: "Incorrect password.",
    });

  await updateLastLogin(name);
  /* Authorization */
  const { exp } = await setJwtCookies(event, String(id));
  setResponseStatus(event, 201);
  return { name, exp };
});

async function validateUser(reqBody: unknown) {
  const schema = object({
    name: string().required().max(50),
    password: string().required().max(50),
  });

  try {
    await schema.validate(reqBody);
  } catch (e: any) {
    return { valid: false, err: e.errors } as const;
  }
  return { valid: true, body: reqBody as SigninBody } as const;
}

async function getUser(
  name: string,
): Promise<{ hash: string; id: number } | undefined> {
  const text = `
    SELECT user_id AS id, password
    FROM users
    WHERE name = $1
    `;

  try {
    const { rows } = await pool.query(text, [name]);
    if (rows.length == 0) return undefined;
    return { hash: rows[0].password, id: rows[0].id };
  } catch (e) {
    rethrowQueryError(e);
    throw e;
  }
}

async function updateLastLogin(name: string) {
  const query = `
  UPDATE users
  SET last_login = $1
  WHERE name = $2;
  `;

  await pool.query(query, [new Date().toISOString(), name]);
}

async function comparePassword(pw: string, hash: string) {
  return await bcrypt.compare(pw, hash);
}
