function getCommentQry(sort: string, commentIds?: string[]) {
  const commentIdPlaceHolder = commentIds?.reduce(
    (result, _, idx) => `${result}${idx == 0 ? "" : ","}$${idx + 2}`,
    "",
  );

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
      ${commentIds ? `c.comment_id IN (${commentIdPlaceHolder})` : "c.post_id = $2"}
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
          WHEN NOT (BOOL_OR (cv.user_id = $1) IS true) THEN NULL
          WHEN BOOL_OR (
            cv.user_id = $1
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
    cv.up_votes::INT,
    cv.down_votes::INT,
    cv.vote_diff::INT vote_diff,
    cv.voted,
    cc.count::INT child_count,
    Rank() OVER(ORDER BY created_at)::INT comment_order
  FROM
    comments_base cmt_b
    JOIN count_votes cv USING (comment_id)
    JOIN count_child cc USING (comment_id)
  ORDER BY
    ${sort}
    `;
}

async function appendParentsAndChildren(
  rawComments: { commentId: string; parentId: string }[],
) {
  const commentsWithParentPromises = rawComments.map(async (cmt) => {
    const parents = cmt.parentId ? await getCommentAncestors(cmt.parentId) : [];
    const children = await getCommentChildren(cmt.commentId);
    return { ...cmt, parents, children };
  });
  return await Promise.all(commentsWithParentPromises);
}

async function getCommentAncestors(firstParentId: string) {
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

async function getCommentChildren(parentId: string) {
  const qry = `
    SELECT
      child.comment_id
    FROM
      comments parent
      JOIN comments child ON parent.comment_id = child.parent_id
    WHERE
      parent.comment_id = $1
  `;

  const { rows: children } = await pool.query(qry, [parentId]);

  return children.map((child) => objectKeyToCamel(child));
}

async function getComments(
  postId: string,
  commentIds: string | string[],
  userId?: string,
) {
  commentIds = typeof commentIds == "string" ? [commentIds] : commentIds;

  const qry = `
    SELECT * FROM get_comments($1, $2, $3)
  `;

  const params = [postId, commentIds, userId];

  const { rows: comments } = await pool.query(qry, params);

  const commentsCamel = comments.map(
    (c) => objectKeyToCamel(c) as { commentId: string; parentId: string },
  );
  return await appendParentsAndChildren(commentsCamel);
}

export { getCommentQry, appendParentsAndChildren, getComments };
