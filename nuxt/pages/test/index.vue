<script setup lang="ts">
const show = ref(0);
const content = ref('');
</script>

<template>
  <article class="h-screen">
    <div v-if="show == 0" class="p-5">
        <AppQuill v-model="content" />
    </div>
    <div v-else class="p-5">
      <AppQuill />
    </div>
    <Button @click="show = 0">0</Button>
    <Button @click="show = 1">1</Button>

    <p>{{ content }}</p>
    <AppFooter>
      <AppFooterButtonMenu />
    </AppFooter>
  </article>
</template>
