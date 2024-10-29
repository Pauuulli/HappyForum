
export default eventHandler(async (evt) => {
  setResponseStatus(evt, 201);
  throw createError({statusCode: 404});
});
