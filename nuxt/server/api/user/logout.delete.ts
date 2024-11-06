export default eventHandler(async (evt) => {
  const { jwt } = parseCookies(evt);
  if (!jwt) throw unauthErr;

  setCookie(evt, "jwt", "", {
    maxAge: 0,
  });
  setResponseStatus(evt, 204);
});

const unauthErr = createError({
  statusCode: 401,
  statusMessage: "Unauthorized",
});
