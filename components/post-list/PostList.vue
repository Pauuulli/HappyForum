<script setup lang="ts">
import dayjs from "dayjs";
import type { PaginatedData } from "~/models/pagination";
import type { Post, PostApi } from "~/models/post";

const route = useRoute();
const catId = computed(() => route.params.id as string);
const { data } = await useFetch<PaginatedData<PostApi[]>>(
  `/api/category/${catId.value}`,
);
const postList = computed<Post[] | undefined>(() =>
  data.value?.data.map((postApi) => ({
    ...postApi,
    repliedAt: dayjs(postApi.repliedAt),
    voteDiff: Number(postApi.voteDiff),
    totalPages: Number(postApi.totalPages)
  })),
);
</script>

<template>
  <p>{{ postList }}</p>
  <ul class="">
    <PostListItem v-for="post in postList" :key="post.postId" :post="post" />
  </ul>
</template>
