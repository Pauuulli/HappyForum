<script setup lang="ts">

const visible = defineModel<boolean>("visible", { required: true });
const content = ref('');

function onOverlayClick() {
  visible.value = false;
}
</script>

<template>
  <Dialog v-model:visible="visible" :header="`Create New Post - ${'cctoy'}`" modal class="w-full">
    <div class="flex flex-col gap-5">
      
      <InputText placeholder="Title" />
      <Editor v-model="content" editor-style="height: 12rem"  />
      <small class="text-end">{{ content.length }}/5000</small>
      <div class="flex justify-end gap-3">
        <Button icon="pi pi-send" label="Create" />
        <Button label="Cancel" outlined />
      </div>
    </div>
    <p>{{ content }}</p>
  </Dialog>
</template>
