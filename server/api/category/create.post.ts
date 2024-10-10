import { authEventHandler } from "~/server/util/auth-handler";
import { object, string } from "yup";
import { pool } from "~/server/database/client";
import { handleQueryError } from "~/server/database/error-handler";

export default authEventHandler(async (evt) => {
  const { catName } = await readValidatedBody(evt, validateCategory);

  const qry = `
        INSERT INTO categories(cat_name)
        VALUES($1);
    `;
  try {
    await pool.query(qry, [catName]);
    setResponseStatus(evt, 201);
  } catch (e) {
    handleQueryError(e);
  }
});

async function validateCategory(reqBody: unknown) {
  try {
    await object({
      catName: string().required().max(50),
    }).validate(reqBody);
  } catch (e) {
    throw createError({ statusCode: 400, message: `Invalid Data: ${e}` });
  }

  return reqBody as { catName: string };
}
