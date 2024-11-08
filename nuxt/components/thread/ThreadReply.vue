<script setup lang="ts">
const props = defineProps<{
  postId: string | number;
  commentId?: string | number;
}>();
const visible = defineModel<boolean>({ required: true });

const emit = defineEmits<{
  (e: "replied"): void;
}>();

const { content, deleteUnusedImages, onImageUploaded } = useQuill();
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
  } finally {
    isLoading.value = false;
  }

  deleteUnusedImages();
  visible.value = false;
  emit("replied");
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Reply" class="w-full">
    <AppQuill
      v-model="content"
      class="h-48"
      @image-uploaded="onImageUploaded"
    />
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
