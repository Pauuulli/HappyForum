<script setup lang="ts">
const { currLayer } = storeToRefs(useAppDialogStore());

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const layer = ref(-1);

function onOverlayClick(e: Event) {
  if (e.target != e.currentTarget) return;
  emit("click");
}

watch(() => props.visible, () => {
    if(props.visible){
        layer.value = currLayer.value;
        ++currLayer.value;
    }
});
</script>

<template>
  <div
    v-if="visible"
    class="fixed left-0 top-0 z-20 flex h-screen w-full items-center bg-gray-400/30"
    @click="onOverlayClick"
  >
    <slot />
  </div>
</template>
