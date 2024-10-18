import { COMMENTS_PER_PAGE } from "~/server/config/comment/list";
import { InferType } from "yup";
import { querySchema } from "~/server/schema/query";

export default eventHandler(async (evt) => {
  const postId = getRouterParam(evt, "id");

  const { page, sort: rawSort } = await getValidatedQuery<
    InferType<typeof querySchema>
  >(evt, (query) => querySchema.validate(query));

  const [field, order] = rawSort?.[0] ?? [];
  const sort = field == "vote_diff" ? `${field} ${order}` : "created_at";

  const cmtQry = `
    SELECT
        c.comment_id,
        u.name publisher,
        c.created_at created_at,
        c.content,
        c.parent_id,
        SUM(CASE WHEN cv.is_up THEN 1 ELSE 0 END) up_votes,
        SUM(CASE WHEN NOT cv.is_up THEN 1 ELSE 0 END) down_votes,
        (
            SUM(CASE WHEN cv.is_up THEN 1 ELSE 0 END) - 
            SUM(CASE WHEN NOT cv.is_up THEN 1 ELSE 0 END)
        ) vote_diff,
        COUNT(child_c.parent_id) child_count
    FROM
        comments c
        JOIN users u USING(user_id)
        LEFT JOIN comment_votes cv USING(comment_id)
        LEFT JOIN comments child_c ON c.comment_id = child_c.parent_id 
    WHERE c.post_id = ${postId}
    GROUP BY
        c.comment_id,
        u.name,
        c.created_at,
        c.content
    ORDER BY ${sort};
  `;

  // const qry = `
  //   WITH comments_base AS(
  //     SELECT
  //           c.comment_id,
  //           u.name publisher,
  //           c.created_at created_at,
  //           c.content,
  //           c.parent_id
  //     FROM
  //           comments c
  //           JOIN users u USING(user_id)
  //     WHERE c.post_id = 2
  //   ),
  //   count_votes AS(
  //     SELECT
  //       cmt_b.comment_id,
  //       SUM(CASE WHEN cv.is_up THEN 1 ELSE 0 END) up_votes,
  //       SUM(CASE WHEN NOT cv.is_up THEN 1 ELSE 0 END) down_votes,
  //       (
  //         SUM(CASE WHEN cv.is_up THEN 1 ELSE 0 END) - 
  //         SUM(CASE WHEN NOT cv.is_up THEN 1 ELSE 0 END)
  //       ) vote_diff,
  //       (
  //         CASE
  //           WHEN NOT (BOOL_OR(cv.user_id = 8) IS true) THEN NULL
  //           WHEN BOOL_OR(cv.user_id = 8 AND cv.is_up) THEN 'up'
  //           ELSE 'down'
  //         END
  //       ) voted
  //     FROM
  //       comments_base cmt_b
  //       LEFT JOIN comment_votes cv USING(comment_id)
  //     GROUP BY
  //       cmt_b.comment_id
  //   ),
  // `;

  const { data: comments, pagination } = await getPaginatedData(
    cmtQry,
    COMMENTS_PER_PAGE,
    page,
  );

  const commentsWithParentPromises = comments.map(async (cmt) => {
    const parents = await getCommentParents(cmt.parentId);
    return { ...cmt, parents };
  });
  const commentsWithParent = await Promise.all(commentsWithParentPromises);

  return { data: commentsWithParent, pagination };
});

async function getCommentParents(firstParentId: string) {
  const qry = `
    SELECT content, parent_id FROM comments WHERE comment_id = $1;
    `;

  let parents: { commentId: string; content: string }[] = [];
  let currentId = firstParentId;
  while (true) {
    const { rows } = await pool.query(qry, [currentId]);
    if (rows.length == 0) return parents;

    const { content, parent_id: nextId } = rows[0];
    parents.push({ commentId: currentId, content });
    currentId = nextId;
  }
}
