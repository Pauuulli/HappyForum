import type { Post, Comment, VoteDetails } from "~/ts-type/models/thread";
import { isComment } from "~/ts-type/predicates/thread";

export function useThreadComment(postId: string) {
  async function onVote(item: Comment | Post, choice: 1 | 2) {
    console.log('called');
    const isCmt = isComment(item);

    const url = isCmt
      ? `/api/post/${postId}/comments/${item.commentId}/vote`
      : `/api/post/${postId}/vote`;

    const voteDetails = await api<VoteDetails>(url, {
      method: "POST",
      body: { choice },
    });
    Object.assign(item, voteDetails);
  }

  return { onVote };
}
