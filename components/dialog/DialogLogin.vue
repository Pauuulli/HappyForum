<script setup lang="ts">
const appStore = useAppStore();
</script>

<template>
  <Dialog
    v-model:visible="appStore.dialogLoginVisible"
    modal
    header="Login"
    :style="{ width: '336px' }"
  >
  <div class="pt-1">
    <div class="mb-4 grid grid-cols-3 gap-3  items-center">
      <label for="username" class="w-24 font-semibold col-span-1">Username</label>
      <InputText id="username" class="!col-span-2" autocomplete="off" />
      <label for="email" class="w-24 font-semibold col-span-1">Password</label>
      <InputText id="email" class="!col-span-2" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
        <Button
        type="button"
        label="Login"
        @click="appStore.dialogLoginVisible = false"
      ></Button>
      <Button
        type="button"
        label="Sign up"
        severity="secondary"
        @click="appStore.dialogLoginVisible = false"
      ></Button>
      
    </div>
  </div>
    
  </Dialog>
</template>
