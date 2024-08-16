<script setup lang="ts">
const visible = ref(true);
let lastPageOffset = -1;

function onScroll() {
  if (Math.abs(scrollY - lastPageOffset) < 80) return;
  if (scrollY > lastPageOffset) visible.value = false;
  else visible.value = true;
  lastPageOffset = scrollY;
  console.log(`${scrollY} ${lastPageOffset}`);
}

onMounted(() => window.addEventListener("scroll", onScroll));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header
    class="fixed top-0 flex h-12 w-full items-center gap-3 border-b bg-white transition-transform duration-200"
    :class="{ '-translate-y-full': !visible }"
  >
    <NuxtLink to="/category/123" class="button cursor-pointer">
      <i class="pi pi-arrow-left !text-sm"></i>
    </NuxtLink>
    <h1 class="grow truncate text-lg">
      習近平回信」香港富豪反應冷淡分析：誰站出來 站出來站出來站出來站出來站出來
    </h1>
    <button class="button">
      <i class="pi pi-share-alt !text-sm"></i>
    </button>
  </header>
</template>

<style scoped>
.button {
  @apply flex h-full w-20 items-center justify-center hover:bg-gray-300/50;
}
</style>
