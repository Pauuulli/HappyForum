<script setup lang="ts">
const appStore = useAppStore();

defineEmits<{
  (e: "signup"): void;
}>();
</script>

<template>
  <div>
    <div class="mb-4 grid grid-cols-3 items-center gap-3">
      <label for="username" class="col-span-1 w-24 font-semibold"
        >Username</label
      >
      <InputText id="username" class="!col-span-2" autocomplete="off" />
      <label for="password" class="col-span-1 w-24 font-semibold">Password</label>
      <InputText id="password" class="!col-span-2" autocomplete="off" />
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
        @click="$emit('signup')"
      ></Button>
    </div>
  </div>
</template>
