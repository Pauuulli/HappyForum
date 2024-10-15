<script setup lang="ts">
import type { PaginatedData } from "~/models/pagination";

// definePageMeta({
//   validate: async (route) => {
//     return route.params.id == '123';
//   }
// })
const route = useRoute();

const postId = computed(() => route.params.id as string);

const page = computed(() => {
  if (typeof route.query.page != "string") return 1;
  const pageInt = parseInt(route.query.page);
  return isNaN(pageInt) ? 1 : pageInt;
});

const { data } = await useFetch<PaginatedData<any[]>>(
  `/api/post/${postId.value}`,
  {
    query: {
      page,
    },
  },
);
</script>

<template>
  <p>{{ data }}</p>
  <ThreadHeader />
  <ThreadPagination class="mt-12" />
  <article class="flex flex-col gap-3 bg-gray-100">
    <ThreadComment />
    <ThreadComment />
    <ThreadComment />
    <ThreadComment />
  </article>
  <ThreadPagination />
  <article class="flex flex-col gap-3 bg-gray-100">
    <ThreadComment />
    <ThreadComment />
    <ThreadComment />
    <ThreadComment />
  </article>
</template>
