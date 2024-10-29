interface Post {
  postId: number;
  title: string;
  publisher: string;
  catName: string;
  repliedAt: Date;
  voteDiff: number;
  totalPages: number;
}

export type { Post };
