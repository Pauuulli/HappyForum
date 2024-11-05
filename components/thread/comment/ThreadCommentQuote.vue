<script setup lang="ts">
interface Parent {
  commentId: number;
  content: string;
}

const props = defineProps<{
  ancestors: Parent[];
}>();

defineEmits<{
  (e: "view", commentId: number): void;
}>();

const currParent = computed<Parent | undefined>(() => props.ancestors[0]);
const nestedAncestors = computed<Parent[]>(() => props.ancestors.slice(1));
</script>

<template>
  <blockquote v-if="currParent" class="flex min-h-10">
    <div
      class="cursor-pointer border-l-2 border-gray-400 pl-3 transition-colors hover:border-black"
      @click="$emit('view', currParent.commentId)"
    />
    <div class="flex flex-col justify-center gap-3">
      <ThreadCommentQuote :ancestors="nestedAncestors" />
      {{ currParent.content }}
    </div>
  </blockquote>
</template>
