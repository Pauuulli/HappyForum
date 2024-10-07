import { pool } from "~/server/database/client";
import { authEventHandler } from "~/server/util/auth-handler";

const COMMENTS_PER_PAGE = '10.0';
const POSTS_PER_PAGE = '10.0';

export default authEventHandler(async (evt) => {
  const query: Record<string, string> = getQuery(evt);
  const catId = query.catId;
  const page = query.page ?? 
  if (query.sort && query.sort == "1") {
    // 1: Sort by viewCount
    return await sortByViewCount();
  }
  return await sortByLastReply(catId);
});

async function sortByLastReply(catId?: string) {
  const client = await pool.connect();

  const postListQry = `
  CREATE TEMPORARY TABLE posts_list AS
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
    GREATEST(CEIL(COUNT(cmt.post_id)/${COMMENTS_PER_PAGE}), 1) total_pages, 
    cat.cat_name
  FROM
    posts p
    JOIN users u USING(user_id)
    LEFT JOIN comments cmt USING(post_id)
    LEFT JOIN post_votes pv USING(post_id)
    JOIN categories cat USING(cat_id)
  ${catId ? "WHERE p.cat_id = $1" : ""}
  GROUP BY
    p.post_id, 
    p.title, 
    u.name, 
    cat.cat_name
  ORDER BY
    replied_at DESC
  `;

  const bindings = catId? [catId] : undefined;
  await client.query(postListQry, bindings);
  const {rows: posts} = await client.query('SELECT * FROM posts_list');

  const totalQry = `
  SELECT COUNT(*)
  FROM posts_list
  `
  const {rows: [{}]}

  return result;
}

async function sortByViewCount(catId?: string) {

}
