import { object, string, number, InferType } from "yup";
import { pool } from "~/server/utils/database/client";
import { authEventHandler } from "~/server/utils/auth-handler";

type Comment = InferType<typeof schema>;

const schema = object({
  userId: number().required(),
  postId: number().required(),
  content: string().required().max(5000),
});

export default authEventHandler(async (evt) => {
  const newComment = await readValidatedBody<Comment>(evt, (body) =>
    schema.validate(body),
  );
  const commentId = await createNewComment(newComment);
  setResponseStatus(evt, 201);
  return { commentId };
});

async function createNewComment(cmt: Comment) {
  const { postId, content, userId } = cmt;
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
