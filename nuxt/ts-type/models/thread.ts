interface Post {
  title: string;
  catId: number;
}

interface Comment {
  commentId: string;
  commentOrder: number;
  publisher: string;
  createdAt: Date;
  content: string;
  upVotes: number;
  downVotes: number;
  voted: "up" | "down" | null;
  parents: { commentId: number; content: string }[];
  children: { commentId: number }[];
}

interface OverlayLight {
  isLight: true;
  comment: Comment;
}

interface OverlayDetailed {
  isLight: false;
  commentHistory: { comment: Comment; children: Comment[] }[];
  currCommentIdx: number;
}

type Overlay = (OverlayLight | OverlayDetailed) & {
  visible: boolean;
};

interface VoteDetails {
  id: number;
  upVotes: number;
  downVotes: number;
  voted: string;
}

interface CommentPage {
  comments: Comment[];
  page: number;
  elem?: HTMLElement;
}

export type { Post, Comment, Overlay, VoteDetails, CommentPage };
