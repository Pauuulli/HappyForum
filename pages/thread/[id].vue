<script setup lang="ts">
interface CommentPage {
  elem: HTMLElement | undefined;
  comments: Comment[];
}

import { array, object, date, number } from "yup";
import { FOOTER_HEIGHT } from "~/constants/layout";
import type { Post, Comment, Overlay } from "~/ts-type/models/thread";

const route = useRoute();
const router = useRouter();
const { isAppMenuVisible } = storeToRefs(useAppStore());
const postId = computed(() => route.params.id as string);
const { onVote } = useThreadComment(postId.value);

const pageCurr = computed(() => {
  const pageQry = route.query.page;
  return typeof pageQry != "string" || isNaN(+pageQry) ? 0 : parseInt(pageQry);
});
// const pageFirst = pageCurr.value;

const commentSchema = object({
  createdAt: date(),
  upVotes: number(),
  downVotes: number(),
  childCount: number(),
});

const { data: postRaw } = await useFetch(`/api/post/${postId.value}`);
if (!postRaw.value) throw createError({ statusCode: 404 });

const { data: commentsPaginated, error: commentsErr } = await useFetch(
  `/api/post/${postId.value}/comments`,
  {
    query: {
      page: pageCurr.value,
    },
  },
);
if (commentsErr.value != null) throw createError("Server Error");
if (pageCurr.value != 0 && commentsPaginated.value!.data.length == 0)
  throw createError({ statusCode: 404 });

const post = ref(
  postRaw.value
    ? ({ ...commentSchema.cast(postRaw.value), postId: postId.value } as Post)
    : undefined,
);

const commentsPages = ref<CommentPage[]>(
  commentsPaginated.value
    ? [
        {
          elem: undefined,
          comments: array(commentSchema).cast(
            commentsPaginated.value.data,
          ) as Comment[],
        },
      ]
    : [],
);

const pagination = computed(() => commentsPaginated.value!.pagination);

const overlay = ref<Overlay>({
  visible: false,
  isLightMode: false,
});

const pageOpts = computed(() =>
  new Array(pagination.value.totalPages).map((_, page) => ({
    label: `Page ${page + 1}`,
    value: page,
  })),
);

const virtualPageCurr = ref(0);
const isReplyVisible = ref(false);

function onViewReply(comment: Comment) {
  overlay.value.visible = true;
  overlay.value.comment = comment;
}

async function onRefresh() {
  commentsPaginated.value = await api(`/api/post/${postId.value}/comments`, {
    query: {
      page: pageCurr.value,
    },
  });
}

async function onPageChange(newPage: number) {
  router.push({ path: `/thread/${postId.value}`, query: { page: newPage } });
}

async function onScrollToEnd() {}

function registerPageRef(el: unknown, idx: number) {
  if (el instanceof HTMLElement) commentsPages.value[idx].elem = el;
}
</script>

<template>
  <template v-if="post">
    <ThreadHeader :post="post" />
    <div :ref="(el) => registerPageRef(el, 0)">
      <ThreadPagination
        :page-num="pageCurr"
        :pages="pageOpts"
        class="mt-12"
        @page-change="onPageChange"
      />
      <article class="flex flex-col gap-3 bg-gray-100">
        <ThreadComment
          v-if="pageCurr == 0"
          :item="post"
          :idx="-1"
          @vote="onVote"
        />
        <ThreadComment
          v-for="comment in commentsPages[0].comments"
          :key="comment.commentId"
          :item="comment"
          @vote="onVote"
          @view-reply="onViewReply"
        />
      </article>
    </div>
    <div
      v-for="(commentPage, pageIdx) in commentsPages.slice(1)"
      :key="pageIdx"
      :ref="(el) => registerPageRef(el, pageIdx + 1)"
    >
      <ThreadPagination :page-num="pageCurr + pageIdx + 1" :pages="pageOpts" />
      <article class="flex flex-col gap-3 bg-gray-100">
        <ThreadComment
          v-for="comment in commentPage.comments"
          :key="comment.commentId"
          :item="comment"
          @vote="onVote"
          @view-reply="onViewReply"
        />
      </article>
    </div>
    <!-- Loading Spinner -->
    <div class="flex h-48 items-center justify-center">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
    <div
      class="flex h-16 items-center justify-center bg-gray-100 text-center text-primary"
      :style="{ 'margin-bottom': FOOTER_HEIGHT }"
    >
      完
    </div>
    <AppFooter>
      <AppFooterButton icon="pi pi-bars" @click="isAppMenuVisible = true" />
      <AppFooterButton icon="pi pi-refresh" @click="onRefresh" />
      <AppFooterButton icon="pi pi-reply" @click="isReplyVisible = true" />
    </AppFooter>

    <ThreadOverlay v-model="overlay" :post-id="postId" />
    <ThreadReply v-model="isReplyVisible" :post-id="postId" />
  </template>
</template>
