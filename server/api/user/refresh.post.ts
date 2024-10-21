import { setJwtCookies } from "~/server/auth";
import { checkIsAuthed } from "~/server/auth";

export default authEventHandler(async (event, userId) => {
  setResponseStatus(event, 201);
  return await setJwtCookies(event, userId);
});
