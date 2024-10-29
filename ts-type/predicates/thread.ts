import type { Post, Comment } from "../models/thread";

export function isComment(val: Post | Comment): val is Comment {
  return "children" in val;
}
