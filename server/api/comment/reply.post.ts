import { object, string, number, InferType } from "yup";
import { pool } from "~/server/utils/database/client";
import { authEventHandler } from "~/server/utils/auth-handler";

type CommentReply = InferType<typeof schema>;

const schema = object({
  userId: number().required(),
  commentId: number().required(),
  content: string().required().max(5000),
});

export default authEventHandler(async (evt) => {
  const newCommentReply = await readValidatedBody<CommentReply>(evt, (body) =>
    schema.validate(body),
  );
  const commentReplyId = await createNewCommentReply(newCommentReply);
  setResponseStatus(evt, 201);
  return { commentReplyId };
});

async function createNewCommentReply(cmt: CommentReply) {
  const { commentId, content, userId } = cmt;
  const query = `
      INSERT INTO comment_replies(content, user_id, comment_id)
      VALUES($1, $2, $3)
      RETURNING comment_reply_id;
      `;
  const {
    rows: [{ comment_reply_id }],
  } = await pool.query(query, [content, userId, commentId]);
  return comment_reply_id;
}
