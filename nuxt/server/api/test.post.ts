
export default eventHandler(async (evt) => {
  throw createError({statusCode: 500});
});
