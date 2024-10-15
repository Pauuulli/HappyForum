import type { Dayjs } from "dayjs";

interface PostBase {
  postId: number;
  title: string;
  publisher: string;
  catName: string;
}
interface PostApi extends PostBase {
  repliedAt: string;
  voteDiff: string;
  totalPages: string;
}

interface Post extends PostBase {
  repliedAt: Dayjs;
  voteDiff: number;
  totalPages: number;
}

export type { PostApi, Post };
