<script setup lang="ts">
const appStore = useAppStore();
const step = ref<0 | 1>(0);
// const stepUI = ['AppMenuUserLogin', 'AppMenuUserRegister'];
</script>

<template>
  <Dialog
    v-model:visible="appStore.dialogLoginVisible"
    modal
    class="!overflow-hidden"
    :style="{ width: '336px' }"
    pt:content:class="overflow-hidden"
    @hide="step = 0"
  >
    <template #header>
      <Transition mode="out-in">
        <span v-if="step == 0" class="text-xl font-semibold">Login</span>
        <span v-else class="text-xl font-semibold">Sign Up</span>
      </Transition>
    </template>
    <AppMenuUserForm v-model:step="step" />
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
