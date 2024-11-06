import type { Comment } from "~/ts-type/models/thread";

export async function loadCommentChildren(comment: Comment, postId: number | string) {
  const childrenIds = comment.children.map((chd) => chd.commentId);
  const { data: newChildren } = await api<{ data: Comment[] }>(
    `/api/post/${postId}/comments`,
    {
      query: { commentIds: childrenIds },
    },
  );
  return newChildren;
}
