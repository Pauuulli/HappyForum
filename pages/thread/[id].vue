<script setup lang="ts">
import { array, object, date, number } from "yup";
import type { Post, Comment } from "~/models/thread";

const route = useRoute();
const postId = computed(() => route.params.id as string);

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

const viewerReference = ref<{ visible: boolean; commentId?: string }>({
  visible: false,
});

const pages = computed(() =>
  commentsPages.value.map((_, idx) => ({
    label: `Page ${idx + 1}`,
    value: idx,
  })),
);

async function onVoted(comment?: Comment) {
  if (comment == null) {
    post.value = await api(`/api/post/${postId.value}`);
    return;
  }

  const newComment = await api(`/api/comment/${comment.commentId}`);
  Object.assign(comment, newComment);
}

function onViewReply(commentId: string) {
  viewerReference.value.visible = true;
  viewerReference.value.commentId = commentId;
}
</script>

<template>
  <template v-if="post">
    <ThreadHeader :post="post" />
    <ThreadPagination :page-num="0" :pages="pages" class="mt-12" />
    <article class="flex flex-col gap-3 bg-gray-100">
      <ThreadComment :value="post" :idx="-1" @voted="onVoted" />
      <ThreadComment
        v-for="(comment, idx) in commentsPages[0]"
        :key="comment.commentId"
        :value="comment"
        @voted="onVoted"
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
          v-for="(comment, idx) in comments"
          :key="comment.commentId"
          :value="comment"
          @voted="onVoted"
          @view-reply="onViewReply"
        />
      </article>
    </template>
    <div
      class="flex h-16 items-center justify-center bg-gray-100 text-center text-primary"
    >
      完
    </div>

    <ThreadOverlay
      v-if="viewerReference.commentId"
      v-model:visible="viewerReference.visible"
      :comment-id="viewerReference.commentId"
    />
  </template>
</template>
