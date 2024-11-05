<script setup lang="ts">
import { array, object, date, number } from "yup";
import { useThreadOverlay } from "~/composables/thread/useThreadOverlay";
import { useThreadScroll } from "~/composables/thread/useThreadScroll";
import { FOOTER_HEIGHT } from "~/constants/layout";
import type { PaginatedData } from "~/ts-type/models/pagination";
import type {
  Post,
  Comment,
  Overlay,
  CommentPage,
} from "~/ts-type/models/thread";

const route = useRoute();
const router = useRouter();
const { isAppMenuVisible } = storeToRefs(useAppStore());
const postId = computed(() => route.params.id as string);
const { onVote } = useThreadComment(postId.value);

const pageCurrNumber = computed(() => {
  const pageQry = route.query.page;
  return typeof pageQry != "string" || isNaN(+pageQry) ? 0 : parseInt(pageQry);
});

const commentSchema = object({
  createdAt: date(),
  upVotes: number(),
  downVotes: number(),
  childCount: number(),
});

const { data: post } = await useFetch<Post>(`/api/post/${postId.value}`);
if (!post.value) throw createError({ statusCode: 404 });

const { data: commentsFirstPagePaginated, error: commentsErr } = await useFetch<
  PaginatedData<Comment[]>
>(`/api/post/${postId.value}/comments`, {
  query: {
    page: pageCurrNumber.value,
  },
});
if (commentsErr.value != null) throw createError("Server Error");
if (
  pageCurrNumber.value != 0 &&
  commentsFirstPagePaginated.value!.data.length == 0
)
  throw createError({ statusCode: 404 });

const commentsPages = ref<CommentPage[]>([
  {
    comments: castComment(commentsFirstPagePaginated.value!.data),
    page: commentsFirstPagePaginated.value!.pagination.currentPage,
  },
]);

const pagination = ref(commentsFirstPagePaginated.value!.pagination);
const commentId = ref();

const { scrollToTop } = useThreadScroll(
  commentsPages,
  pageCurrNumber,
  pagination,
  loadCommentsAndUpdatePagination,
  changeUrlPage,
);

const { overlay, viewOverlayDetailed, viewOverlayLight, closeOverlay, goPage: goOverlayPage, onViewOverlayReply } =
  useThreadOverlay(postId);

const isReplyVisible = ref(false);

async function onRefresh() {
  const pageCurr = commentsPages.value.find(
    (cp) => cp.page == pageCurrNumber.value,
  )!;

  const comments = await loadCommentsAndUpdatePagination(pageCurrNumber.value);
  pageCurr.comments = comments;
}

async function onPageChange(newPage: number) {
  // console.log(`newPage: ${newPage}, curr: ${pageCurrNumber.value}`);
  if (newPage == pageCurrNumber.value) return;

  const target = commentsPages.value.find((cp) => cp.page == newPage);
  if (target) {
    scrollToTop(target.elem!);
    changeUrlPage(newPage);
    return;
  }

  const comments = await loadCommentsAndUpdatePagination(newPage);
  const newCommentsPage = { comments, page: newPage } as CommentPage;

  if (
    newPage == pageCurrNumber.value - 1 ||
    newPage == pageCurrNumber.value + 1
  ) {
    if (newPage == pageCurrNumber.value - 1)
      commentsPages.value.unshift(newCommentsPage);
    else commentsPages.value.push(newCommentsPage);
  } else {
    commentsPages.value = [newCommentsPage];
  }

  changeUrlPage(newPage);

  await nextTick();
  scrollToTop(newCommentsPage.elem!);
}

function registerPageRef(el: unknown, page: number) {
  const target = commentsPages.value.find((cp) => cp.page == page)!;
  if (el instanceof HTMLElement) target.elem = el;
}

async function changeUrlPage(page: number) {
  router.push({ path: `/thread/${postId.value}`, query: { page } });
}

async function loadCommentsAndUpdatePagination(page: number) {
  const { data, pagination: newPg } = await api<PaginatedData<Comment[]>>(
    `/api/post/${postId.value}/comments`,
    {
      query: {
        page,
      },
    },
  );
  pagination.value = newPg;
  return castComment(data);
}

function onReplyComment(comment: Comment) {
  isReplyVisible.value = true;
  commentId.value = comment.commentId;
}

function onReplyPost() {
  isReplyVisible.value = true;
  commentId.value = undefined;
}

function castComment(value: Object) {
  return array(commentSchema).cast(value) as Comment[];
}
</script>

<template>
  <template v-if="post">
    <ThreadHeader :post="post" />
    <div
      v-for="{ page, comments } in commentsPages"
      :key="page"
      :ref="(el) => registerPageRef(el, page)"
      class="mt-12"
    >
      <ThreadPagination
        :page-num="page"
        :total-pages="pagination.totalPages"
        @page-change="onPageChange"
      />
      <article class="flex flex-col gap-3 bg-gray-100">
        <ThreadComment
          v-for="comment in comments"
          :key="comment.commentId"
          :comment="comment"
          @vote="onVote"
          @view-reply="viewOverlayDetailed"
          @reply="onReplyComment"
          @view-parent="viewOverlayLight"
        />
      </article>
    </div>
    <!-- Loading Spinner -->
    <div
      v-if="pageCurrNumber < pagination.totalPages - 1"
      class="flex h-48 items-center justify-center"
    >
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
    <div
      v-else
      class="flex h-16 items-center justify-center bg-gray-100 text-center text-primary"
      :style="{ 'margin-bottom': FOOTER_HEIGHT }"
    >
      完
    </div>
    <AppFooter>
      <AppFooterButton icon="pi pi-bars" @click="isAppMenuVisible = true" />
      <AppFooterButton icon="pi pi-refresh" @click="onRefresh" />
      <AppFooterButton icon="pi pi-reply" @click="onReplyPost" />
    </AppFooter>

    <ThreadOverlay v-if="overlay" :overlay="overlay" :post-id="postId" @view-reply="onViewOverlayReply" @go-page="goOverlayPage" @close="closeOverlay" />
    <ThreadReply
      v-model="isReplyVisible"
      :post-id="postId"
      :comment-id="commentId"
      @replied="onRefresh"
    />
  </template>
</template>
