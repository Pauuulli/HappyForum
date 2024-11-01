<script setup lang="ts">
import type { Post } from "~/ts-type/models/thread";

defineProps<{
  post: Post;
}>();

const visible = ref(true);
let lastPageOffset = -1;

function onScroll() {
  if (Math.abs(scrollY - lastPageOffset) < 80) return;
  if (scrollY > lastPageOffset) visible.value = false;
  else visible.value = true;
  lastPageOffset = scrollY;
}

onMounted(() => window.addEventListener("scroll", onScroll));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header
    class="fixed top-0 z-20 flex h-12 w-full items-center gap-3 border-b bg-white transition-transform duration-200"
    :class="{ '-translate-y-full': !visible }"
  >
    <NuxtLink :to="`/category/${post.catId}`" class="button cursor-pointer">
      <i class="pi pi-arrow-left !text-sm"></i>
    </NuxtLink>
    <h1 class="grow truncate text-ellipsis text-center text-lg">
      {{ post.title }}
    </h1>
    <button class="button justify-end">
      <i class="pi pi-share-alt !text-sm"></i>
    </button>
  </header>
</template>

<style scoped>
.button {
  @apply flex h-full w-12 items-center justify-center hover:bg-gray-300/50;
}
</style>
