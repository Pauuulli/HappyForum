import { checkIsAuthed } from "~/server/auth";

export default eventHandler(async (evt) => {
  const postId = getRouterParam(evt, "postId")!;
  const { userId } = await checkIsAuthed(evt);

  return await getPostDetails(postId, userId);
});

async function getPostDetails(postId: string, userId?: string) {
  const qry = `
    SELECT
      u.name publisher,
      p.created_at,
      p.title,
      p.cat_id
    FROM
      posts p
      JOIN users u USING(user_id)
    WHERE p.post_id = $1;
    ;
  `;

  const { rows } = await pool.query(qry, [postId]);
  if (rows.length == 0) throw createError({ statusCode: 404 });
  return objectKeyToCamel(rows[0]);
}
