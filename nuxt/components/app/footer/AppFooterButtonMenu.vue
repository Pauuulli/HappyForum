<script setup lang="ts">
const { isAppMenuVisible } = storeToRefs(useAppStore());
</script>

<template>
  <AppFooterButton
    icon="pi pi-bars"
    @click="isAppMenuVisible = !isAppMenuVisible"
  />
</template>
