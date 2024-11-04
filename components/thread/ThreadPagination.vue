<script setup lang="ts">
import Select from "primevue/select";

const props = defineProps<{
  pageNum: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: "page-change", newPage: number): void;
}>();

const pageOpts = computed(() => {
  let result = [];
  for (let i = 0; i < props.totalPages; ++i) {
    result.push({ label: `Page ${i + 1}`, value: i });
  }
  return result;
});

function onPageChange(page: number) {
  setTimeout(() => emit("page-change", page), 100);
}
</script>

<template>
  <p>{{ pageOpts }}</p>
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
      :options="pageOpts"
      option-label="label"
      option-value="value"
      @update:model-value="onPageChange"
      @hide=""
    />
    <button
      class="rounded-lg p-2 hover:bg-gray-400/30"
      :class="{ invisible: pageNum == totalPages - 1 }"
      @click="$emit('page-change', pageNum + 1)"
    >
      下一頁
    </button>
  </div>
</template>
