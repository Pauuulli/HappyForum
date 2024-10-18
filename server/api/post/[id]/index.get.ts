export default eventHandler(async (evt) => {
  const postId = getRouterParam(evt, "id");

  const postQry = `
    SELECT
      u.name publisher,
      p.created_at,
      p.content,
      p.title,
      p.cat_id,
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

  const { rows } = await pool.query(postQry, [postId]);
  if (rows.length == 0) throw createError({ statusCode: 404 });
  return objectKeyToCamel(rows[0]);
});
