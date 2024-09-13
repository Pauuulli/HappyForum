import { setJwtCookies } from "~/server/auth";
import { checkIsAuthed } from "~/server/auth";

export default eventHandler(async (event) => {
  const userId = await checkIsAuthed(event);

  await setJwtCookies(event, userId);
  setResponseStatus(event, 204);
});
