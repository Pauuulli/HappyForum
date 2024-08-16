<script setup lang="ts">
definePageMeta({
  validate: async (route) => {
    return route.params.id == '123';
  }
})

</script>

<template>
    <ThreadHeader />
    <ThreadPagination class="mt-12" />
    <article class="flex flex-col gap-3 bg-gray-100">
      <ThreadComment />
      <ThreadComment />
      <ThreadComment />
      <ThreadComment />
    </article>
    <ThreadPagination />
    <article class="flex flex-col gap-3 bg-gray-100">
      <ThreadComment />
      <ThreadComment />
      <ThreadComment />
      <ThreadComment />
    </article>
</template>
