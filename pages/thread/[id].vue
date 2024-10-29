<script setup lang="ts">
import { array, object, date, number } from "yup";
import type { Post, Comment, Overlay } from "~/ts-type/models/thread";

const route = useRoute();
const postId = computed(() => route.params.id as string);
const { onVote } = useThreadComment(postId.value);

const page = computed(() => {
  const pageQry = route.query.page;
  return typeof pageQry != "string" || isNaN(+pageQry) ? 0 : parseInt(pageQry);
});

const commentSchema = object({
  createdAt: date(),
  upVotes: number(),
  downVotes: number(),
  childCount: number(),
});

const { data: postRaw } = await useFetch(`/api/post/${postId.value}`);
if (!postRaw.value) throw createError({ statusCode: 404 });

const { data: commentsRaw, error: commentsErr } = await useFetch(
  `/api/post/${postId.value}/comments`,
  {
    query: {
      page,
    },
  },
);
if (commentsErr.value != null) throw createError("Server Error");

const post = ref(
  postRaw.value
    ? ({ ...commentSchema.cast(postRaw.value), postId: postId.value } as Post)
    : undefined,
);

const commentsPages = ref<Comment[][]>(
  commentsRaw.value
    ? [array(commentSchema).cast(commentsRaw.value.data) as Comment[]]
    : [],
);

const overlay = ref<Overlay>({
  visible: false,
  isLightMode: false,
});

const pages = computed(() =>
  commentsPages.value.map((_, idx) => ({
    label: `Page ${idx + 1}`,
    value: idx,
  })),
);

function onViewReply(comment: Comment) {
  overlay.value.visible = true;
  overlay.value.comment = comment;
}
</script>

<template>
  <template v-if="post">
    <ThreadHeader :post="post" />
    <ThreadPagination :page-num="0" :pages="pages" class="mt-12" />
    <article class="flex flex-col gap-3 bg-gray-100">
      <ThreadComment :item="post" :idx="-1" @vote="onVote" />
      <ThreadComment
        v-for="comment in commentsPages[0]"
        :key="comment.commentId"
        :item="comment"
        @vote="onVote"
        @view-reply="onViewReply"
      />
    </article>
    <template
      v-for="(comments, pageIdx) in commentsPages.slice(1)"
      :key="pageIdx"
    >
      <ThreadPagination :page-num="pageIdx + 1" :pages="pages" />
      <article class="flex flex-col gap-3 bg-gray-100">
        <ThreadComment
          v-for="comment in comments"
          :key="comment.commentId"
          :item="comment"
          @vote="onVote"
          @view-reply="onViewReply"
        />
      </article>
    </template>
    <div
      class="flex h-16 items-center justify-center bg-gray-100 text-center text-primary"
    >
      完
    </div>

    <ThreadOverlay v-model="overlay" :post-id="postId" />
  </template>
</template>
