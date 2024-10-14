import { COMMENTS_PER_PAGE } from "~/server/config/comment/list";

export default eventHandler(async (evt) => {
  const postId = getRouterParam(evt, "id");

  const urlQuery: Record<string, string> = getQuery(evt);
  const page = isNaN(+urlQuery.page) ? 0 : parseInt(urlQuery.page);
  const urlSort = urlQuery.sort;

  const sort = getSort(urlSort);

  const qry = `
    SELECT
        c.comment_id id,
        u.name publisher,
        c.created_at createdAt,
        c.content,
        SUM(CASE WHEN cv.is_up THEN 1 ELSE 0 END) up_votes,
        SUM(CASE WHEN NOT cv.is_up THEN 1 ELSE 0 END) down_votes,
        (
            SUM(CASE WHEN cv.is_up THEN 1 ELSE 0 END) - 
            SUM(CASE WHEN NOT cv.is_up THEN 1 ELSE 0 END)
        ) vote_diff
    FROM
        comments c
        JOIN users u USING(user_id)
        LEFT JOIN comment_votes cv USING(comment_id)
    WHERE c.post_id = ${postId}
    GROUP BY
        c.comment_id,
        u.name,
        c.created_at,
        c.content
    ORDER BY ${sort.column} ${sort.mode};
  `;

  return await getPaginatedData(qry, COMMENTS_PER_PAGE, page);
});

function getSort(urlSort: string | undefined) {
  let mode = "";
  let column = "c.created_at";
  if (urlSort != null) {
    let tempSort = urlSort;
    if (tempSort[0] == "-") {
      mode = "DESC";
      tempSort = tempSort.slice(1);
    }
    if (tempSort == "vote") column = "vote_diff";
  }

  return { column, mode };
}
