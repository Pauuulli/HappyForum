import { authEventHandler } from "~/server/utils/auth-handler";
import { object, number } from "yup";
import { pool } from "~/server/utils/database/client";
import { rethrowQueryError } from "~/server/utils/database/error-handler";

interface Vote {
  choice: 1 | 2; // 1: up, 2: down
}

export default authEventHandler(async (evt, userId) => {
  const { commentId } = getRouterParams(evt);
  const { choice } = await readValidatedBody(evt, validateVote);
  try {
    await createNewVote();
  } catch (e) {
    rethrowQueryError(e);
  }
  setResponseStatus(evt, 201);
  return getLatestVote();

  async function createNewVote() {
    const query = `
      INSERT INTO comment_votes (user_id, comment_id, is_up)
      VALUES($1, $2, $3);
      `;
    await pool.query(query, [userId, commentId, choice == 1]);
  }

  async function getLatestVote() {
    const qry = `
      SELECT * FROM get_vote_details('comments', $2) WHERE id = $1
    `;

    const {
      rows: [vote_details],
    } = await pool.query(qry, [commentId, userId]);
    return objectKeyToCamel(vote_details);
  }
});

async function validateVote(reqBody: unknown) {
  const schema = object({
    choice: number().required().min(1).max(2),
  });
  try {
    await schema.validate(reqBody);
  } catch (e: any) {
    throw createError({ statusCode: 400, message: `Invalid Data:\n${e}` });
  }

  return reqBody as Vote;
}
