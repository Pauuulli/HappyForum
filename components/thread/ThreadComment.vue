<script setup lang="ts">
import type { Post, Comment } from "~/models/thread";
import formatter from "~/utils/formatter";

const props = defineProps<{
  value: Post | Comment;
  number: number;
}>();

const emit = defineEmits<{
  (e: "voted", type: 1 | 2, commentIdx?: number): void;
}>();

async function onVote(type: 1 | 2) {
  const isCmt = isComment(props.value);

  const url = isCmt
    ? `/api/comment/${props.value.commentId}/vote`
    : `/api/post/${props.value.postId}/vote`;

  await api(url, "POST", { type });

  emit("voted", type, isCmt ? props.number : undefined);
}

function isComment(val: Post | Comment): val is Comment {
  return "childCount" in val;
}
</script>

<template>
  <article class="flex flex-col gap-6 bg-white p-3">
    <header class="flex items-center gap-3">
      <span class="text-sm text-secondary">#{{ number + 2 }}</span>
      <span class="text-male">{{ value.publisher }}</span>
      <span class="flex grow items-center gap-1 text-sm text-secondary">
        <i class="pi pi-circle-fill !text-[5px]"></i>
        {{ formatter.dateToText(value.createdAt) }}
      </span>
      <span class="text-secondary">
        <i class="pi pi-reply mr-3"></i>
        <i class="pi pi-ellipsis-h mr-3"></i>
      </span>
    </header>
    <p>{{ value.content }}</p>
    <section class="flex gap-2">
      <div class="flex rounded-lg bg-gray-100 p-2 text-sm text-secondary">
        <span class="mr-3 flex items-center">
          <button class="hover:text-black" @click="onVote(1)">
            <i class="pi pi-sort-up-fill mr-1 !text-xs"></i>
          </button>
          {{ value.upVotes }}
        </span>
        <span class="flex items-center">
          <button class="hover:text-black" @click="onVote(2)">
            <i class="pi pi-sort-down-fill mr-1 !text-xs"></i>
          </button>
          {{ value.downVotes }}
        </span>
      </div>
      <button
        v-if="isComment(value) && value.childCount != 0"
        class="group flex items-center rounded-lg bg-gray-100 p-2 text-sm text-secondary"
      >
        <i class="pi pi-comments mr-3 group-hover:text-black"></i>
        {{ value.childCount }}
      </button>
    </section>
  </article>
</template>
