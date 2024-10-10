import { COMMENTS_PER_PAGE } from "~/server/config/comment/list";
import { POSTS_PER_PAGE } from "~/server/config/post/list";
import { getPaginatedData } from "~/server/util/pagination";

export default eventHandler(async (evt) => {
  const catId = getRouterParam(evt, "catId");
  const query: Record<string, string> = getQuery(evt);
  const page = isNaN(+query.page) ? 0 : parseInt(query.page);
  if (query.sort && query.sort == "1") {
    // 1: Sort by viewCount
    return await sortByViewCount();
  }
  return await sortByLastReply();

  async function sortByViewCount() {}

  async function sortByLastReply() {
    const postListQry = `
    SELECT 
      p.post_id, 
      p.title, 
      u.name publisher, 
      COALESCE(MAX(cmt.created_at), p.created_at) replied_at, 
      SUM(
          CASE 
            WHEN pv.is_up IS NULL THEN 0
            WHEN pv.is_up THEN 1
            ELSE -1 
          END
      ) vote_diff, 
      GREATEST(CEIL(COUNT(cmt.post_id)/${COMMENTS_PER_PAGE.toFixed(1)}), 1) total_pages, 
      cat.cat_name
    FROM
      posts p
      JOIN users u USING(user_id)
      LEFT JOIN comments cmt USING(post_id)
      LEFT JOIN post_votes pv USING(post_id)
      JOIN categories cat USING(cat_id)
    WHERE p.cat_id = $1
    GROUP BY
      p.post_id, 
      p.title, 
      u.name, 
      cat.cat_name
    ORDER BY
      replied_at DESC
    `;
    const bindings = catId ? [catId] : undefined;

    return await getPaginatedData(postListQry, POSTS_PER_PAGE, page, bindings);
  }
});
