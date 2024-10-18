<script setup lang="ts">
import Select from "primevue/select";

defineProps<{
  pageNum: number;
  pages: { label: string; value: number }[];
}>();

defineEmits<{
  (e: "page-change", newPage: number): void;
}>();
</script>

<template>
  <div class="flex items-center justify-around bg-gray-100 p-6">
    <button
      :disabled="pageNum == 0"
      class="rounded-lg p-2 hover:bg-gray-400/30"
      :class="{
        invisible: pageNum == 0,
      }"
      @click="$emit('page-change', pageNum - 1)"
    >
      上一頁
    </button>
    <Select
      :model-value="pageNum"
      :options="pages"
      option-label="label"
      option-value="value"
      @update:model-value="$emit('page-change', $event)"
    />
    <button
      class="rounded-lg p-2 hover:bg-gray-400/30"
      :class="{ invisible: pageNum == pages.length - 1 }"
      @click="$emit('page-change', pageNum + 1)"
    >
      下一頁
    </button>
  </div>
</template>
