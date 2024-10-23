import { COMMENTS_PER_PAGE } from "~/server/config/comment/list";
import { InferType } from "yup";
import { querySchema } from "~/server/schema/query";
import { checkIsAuthed } from "~/server/auth";

export default eventHandler(async (evt) => {
  const postId = getRouterParam(evt, "id");

  const { page, sort: rawSort } = await getValidatedQuery<
    InferType<typeof querySchema>
  >(evt, (query) => querySchema.validate(query));

  const [field, order] = rawSort?.[0] ?? [];
  const sort = field == "vote_diff" ? `${field} ${order}` : "created_at";
  console.log(sort);

  const {userId} = await checkIsAuthed(evt);


  const { data: comments, pagination } = await getPaginatedData(
    getQry(sort),
    COMMENTS_PER_PAGE,
    page,
    [postId, userId ?? '-1'],
  );

  const commentsWithParentPromises = comments.map(async (cmt) => {
    if (!cmt.parentId) return cmt;
    const parents = await getCommentParents(cmt.parentId);
    return { ...cmt, parents };
  });
  const commentsWithParent = await Promise.all(commentsWithParentPromises);

  return { data: commentsWithParent, pagination };
});

async function getCommentParents(firstParentId: string) {
  const qry = `
  WITH RECURSIVE
    ancestors AS (
      SELECT
        comment_id,
        parent_id,
        content
      FROM
        comments
      WHERE
        comment_id = $1
      UNION
      SELECT
        c.comment_id,
        c.parent_id,
        c.content
      FROM
        comments c
        JOIN ancestors a ON a.parent_id = c.comment_id
    )
  SELECT
    comment_id,
    content
  FROM
    ancestors
    `;

  const { rows } = await pool.query(qry, [firstParentId]);
  return rows.map((r) => objectKeyToCamel(r)) as {
    commentId: string;
    content: string;
  }[];
}

function getQry(sort: string) {
  return `
  WITH
  comments_base AS (
    SELECT
      c.comment_id,
      u.name publisher,
      c.created_at created_at,
      c.content,
      c.parent_id
    FROM
      comments c
      JOIN users u USING (user_id)
    WHERE
      c.post_id = $1
  ),
  count_votes AS (
    SELECT
      cmt_b.comment_id,
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
      ) down_votes,
      (
        SUM(
          CASE
            WHEN cv.is_up THEN 1
            ELSE 0
          END
        ) - SUM(
          CASE
            WHEN NOT cv.is_up THEN 1
            ELSE 0
          END
        )
      ) vote_diff,
      (
        CASE
          WHEN NOT (BOOL_OR (cv.user_id = $2) IS true) THEN NULL
          WHEN BOOL_OR (
            cv.user_id = $2
            AND cv.is_up
          ) THEN 'up'
          ELSE 'down'
        END
      ) voted
    FROM
      comments_base cmt_b
      LEFT JOIN comment_votes cv USING (comment_id)
    GROUP BY
      cmt_b.comment_id
  ),
  count_child AS (
    SELECT
      cmt_b.comment_id,
      COUNT(child_c.parent_id) count
    FROM
      comments_base cmt_b
      LEFT JOIN comments child_c ON child_c.comment_id = cmt_b.comment_id
    GROUP BY
      cmt_b.comment_id
  )
  SELECT
    cmt_b.comment_id,
    cmt_b.publisher,
    cmt_b.created_at created_at,
    cmt_b.content,
    cmt_b.parent_id,
    cv.up_votes,
    cv.down_votes,
    cv.vote_diff vote_diff,
    cv.voted,
    cc.count
  FROM
    comments_base cmt_b
    JOIN count_votes cv USING (comment_id)
    JOIN count_child cc USING (comment_id)
  ORDER BY
    ${sort}
    `;
}
