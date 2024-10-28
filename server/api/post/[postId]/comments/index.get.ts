import { COMMENTS_PER_PAGE } from "~/server/config/comment/list";
import { InferType } from "yup";
import { querySchema } from "~/server/schema/query";
import { checkIsAuthed } from "~/server/auth";
import {
  appendParentsAndChildren,
  getCommentQry,
} from "~/server/utils/comments";

export default eventHandler(async (evt) => {
  const postId = getRouterParam(evt, "postId");
  let { commentIds } = getQuery<{ commentIds: string | string[] | undefined }>(evt);

  commentIds =
    commentIds == null
      ? []
      : typeof commentIds == "string"
        ? [commentIds]
        : commentIds;

  const { page, sort: rawSort } = await getValidatedQuery<
    InferType<typeof querySchema>
  >(evt, (query) => querySchema.validate(query));

  const [field, order] = rawSort?.[0] ?? [];
  const sort = field == "vote_diff" ? `${field} ${order}` : "created_at";

  const { userId } = await checkIsAuthed(evt);

  let qry, params;
  if (commentIds.length == 0) {
    qry = `
      SELECT *
      FROM get_all_comments($1, $2)
    `;
    params = [postId, userId];
  } else {
    qry = `
      SELECT *
      FROM get_comments($1, $2, $3)
    `;
    params = [postId, commentIds, userId];
  }
  qry = `${qry} ORDER BY ${sort}`;

  const { data: comments, pagination } = await getPaginatedData(
    qry,
    COMMENTS_PER_PAGE,
    page,
    params,
  );
  const commentsWithParent = await appendParentsAndChildren(comments);

  return { data: commentsWithParent, pagination };
});
