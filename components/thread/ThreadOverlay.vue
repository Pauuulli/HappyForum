<script setup lang="ts">
import Dialog from "primevue/dialog";
import type { Comment } from "~/models/thread";

const props = defineProps<{
  commentId: string;
}>();

const visible = defineModel<boolean>("visible");
const comment = ref<Comment>();

watch(
  () => props.commentId,
  async () => {
    if (visible.value) {
      comment.value = await api(`/api/comment/${props.commentId}`);
    }
  },
);

watch(visible, () => {
  document.body.style.overflow = visible.value ? "hidden" : "";
});
</script>

<template>
  <div
    v-if="visible"
    class="absolute left-0 top-0 z-20 flex min-h-screen w-full items-center bg-gray-400/30"
    @click="visible = false"
  >
    <div class="w-full">
    <p>{{commentId }}</p>

      <ThreadComment v-if="comment" :value="comment" />
    </div>
  </div>
</template>
