import { checkIsAuthed } from "~/server/auth";
import { getComments } from "~/server/utils/comments";

export default eventHandler(async (evt) => {
  const { postId, commentId } = getRouterParams(evt);
  const { userId } = await checkIsAuthed(evt);

  const comments = await getComments(postId, commentId, userId);

  return comments[0];
});
