<script setup lang="ts">
import { object, number, array, date } from "yup";
import { FOOTER_HEIGHT } from "~/constants/layout";
import type { PaginatedData } from "~/ts-type/models/pagination";
import type { Post, Category } from "~/ts-type/models/post-list";

// const samplePost = {
//   postId: 1,
//   title:
//     "Understanding TypeScript Interfaces Understanding TypeScript Interfaces Understanding TypeScript Interfaces",
//   publisher: "Alice Johnson",
//   catName: "Programming",
//   repliedAt: new Date("2023-10-10T14:30:00Z"),
//   voteDiff: 15,
//   totalPages: 5,
// };

const route = useRoute();
const { isAppMenuVisible, isAppLoadingVisible } = storeToRefs(useAppStore());

const postContainerRef = ref<HTMLDivElement>();
useElementScrollLazyload(postContainerRef, 307, onScrollToEnd);
const catId = computed(() => route.params.id as string);
const { data: category } = await useFetch<Category>(
  `/api/category/${catId.value}`,
);
if (!category.value) throw createError({ statusCode: 404 });

const { data: postsPaginated } = await useFetch(
  `/api/category/${catId.value}/posts`,
  { query: { page: "0" } },
);

const schema = array(
  object({
    repliedAt: date(),
    voteDiff: number(),
    totalPages: number(),
  }),
);

const posts = computed<Post[] | undefined>(() => {
  if (postsPaginated.value == null) return undefined;
  return schema.cast(postsPaginated.value.data) as Post[];
});

const pagination = computed(() => postsPaginated.value?.pagination);
const isDialogCreateVisible = ref(false);
const isSkeletonsVisible = computed(
  () =>
    pagination.value &&
    pagination.value.currentPage != pagination.value.totalPages - 1,
);

async function onRefresh() {
  isAppLoadingVisible.value = true;
  try {
    postsPaginated.value = await api(`/api/category/${catId.value}/posts`, {
      query: { page: pagination.value!.currentPage },
    });
  } finally {
    isAppLoadingVisible.value = false;
  }
}

async function onCreateNewPost() {
  isDialogCreateVisible.value = true;
}

async function onScrollToEnd() {
  const { currentPage, totalPages } = pagination.value!;
  if (currentPage == totalPages - 1) return;

  const newPostsPaginated = await api<PaginatedData<Post[]>>(
    `/api/category/${catId.value}/posts`,
    {
      query: { page: pagination.value!.currentPage + 1 },
    },
  );

  postsPaginated.value!.data.push(...newPostsPaginated.data);
  postsPaginated.value!.pagination = newPostsPaginated.pagination;
}
</script>

<template>
  <article class="flex h-screen flex-col">
    <h1 class="border-b border-gray-200 px-3 py-3 text-center text-xl">
      {{ category?.catName }}
    </h1>
    <div class="grow overflow-y-auto" ref="postContainerRef">
      <ul>
        <CategoryPost v-for="(post, idx) in posts" :key="idx" :post="post" />
      </ul>
      <!-- Loading Skeletons -->
      <template v-if="isSkeletonsVisible">
        <div v-for="i in new Array(3)" class="border-b p-3">
          <Skeleton width="33%" height="1.5rem" class="mb-2" />
          <Skeleton height="1.5rem" />
        </div>
      </template>
      <div
        v-else
        class="flex h-16 items-center justify-center bg-gray-100 text-center text-primary"
        :style="{ 'margin-bottom': FOOTER_HEIGHT }"
      >
        完
      </div>
    </div>
  </article>

  <AppFooter>
    <AppFooterButton
      icon="pi pi-bars"
      @click="isAppMenuVisible = !isAppMenuVisible"
    />
    <AppFooterButton icon="pi pi-refresh" @click="onRefresh" />
    <AppFooterButton icon="pi pi-plus" @click="onCreateNewPost" />
  </AppFooter>

  <CategoryCreate
    v-model:visible="isDialogCreateVisible"
    :cat-id="catId"
    @created="onRefresh"
  />
</template>
