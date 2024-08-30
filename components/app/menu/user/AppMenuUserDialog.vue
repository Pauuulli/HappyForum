<script setup lang="ts">
const appStore = useAppStore();
const step = ref<0 | 1>(0);
// const stepUI = ['AppMenuUserLogin', 'AppMenuUserRegister'];
</script>

<template>
  <Dialog
    v-model:visible="appStore.dialogLoginVisible"
    modal
    :header="step == 0 ? 'Login' : 'Sign Up'"
    :style="{ width: '336px' }"
  >
    <Transition mode="out-in">
      <AppMenuUserLogin v-if="step == 0" @signup="step = 1" />
      <AppMenuUserRegister v-else="step == 1" @cancel="step = 0" />
    </Transition>
  </Dialog>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  @apply transition-opacity duration-200;
}

.v-enter-from,
.v-leave-to {
  @apply opacity-0;
}
</style>
