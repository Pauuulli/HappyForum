<script setup lang="ts">
const props = defineProps<{
  catId: string;
}>();
const visible = defineModel<boolean>("visible", { required: true });

const emit = defineEmits<{
  (e: "created"): void;
}>();

const toast = useToast();

const title = ref("");
const { content, deleteUnusedImages, onImageUploaded } = useQuill();
const isLoading = ref(false);

const isCreateDisabled = computed(
  () =>
    title.value.length == 0 ||
    content.value.length == 0 ||
    content.value.length > 5000 ||
    isLoading.value,
);

async function onCreate() {
  isLoading.value = true;
  try {
    await api("/api/post/create", {
      method: "POST",
      body: { catId: props.catId, content: content.value, title: title.value },
    });
  } finally {
    isLoading.value = false;
  }

  toast.add({
    severity: "success",
    summary: "Successfully Created",
    life: 3000,
  });
  title.value = "";
  content.value = "";
  visible.value = false;
  deleteUnusedImages();
  emit("created");
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="`Create New Post - ${'cctoy'}`"
    modal
    class="w-full"
  >
    <form class="flex flex-col gap-5">
      <InputText v-model="title" :maxlength="200" placeholder="Title" />
      <AppQuill
        v-model="content"
        class="h-48"
        @image-uploaded="onImageUploaded"
      />
      <small
        class="text-end text-base font-semibold"
        :class="{ 'text-red-500': content.length > 5000 }"
        >{{ content.length }}/5000</small
      >
      <div class="flex justify-end gap-3">
        <Button
          :icon="isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-send'"
          label="Create"
          type="button"
          :disabled="isCreateDisabled"
          @click="onCreate"
        />
        <Button
          label="Cancel"
          type="button"
          outlined
          @click="visible = false"
        />
      </div>
    </form>
  </Dialog>
</template>
