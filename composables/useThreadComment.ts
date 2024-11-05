import type { Post, Comment, VoteDetails } from "~/ts-type/models/thread";

export function useThreadComment(postId: string) {
  async function onVote(item: Comment, choice: 1 | 2) {
    console.log("called");

    const url = `/api/post/${postId}/comments/${item.commentId}/vote`;

    const voteDetails = await api<VoteDetails>(url, {
      method: "POST",
      body: { choice },
    });
    Object.assign(item, voteDetails);
  }

  return { onVote };
}
