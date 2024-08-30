<script setup lang="ts">
defineEmits<{
  (e: "cancel"): void;
}>();

const { isAppLoadingVisible } = storeToRefs(useAppStore());

async function onSignup() {
  isAppLoadingVisible.value = true;
  const res = await $fetch("/api/user/register", {
    method: "POST",
  });
  console.log(res);
}
</script>

<template>
  <div>
    <div class="mb-4 grid grid-cols-3 items-center gap-3">
      <label for="username" class="col-span-1 w-24 font-semibold"
        >Username</label
      >
      <InputText id="username" class="!col-span-2" autocomplete="off" />
      <label for="password" class="col-span-1 w-24 font-semibold"
        >Password</label
      >
      <InputText id="password" class="!col-span-2" autocomplete="off" />
      <label for="email" class="col-span-1 w-24 font-semibold">Email</label>
      <InputText id="email" class="!col-span-2" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Sign Up" @click="onSignup"></Button>
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="$emit('cancel')"
      ></Button>
    </div>
  </div>
</template>
