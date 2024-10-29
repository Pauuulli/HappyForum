import { authEventHandler } from "~/server/utils/auth-handler";
import { object, number } from "yup";
import { pool } from "~/server/utils/database/client";

interface Vote {
  choice: 1 | 2; // 1: up, 2: down
}

export default authEventHandler(async (evt, userId) => {
  const postId = getRouterParam(evt, "postId")!;
  const vote = await readValidatedBody(evt, validateVote);
  await createNewVote();
  const voteDetails = await getVoteDetails();
  setResponseStatus(evt, 201);
  return voteDetails;
  
  async function createNewVote() {
    const query = `
      INSERT INTO post_votes (user_id, post_id, is_up)
      VALUES($1, $2, $3);
      `;
    await pool.query(query, [userId, postId, vote.choice == 1]);
  }

  async function getVoteDetails() {
    const qry = `
      SELECT * FROM get_vote_details('posts', $2) WHERE id = $1
    `;

    const {
      rows: [vote_details],
    } = await pool.query(qry, [postId, userId]);
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
