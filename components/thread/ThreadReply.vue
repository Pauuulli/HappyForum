<script setup lang="ts">
const props = defineProps<{ postId: string; commentId?: string }>();
const visible = defineModel<boolean>({ required: true });

const emit = defineEmits<{
  (e: "replied"): void;
}>();

const content = ref("");
const isLoading = ref(false);

async function onReply() {
  isLoading.value = true;

  const url = props.commentId
    ? `/api/post/${props.postId}/comments/${props.commentId}/reply`
    : `/api/post/${props.postId}/reply`;
  try {
    await api(url, {
      method: "POST",
      body: { content: content.value },
    });

    visible.value = false;
    emit("replied");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Reply" class="w-full">
    <Editor v-model="content" editor-style="height: 12rem" />
    <div class="mt-5 flex justify-end gap-3">
      <Button
        icon="pi pi-send"
        label="Reply"
        @click="onReply"
        :disabled="isLoading"
      />
      <Button label="Cancel" outlined @click="visible = false" />
    </div>
  </Dialog>
</template>
