import { object, string, number } from "yup";
import { pool } from "~/server/utils/database/client";
import { dompurify } from "~/server/utils/dompurify";

interface Post {
  title: string;
  content: string;
  catId: number;
}

export default authEventHandler(async (evt, userId) => {
  const newPost = await readValidatedBody(evt, validatePost);
  const postId = await createNewPost({ ...newPost, userId });
  setResponseStatus(evt, 201);
  return { postId };
});

async function validatePost(reqBody: unknown) {
  const schema = object({
    title: string().required().max(500),
    content: string().required().max(5000),
    catId: number().required(),
  });
  try {
    await schema.validate(reqBody);
  } catch (e: any) {
    throw createError({ statusCode: 400, message: `Invalid Data:\n${e}` });
  }

  return reqBody as Post;
}

async function createNewPost(post: Post & { userId: string }) {
  let { title, catId, userId, content } = post;
  content = dompurify.sanitize(content);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const newPostQry = `
      INSERT INTO posts(title, cat_id, user_id)
      VALUES($1, $2, $3)
      RETURNING post_id;
      `;
    const {
      rows: [{ post_id }],
    } = await client.query(newPostQry, [title, catId, userId]);

    const cmtQry = `
      INSERT INTO comments(content, user_id, post_id)
      VALUES($1, $2, $3);
    `;
    await client.query(cmtQry, [content, userId, post_id]);

    await client.query("COMMIT");
    return post_id;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
