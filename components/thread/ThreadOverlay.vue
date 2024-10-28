<script setup lang="ts">
import type { Comment } from "~/models/thread";

const props = withDefaults(
  defineProps<{
    commentId: string;
    isLightMode: boolean;
  }>(),
  { isLightMode: true },
);

const visible = defineModel<boolean>("visible");
const comment = ref<Comment>();
const children = ref<Comment[]>();

watch(
  () => props.commentId,
  async () => {
    if(!visible.value) return;

    const reqs = [await api(`/api/comment/${props.commentId}`), await api('/api/comment','GET', {commentIds: }]
    comment.value = await api(`/api/comment/${props.commentId}`);
    if(!props.isLightMode){
      children.value = await api('/api/comment','GET', {commentIds: })
    }
  },
  { immediate: true },
);

watch(
  visible,
  () => {
    document.body.style.overflow = visible.value ? "hidden" : "";
  },
  { immediate: true },
);
</script>

<template>
  <div
    v-if="visible"
    class="fixed left-0 top-0 z-20 flex min-h-screen w-full items-center bg-gray-400/30"
    @click="visible = false"
  >
    <div class="w-full">
      <ThreadComment v-if="comment" :value="comment" />
    </div>
  </div>
</template>
