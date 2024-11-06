<script setup lang="ts">
defineProps<{
  icon: string;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button
    class="flex grow items-center justify-center hover:bg-black/10"
    @click="$emit('click')"
  >
    <i :class="`${icon}`"></i>
  </button>
</template>
