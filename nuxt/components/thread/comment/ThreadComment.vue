<script setup lang="ts">
import type { Comment } from "~/ts-type/models/thread";
import formatter from "~/utils/formatter";

const props = withDefaults(
  defineProps<{
    comment: Comment;
    showQuote?: boolean;
    showChildren?: boolean;
  }>(),
  { showQuote: true, showChildren: true },
);

const emit = defineEmits<{
  (e: "view-reply", comment: Comment): void;
  (e: "vote", comment: Comment, choice: 1 | 2): void;
  (e: "reply", comment: Comment): void;
  (e: "view-parent", commentId: number): void;
}>();

const childCount = computed(() => props.comment.children.length);
</script>

<template>
  <article class="flex flex-col gap-5 bg-white p-4">
    <header class="flex items-center gap-3">
      <span class="text-sm text-secondary">#{{ comment.commentOrder }}</span>
      <span class="text-male">{{ comment.publisher }}</span>
      <span class="flex grow items-center gap-1 text-sm text-secondary">
        <i class="pi pi-circle-fill translate-y-[1px] !text-[5px]"></i>
        {{ formatter.dateToText(comment.createdAt) }}
      </span>
      <span class="flex gap-1">
        <Button
          icon="pi pi-reply"
          text
          rounded
          severity="secondary"
          @click="$emit('reply', comment)"
        />
        <Button icon="pi pi-ellipsis-h" text rounded severity="secondary" />
      </span>
    </header>
    <!-- Ancestors -->
    <ThreadCommentQuote
      v-if="showQuote"
      :ancestors="comment.parents"
      @view="$emit('view-parent', $event)"
    />
    <!-- Content -->
    <div v-html="comment.content" />
    <!-- Toolbar -->
    <section class="flex gap-2">
      <div class="flex rounded-lg bg-gray-100 p-2 text-sm text-secondary">
        <span class="mr-3 flex items-center">
          <button
            class="hover:text-black"
            :class="{ 'pointer-events-none': comment.voted != null }"
            @click="$emit('vote', comment, 1)"
          >
            <i
              class="pi pi-sort-up-fill mr-1 !text-xs"
              :class="{ 'text-primary': comment.voted == 'up' }"
            ></i>
          </button>
          {{ comment.upVotes }}
        </span>
        <span class="flex items-center">
          <button
            class="hover:text-black"
            :class="{ 'pointer-events-none': comment.voted != null }"
            @click="$emit('vote', comment, 2)"
          >
            <i
              class="pi pi-sort-down-fill mr-1 !text-xs"
              :class="{ 'text-primary': comment.voted == 'down' }"
            ></i>
          </button>
          {{ comment.downVotes }}
        </span>
      </div>
      <button
        v-if="showChildren && childCount != 0"
        class="group flex items-center rounded-lg bg-gray-100 p-2 text-sm text-secondary"
        @click="$emit('view-reply', comment)"
      >
        <i class="pi pi-comments mr-3 group-hover:text-black"></i>
        {{ childCount }}
      </button>
    </section>
  </article>
</template>
