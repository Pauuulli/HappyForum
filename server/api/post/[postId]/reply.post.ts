import { object, string, number, InferType } from "yup";
import { pool } from "~/server/utils/database/client";
import { authEventHandler } from "~/server/utils/auth-handler";

type Comment = InferType<typeof schema>;

const schema = object({
  content: string().required().max(5000),
});

export default authEventHandler(async (evt, userId) => {
  const postId = getRouterParam(evt, "id")!;
  const { content } = await readValidatedBody<Comment>(evt, (body) =>
    schema.validate(body),
  );
  const commentId = await createNewComment(postId, content, userId);
  setResponseStatus(evt, 201);
  return { commentId };
});

async function createNewComment(
  postId: string,
  content: string,
  userId: string,
) {
  const query = `
    INSERT INTO comments(content, user_id, post_id)
    VALUES($1, $2, $3)
    RETURNING comment_id;
    `;
  const {
    rows: [{ comment_id }],
  } = await pool.query(query, [content, userId, postId]);
  return comment_id;
}
