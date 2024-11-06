export default eventHandler(async (evt) => {
  const catId = getRouterParam(evt, "catId")!;

  const qry = `
        SELECT cat_id, cat_name
        FROM categories
        WHERE cat_id = $1;
    `;
  const {
    rows: [cat],
  } = await pool.query(qry, [catId]);
  if (!cat) throw createError({ statusCode: 404 });

  return objectKeyToCamel(cat);
});
