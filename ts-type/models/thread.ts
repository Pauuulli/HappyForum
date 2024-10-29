interface Base {
  publisher: string;
  createdAt: Date;
  content: string;
  upVotes: number;
  downVotes: number;
  voted: "up" | "down" | null;
}

type Post = Base & {
  title: string;
  catId: string;
  postId: string;
};

type Comment = Base & {
  commentId: string;
  commentOrder: number;
  parents: { commentId: string; content: string }[];
  children: { commentId: string }[];
};

interface Overlay {
  visible: boolean;
  comment?: Comment;
  isLightMode: boolean;
}

interface VoteDetails {
  id: number;
  upVotes: number;
  downVotes: number;
  voted: string;
}

export type { Post, Comment, Overlay, VoteDetails };
