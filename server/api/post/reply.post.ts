import { object, string, number } from "yup";
import { pool } from "~/server/utils/database/client";
import { authEventHandler } from "~/server/utils/auth-handler";

interface Comment {
  userId: number;
  postId: number;
  content: string;
  replyOf: number;
}

export default authEventHandler(async (evt) => {
  const newComment = await readValidatedBody(evt, validateComment);
  const commentId = await createNewComment(newComment);
  setResponseStatus(evt, 201);
  return { commentId };
});

async function validateComment(reqBody: unknown) {
  const schema = object({
    userId: number().required(),
    postId: number().required(),
    content: string().required().max(5000),
    replyOf: number().notRequired(),
  });
  try {
    await schema.validate(reqBody);
  } catch (e: any) {
    throw createError({ statusCode: 400, message: `Invalid Data:\n${e}` });
  }

  return reqBody as Comment;
}

async function createNewComment(cmt: Comment) {
  const { postId, content, userId, replyOf } = cmt;
  const query = `
    INSERT INTO comments(content, user_id, post_id, reply_of)
    VALUES($1, $2, $3, $4)
    RETURNING comment_id;
    `;
  const {
    rows: [{ comment_id }],
  } = await pool.query(query, [content, userId, postId, replyOf]);
  return comment_id;
}
