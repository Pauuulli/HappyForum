<script setup lang="ts">
const show = ref(0);
const content = ref("");
const uploadedImgNames = ref<string[]>([]);

function deleteUnusedImages() {
  const unusedImgNames = uploadedImgNames.value.filter(
    (ip) => !content.value.includes(ip),
  );

  unusedImgNames.forEach((uin) =>
    api(`/api/assets/image/${uin}`, { method: "DELETE" }),
  );
  uploadedImgNames.value = [];
}
</script>

<template>
  <article class="h-screen">
    <div v-if="show == 0" class="p-5">
      <AppQuill
        v-model="content"
        @image-uploaded="uploadedImgNames.push($event)"
      />
    </div>
    <div v-else class="p-5">
      <AppQuill />
    </div>
    <Button @click="show = 0">0</Button>
    <Button @click="show = 1">1</Button>
    <Button @click="deleteUnusedImages">Delete Unused Images</Button>

    <p>{{ content }}</p>
    <AppFooter>
      <AppFooterButtonMenu />
    </AppFooter>
  </article>
</template>
