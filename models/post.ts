interface PostApi {
  post_id: number;
  title: string;
  publisher: string;
  replied_at: string;
  vote_diff: string;
  total_pages: string;
  cat_name: string;
}

// interface Post{
//     post_id: number;
//   title: string;
//   publisher: string;
//   replied_at: Date;
//   vote_diff: string;
//   total_pages: string;
//   cat_name: string;
// }
export type { PostApi };
