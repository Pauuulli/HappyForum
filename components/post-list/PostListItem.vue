<script setup lang="ts">
import dayjs from "dayjs";
import type { Post } from "~/models/post";

const router = useRouter();

const props = defineProps<{
  post: Post;
}>();

const page = ref(props.post.totalPages);

const displayDate = computed(() => {
  const repliedAt = props.post.repliedAt;
  const secondDiff = dayjs().diff(repliedAt, "s");
  const minDiff = dayjs().diff(repliedAt, "m");
  const hourDiff = dayjs().diff(repliedAt, "h");
  const dayDiff = dayjs().diff(repliedAt, "d");
  if (secondDiff < 60) {
    return "Recently replied";
  } else if (minDiff < 60) {
    return `${minDiff} minutes ago`;
  } else if (hourDiff < 24) {
    return `${hourDiff} hours ago`;
  } else if (dayDiff < 31) {
    return `${dayDiff} days ago`;
  } else {
    return repliedAt.format("DD/MM/YYYY");
  }
});

const pageOpts = computed(() => {
  const result = [];
  for (let i = 0; i < props.post.totalPages; ++i) result.push(i + 1);
  return result;
});

function onPageSelect(page: number) {
  router.push({
    path: `/thread/${props.post.postId}`,
    query: { page },
  });
}
</script>

<template>
  <li
    class="border-b border-gray-300 transition-colors duration-100 hover:bg-gray-100/50"
  >
    <NuxtLink
      :to="`/thread/${post.postId}`"
      class="flex cursor-pointer flex-col gap-3 px-3 py-3"
    >
      <aside class="flex items-center gap-2">
        <span class="text-male">{{ post.publisher }}</span>
        <span class="text-secondary">{{ displayDate }}</span>
        <span class="grow text-start text-sm text-secondary"
          ><i class="pi pi-thumbs-up-fill mr-1 !text-xs"></i
          >{{ post.voteDiff }}</span
        >
        <Select
          :options="pageOpts"
          :placeholder="`Page ${post.totalPages}`"
          class="h-10"
          @click.prevent
          @update:model-value="onPageSelect"
        />
      </aside>
      <div class="flex items-center gap-2">
        <!--
        <div class="flex w-4 items-center justify-center">
          <i class="pi pi-circle-fill !text-xs text-red-500"></i>
        </div>
        -->
        <h2 class="grow">{{ post.title }}</h2>
        <span
          class="flex items-center justify-center rounded-xl bg-gray-100 px-2 py-1 text-sm text-gray-400"
          >{{ post.catName }}</span
        >
      </div>
    </NuxtLink>
  </li>
</template>
