interface Post {
  postId: number;
  title: string;
  publisher: string;
  catName: string;
  repliedAt: Date;
  voteDiff: number;
  totalPages: number;
}

interface Category {
  catId: number;
  catName: string;
}

export type { Post, Category };
