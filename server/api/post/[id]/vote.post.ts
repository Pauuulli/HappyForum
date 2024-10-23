import { authEventHandler } from "~/server/utils/auth-handler";
import { object, number } from "yup";
import { pool } from "~/server/utils/database/client";
import { getPostDetails } from "./index.get";

interface Vote {
  type: 1 | 2; // 1: up, 2: down
}

export default authEventHandler(async (evt, userId) => {
  const postId = getRouterParam(evt, "id")!;
  const vote = await readValidatedBody(evt, validateVote);
  await createNewVote();
  setResponseStatus(evt, 201);

  async function createNewVote() {
    const query = `
      INSERT INTO post_votes (user_id, post_id, is_up)
      VALUES($1, $2, $3);
      `;
    await pool.query(query, [userId, postId, vote.type == 1]);
  }

  return await getPostDetails(postId, userId);
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
