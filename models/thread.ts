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
  childCount: number;
  commentOrder: number;
  parents: { commentId: string; content: string }[];
  children: { commentId: string }[];
};

export type { Post, Comment };
