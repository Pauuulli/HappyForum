<script setup lang="ts">
defineProps<{
  text: string;
  href: string;
}>();

defineEmits<{
  (e: "click"): void;
}>();

const app = useAppStore();
</script>

<template>
  <NuxtLink
    :to="href"
    class="flex items-center gap-6 text-lg transition-colors hover:text-yellow-400 cursor-pointer"
    @click="app.isAppMenuVisible = !app.isAppMenuVisible"
  >
    {{ text }}
  </NuxtLink>
</template>