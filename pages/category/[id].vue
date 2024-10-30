<script setup lang="ts">
import { object, number, array, date } from "yup";
import type { Post, Category } from "~/ts-type/models/post-list";

const { isAppMenuVisible, isAppLoadingVisible } = storeToRefs(useAppStore());

const schema = array(
  object({
    repliedAt: date(),
    voteDiff: number(),
    totalPages: number(),
  }),
);

const route = useRoute();

const catId = computed(() => route.params.id as string);
const { data: category } = await useFetch<Category>(
  `/api/category/${catId.value}`,
);
if (!category.value) throw createError({ statusCode: 404 });

const { data: postListPage } = await useFetch(
  `/api/category/${catId.value}/posts`,
);

const posts = computed<Post[] | undefined>(() => {
  if (postListPage.value == null) return undefined;
  return schema.cast(postListPage.value.data) as Post[];
});

const isDialogCreateVisible = ref(true);

async function onRefresh() {
  isAppLoadingVisible.value = true;
  try {
    postListPage.value = await api(`/api/category/${catId.value}/posts`);
  } finally {
    isAppLoadingVisible.value = false;
  }
}

async function onCreateNewPost() {}
</script>

<template>
  <h1 class="border-b border-gray-200 px-3 py-3 text-center text-xl">
    {{ category?.catName }}
  </h1>
  <ul class="">
    <CategoryPost v-for="post in posts" :key="post.postId" :post="post" />
  </ul>
  <AppFooter>
    <AppFooterButton
      icon="pi pi-bars"
      @click="isAppMenuVisible = !isAppMenuVisible"
    />
    <AppFooterButton icon="pi pi-refresh" @click="onRefresh" />
    <AppFooterButton icon="pi pi-plus" @click="onCreateNewPost" />
  </AppFooter>

  <CategoryCreate v-model:visible="isDialogCreateVisible" />
</template>
