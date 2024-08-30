<script setup lang="ts">
const { isAppLoadingVisible } = storeToRefs(useAppStore());

watch(isAppLoadingVisible, () => {
  if (isAppLoadingVisible.value) document.body.style.overflow = "hidden";
});
</script>

<template>
  <div
    v-if="isAppLoadingVisible"
    class="flex h-screen w-screen items-center justify-center"
  >
    <ProgressSpinner
      style="width: 50px; height: 50px"
      strokeWidth="8"
      fill="transparent"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
  </div>
</template>
