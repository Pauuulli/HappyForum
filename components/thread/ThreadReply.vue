<script setup lang="ts">
const props = defineProps<{ postId: string }>();
const visible = defineModel<boolean>({ required: true });

const emit = defineEmits<{
  (e: "reply"): void;
}>();

const content = ref("");
const isLoading = ref(false);

async function onReply() {
  isLoading.value = true;
  try {
    await api(`/api/post/${props.postId}/reply`, {
      method: "POST",
      body: { content: content.value },
    });
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
      <Button label="Cancel" outlined />
    </div>
  </Dialog>
</template>
