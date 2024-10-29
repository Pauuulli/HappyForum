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
      p.content,
      p.title,
      p.cat_id,
      (
        CASE
          WHEN NOT (BOOL_OR (pv.user_id = $2) IS true) THEN NULL
          WHEN BOOL_OR (
            pv.user_id = $2
            AND pv.is_up
          ) THEN 'up'
          ELSE 'down'
        END
      ) voted,
      SUM(CASE WHEN pv.is_up THEN 1 ELSE 0 END) up_votes,
      SUM(CASE WHEN NOT pv.is_up THEN 1 ELSE 0 END) down_votes
    FROM
      posts p
      JOIN users u USING(user_id)
      LEFT JOIN post_votes pv USING(post_id)
    WHERE p.post_id = $1
    GROUP BY
      u.name,
      p.created_at,
      p.title,
      p.cat_id,
      p.content
    ;
  `;

  const { rows } = await pool.query(qry, [postId, userId ?? -1]);
  if (rows.length == 0) throw createError({ statusCode: 404 });
  return objectKeyToCamel(rows[0]);
}
