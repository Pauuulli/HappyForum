<script setup lang="ts">
import type { PaginatedData } from "~/models/pagination";
import { object, number, array, date } from "yup";
import type { Post } from "~/models/post-list";

const schema = array(
  object({
    repliedAt: date(),
    voteDiff: number(),
    totalPages: number(),
  }),
);

const route = useRoute();
const catId = computed(() => route.params.id as string);
const { data } = await useFetch<PaginatedData<any[]>>(
  `/api/category/${catId.value}`,
);
const posts = computed<Post[] | undefined>(() => {
  if (data.value == null) return undefined;
  return schema.cast(data.value.data) as Post[];
});
</script>

<template>
  <ul class="">
    <PostListItem v-for="post in posts" :key="post.postId" :post="post" />
  </ul>
</template>
