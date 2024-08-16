<script setup lang="ts">
// defineProps<{
//   activeTab: number;
// }>();

const emit = defineEmits<{
  (e: "update:activeTab", newTab: number): void;
}>();

const activeTab = ref(0);
const headings = ["abc", "dvd"];

function onTabClick(tabIdx: number) {
  activeTab.value = tabIdx;
  emit("update:activeTab", tabIdx);
}
</script>

<template>
  <header class="flex h-12 w-full gap-3 border-b border-gray-200 px-3">
    <button
      v-for="(h, idx) in headings"
      class="h-[calc(100%+2px)] grow"
      :class="{ 'border-b-2 border-primary': activeTab == idx }"
      @click="onTabClick(idx)"
    >
      {{ h }}
    </button>
  </header>
</template>
