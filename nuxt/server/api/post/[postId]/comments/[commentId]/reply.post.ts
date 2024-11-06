import { object, string, number, InferType } from "yup";
import { pool } from "~/server/utils/database/client";
import { authEventHandler } from "~/server/utils/auth-handler";
import { dompurify } from "~/server/utils/dompurify";

type CommentReply = InferType<typeof schema>;

const schema = object({
  content: string().required().max(5000),
});

export default authEventHandler(async (evt, userId) => {
  const {commentId: parentId, postId} = getRouterParams(evt);
  let { content } = await readValidatedBody<CommentReply>(
    evt,
    (body) => schema.validate(body),
  );

  await checkMatchParentPost(parentId, postId);

  const commentId = await createNewCommentReply();
  setResponseStatus(evt, 201);
  return { commentId };

  async function createNewCommentReply() {
    content = dompurify.sanitize(content);

    const query = `
        INSERT INTO comments(content, user_id, post_id, parent_id)
        VALUES($1, $2, $3, $4)
        RETURNING comment_id;
        `;
    const {
      rows: [{ comment_id }],
    } = await pool.query(query, [content, userId, postId, parentId]);
    return comment_id;
  }
});

async function checkMatchParentPost(parentId: string, postId: string) {
  const qry = `
    SELECT post_id
    FROM comments
    WHERE comment_id = $1;
  `;
  const { rows } = await pool.query(qry, [parentId]);
  if (rows.length == 0)
    throw createError({
      statusCode: 404,
      message: "Parent comment not found.",
    });

  const { post_id: parentPostId } = rows[0];
  if (parentPostId != postId)
    throw createError({
      statusCode: 400,
      message: "Comment's postId does not match that of the parent.",
    });
}
