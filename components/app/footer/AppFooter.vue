<script setup lang="ts">
import { FOOTER_HEIGHT } from "~/constants/layout";
</script>

<template>
  <footer
    class="fixed bottom-0 flex w-full bg-primary"
    :style="{ height: FOOTER_HEIGHT }"
  >
    <slot />
  </footer>
</template>
