<script setup lang="ts">
import type { PaginatedData } from "~/models/pagination";
import type { PostApi } from "~/models/post";

const route = useRoute();
const catId = computed(() => route.params.id as string);
const { data } = await useFetch<PaginatedData<PostApi[]>>(
  `/api/category/${catId.value}`,
);

const posts = ref(data.value?.data);
</script>

<template>
  <p>{{ posts }}</p>
  <PostListHeader />
  <PostList />
</template>
