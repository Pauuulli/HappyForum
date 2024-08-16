<script setup lang="ts">
// defineProps<{

// }>();
// const emit = defineEmits<{
//   (e: "open-menu"): void;
// }>();
const { appMenuVisible } = storeToRefs(useAppStore());

const buttons = [
  {
    icon: "pi-bars",
    action: () => (appMenuVisible.value = true),
  },
  {
    icon: "pi-refresh",
    action: undefined,
  },
  {
    icon: "pi-plus",
    action: undefined,
  },
  {
    icon: "pi-cog",
    action: undefined,
  },
];
</script>

<template>
  <footer class="fixed bottom-0 flex h-12 w-full bg-primary">
    <button
      v-for="{ icon, action } in buttons"
      class="flex grow items-center justify-center hover:bg-black/10"
      @click="action"
    >
      <i :class="`pi ${icon}`"></i>
    </button>
  </footer>
</template>
