import { COMMENTS_PER_PAGE } from "~/server/config/comment/list";
import { object, string, number, InferType } from "yup";
import { querySchema } from "~/server/schema/query";

export default eventHandler(async (evt) => {
  const postId = getRouterParam(evt, "id");

  const postQry = `
    SELECT
      u.name publisher,
      p.created_at
      p.content,
      SUM(CASE WHEN pv.is_up THEN 1 ELSE 0 END) up_votes,
      SUM(CASE WHEN NOT pv.is_up THEN 1 ELSE 0 END) down_votes
  `;

  const { page, sort: rawSort } = await getValidatedQuery<
    InferType<typeof querySchema>
  >(evt, querySchema.validate);

  const [field, order] = rawSort?.[0] ?? [];
  const sort = field == "vote_diff" ? `${field} ${order}` : "created_at";

  const cmtQry = `
    SELECT
        c.comment_id id,
        u.name publisher,
        c.created_at created_at,
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
    ORDER BY ${sort};
  `;

  return await getPaginatedData(cmtQry, COMMENTS_PER_PAGE, page);
});

function getSort(urlSort: string | undefined) {
  let mode = "";
  let column = "created_at";
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
