import { authEventHandler } from "~/server/util/auth-handler";
import { object, number } from "yup";
import { pool } from "~/server/database/client";

interface Vote {
  userId: number;
  postId: number;
  type: 1 | 2; // 1: up, 2: down
}

export default authEventHandler(async (evt) => {
  const vote = await readValidatedBody(evt, validateVote);
  await createNewVote(vote);
  setResponseStatus(evt, 201);
});

async function createNewVote(v: Vote) {
  const { userId, postId, type } = v;
  const query = `
    INSERT INTO post_votes (user_id, post_id, is_up)
    VALUES($1, $2, $3);
    `;
  await pool.query(query, [userId, postId, type == 1]);
}

async function validateVote(reqBody: unknown) {
  const schema = object({
    userId: number().required(),
    postId: number().required(),
    type: number().required().min(1).max(2),
  });
  try {
    await schema.validate(reqBody);
  } catch (e: any) {
    throw createError({ statusCode: 400, message: `Invalid Data:\n${e}` });
  }

  return reqBody as Vote;
}
