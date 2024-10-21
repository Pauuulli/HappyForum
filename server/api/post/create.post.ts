import { checkIsAuthed } from "~/server/auth";
import { object, string, number } from "yup";
import { pool } from "~/server/utils/database/client";

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
  const { title, catId, userId, content } = post;

  const newPostQry = `
    INSERT INTO posts(title, cat_id, content, user_id)
    VALUES($1, $2, $3, $4)
    RETURNING post_id;
    `;
  const {
    rows: [{ post_id }],
  } = await pool.query(newPostQry, [title, catId, content, userId]);

  return post_id;
}
