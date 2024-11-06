<script setup lang="ts">
const { isAppLoadingVisible } = storeToRefs(useAppStore());

watch(isAppLoadingVisible, () => {
  if (isAppLoadingVisible.value) document.body.style.overflow = "hidden";
});
</script>

<template>
  <div
    v-if="isAppLoadingVisible"
    class="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center bg-gray-400/30"
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
