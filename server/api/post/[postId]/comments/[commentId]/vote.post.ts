import { authEventHandler } from "~/server/utils/auth-handler";
import { object, number } from "yup";
import { pool } from "~/server/utils/database/client";
import { handleQueryError } from "~/server/utils/database/error-handler";

interface Vote {
  type: 1 | 2; // 1: up, 2: down
}

export default authEventHandler(async (evt, userId) => {
  const {commentId} = getRouterParams(evt);
  const { type } = await readValidatedBody(evt, validateVote);
  try {
    await createNewVote();
  } catch (e) {
    handleQueryError(e);
  }
  setResponseStatus(evt, 201);

  async function createNewVote() {
    const query = `
      INSERT INTO comment_votes (user_id, comment_id, is_up)
      VALUES($1, $2, $3);
      `;
    await pool.query(query, [userId, commentId, type == 1]);
  }
});

async function validateVote(reqBody: unknown) {
  const schema = object({
    type: number().required().min(1).max(2),
  });
  try {
    await schema.validate(reqBody);
  } catch (e: any) {
    throw createError({ statusCode: 400, message: `Invalid Data:\n${e}` });
  }

  return reqBody as Vote;
}
