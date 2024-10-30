<script setup lang="ts">
import type { Post, Comment } from "~/ts-type/models/thread";
import { isComment } from "~/ts-type/predicates/thread";
import formatter from "~/utils/formatter";

const props = withDefaults(
  defineProps<{
    item: Post | Comment;
    showReplyBtn: boolean;
  }>(),
  { showReplyBtn: true, type: "comment" },
);

const emit = defineEmits<{
  (e: "view-reply", comment: Comment): void;
  (e: "vote", item: Comment | Post, choice: 1 | 2): void;
}>();

const childCount = computed(() =>
  isComment(props.item) ? props.item.children.length : -1,
);
</script>

<template>
  <article class="flex flex-col gap-5 bg-white p-4">
    <header class="flex items-center gap-3">
      <span class="text-sm text-secondary"
        >#{{ isComment(item) ? item.commentOrder + 1 : 1 }}</span
      >
      <span class="text-male">{{ item.publisher }}</span>
      <span class="flex grow items-center gap-1 text-sm text-secondary">
        <i class="pi pi-circle-fill translate-y-[1px] !text-[5px]"></i>
        {{ formatter.dateToText(item.createdAt) }}
      </span>
      <span class="flex gap-1">
        <Button icon="pi pi-reply" text rounded severity="secondary" />
        <Button icon="pi pi-ellipsis-h" text rounded severity="secondary" />
      </span>
    </header>
    <div v-html="item.content" />
    <section class="flex gap-2">
      <div class="flex rounded-lg bg-gray-100 p-2 text-sm text-secondary">
        <span class="mr-3 flex items-center">
          <button
            class="hover:text-black"
            :class="{ 'pointer-events-none': item.voted == 'up' }"
            @click="$emit('vote', item, 1)"
          >
            <i
              class="pi pi-sort-up-fill mr-1 !text-xs"
              :class="{ 'text-primary': item.voted == 'up' }"
            ></i>
          </button>
          {{ item.upVotes }}
        </span>
        <span class="flex items-center">
          <button
            class="hover:text-black"
            :class="{ 'pointer-events-none': item.voted == 'down' }"
            @click="$emit('vote', item, 2)"
          >
            <i
              class="pi pi-sort-down-fill mr-1 !text-xs"
              :class="{ 'text-primary': item.voted == 'down' }"
            ></i>
          </button>
          {{ item.downVotes }}
        </span>
      </div>
      <button
        v-if="showReplyBtn && isComment(item) && childCount != 0"
        class="group flex items-center rounded-lg bg-gray-100 p-2 text-sm text-secondary"
        @click="$emit('view-reply', item)"
      >
        <i class="pi pi-comments mr-3 group-hover:text-black"></i>
        {{ childCount }}
      </button>
    </section>
  </article>
</template>
