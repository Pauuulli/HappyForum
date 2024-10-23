import { checkIsAuthed } from "~/server/auth";

export default eventHandler(async (evt) => {
  const commentId = getRouterParam(evt, "id")!;
  const { userId } = await checkIsAuthed(evt);

  const qry = `
      SELECT
        u.user_id publisher_id,
        u.name publisher,
        c.created_at,
        c.content,
        (
        CASE
            WHEN NOT (BOOL_OR (cv.user_id = $2) IS true) THEN NULL
            WHEN BOOL_OR (
            cv.user_id = $2
            AND cv.is_up
            ) THEN 'up'
            ELSE 'down'
        END
        ) voted,
        SUM(
          CASE
            WHEN cv.is_up THEN 1
            ELSE 0
          END
        ) up_votes,
        SUM(
          CASE
            WHEN NOT cv.is_up THEN 1
            ELSE 0
          END
        ) down_votes
      FROM
        comments c
        JOIN users u USING(user_id)
        LEFT JOIN comment_votes cv USING(comment_id)
      WHERE
        c.comment_id = $1
      GROUP BY
        publisher_id,
        publisher,
        c.created_at,
        c.content
    `;

  const params = [commentId, userId ?? -1];

  const { rows } = await pool.query(qry, params);
  if (rows[0] == null) throw createError({ statusCode: 404 });
  return objectKeyToCamel(rows[0]);
});
