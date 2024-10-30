<script setup lang="ts">
</script>

<template>
  <AppMenu />
  <main class="pb-12">
    <slot />
  </main>
  <AppLoading />
  <Toast />
</template>
