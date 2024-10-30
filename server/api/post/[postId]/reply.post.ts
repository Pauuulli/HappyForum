import { object, string, number, InferType } from "yup";
import { pool } from "~/server/utils/database/client";
import { authEventHandler } from "~/server/utils/auth-handler";
import { dompurify } from "~/server/utils/dompurify";

type Comment = InferType<typeof schema>;

const schema = object({
  content: string().required().max(5000),
});

export default authEventHandler(async (evt, userId) => {
  const postId = getRouterParam(evt, "postId")!;
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
  content = dompurify.sanitize(content);

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
