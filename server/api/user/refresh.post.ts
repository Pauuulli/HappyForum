import { setJwtCookies } from "~/server/auth";
import { checkIsAuthed } from "~/server/auth";

export default eventHandler(async (event) => {
  const userId = await checkIsAuthed(event);

  setResponseStatus(event, 201);
  return await setJwtCookies(event, userId);
});
