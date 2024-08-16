<script setup lang="ts">
import Select from "primevue/select";

const page = ref(0);

const pages = computed(() => [{ label: "第1頁", value: 0 }]);
</script>

<template>
  <div class="flex items-center justify-around bg-gray-100 p-6">
    <button class="rounded-lg p-2 hover:bg-gray-400/30">上一頁</button>
    <Select
      v-model="page"
      :options="pages"
      option-label="label"
      option-value="value"
      pt:root:class="select-root"
      pt:label:class="select-label"
      pt:dropdown:class=""
      unstyled
    />
    <button class="rounded-lg p-2 hover:bg-gray-400/30">下一頁</button>
  </div>
</template>

<style scoped>
.select-root {
  @apply flex h-12 w-24 cursor-pointer items-center justify-center gap-2;
}

.select-label {
  @apply flex items-center focus:outline-none;
}
</style>
