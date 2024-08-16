<script setup lang="ts">
//import Button from "primevue/button";

const ANIMATION_DURATION = 300;

const { appMenuVisible: visible } = storeToRefs(useAppStore());
const _visible = ref(false);
const _interactable = ref(false);

watchEffect(() => {
  if (!visible.value) {
    _visible.value = false;
    setTimeout(() => {
      _interactable.value = false;
    }, ANIMATION_DURATION);
  } else {
    _interactable.value = true;
    nextTick(() => (_visible.value = true));
  }
});
</script>

<template>
  <div
    class="fixed left-0 top-0 z-50 h-screen w-full transition-colors"
    :class="[{ 'bg-gray-400/30': _visible }, { invisible: !_interactable }]"
    :style="{ 'transition-duration': `${ANIMATION_DURATION}ms` }"
    @click="visible = false"
  >
    <article
      class="flex h-full w-72 transition-transform"
      :class="[{ '-translate-x-full': !_visible }]"
      :style="{ 'transition-duration': `${ANIMATION_DURATION}ms` }"
      @click="(e) => e.stopPropagation()"
    >
      <aside
        class="flex w-14 flex-col items-center justify-between bg-gray-200 p-3"
      >
        <Button icon="pi pi-android" />
        <section class="flex w-full flex-col items-center gap-2">
          <Button icon="pi pi-android" />
          <Button icon="pi pi-android" />
          <Button icon="pi pi-android" />
          <Button icon="pi pi-android" />
        </section>
      </aside>
      <AppMenuNav class="grow" />
    </article>
  </div>
</template>
