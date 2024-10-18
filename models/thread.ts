interface Base {
  publisher: string;
  createdAt: Date;
  content: string;
  upVotes: number;
  downVotes: number;
}

type Post = Base & {
  title: string;
  catId: string;
  postId: string;
};

type Comment = Base & {
  commentId: string;
  childCount: number;
  parents: { commentId: string; content: string }[];
};

export type { Post, Comment };
