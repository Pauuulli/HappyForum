<script setup lang="ts">
import type { Comment, Overlay } from "~/ts-type/models/thread";

// interface ViewHistoryItem {
//   comment: Comment;
//   children: Comment[];
// }

const props = defineProps<{ postId: string; overlay: Overlay }>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "view-reply", parentCmt: Comment): void;
  (e: "go-page", page: 1 | -1): void;
}>();

const { onVote } = useThreadComment(props.postId);

const threadCommentOn = {
  vote: onVote,
};

function onOverlayClick(e: Event) {
  if (e.target != e.currentTarget) return;
  emit("close");
}
</script>

<template>
  <div
    v-if="overlay.visible"
    class="fixed left-0 top-0 z-20 flex h-screen w-full items-center bg-gray-400/30"
    @click="onOverlayClick"
  >
    <div v-if="overlay.isLight">
      <ThreadComment
        :comment="overlay.comment"
        v-on="threadCommentOn"
        @view-reply="$emit('view-reply', overlay.comment)"
      />
    </div>

    <div
      v-else-if="overlay.commentHistory[overlay.currCommentIdx]"
      class="flex h-full w-full flex-col bg-gray-400"
    >
      <div class="mb-5 flex items-center justify-end bg-white p-1">
        <Button
          icon="pi pi-times"
          text
          class="text-black"
          @click="overlay.visible = false"
        />
      </div>
      <ThreadComment
        :comment="overlay.commentHistory[overlay.currCommentIdx].comment"
        :show-reply-btn="false"
        @view-reply="
          $emit(
            'view-reply',
            overlay.commentHistory[overlay.currCommentIdx].comment,
          )
        "
      />
      <div class="mt-5 flex flex-col gap-3">
        <ThreadComment
          v-for="child in overlay.commentHistory[overlay.currCommentIdx]
            .children"
          :key="child.commentId"
          :comment="child"
          v-on="threadCommentOn"
          @view-reply="$emit('view-reply', child)"
        />
      </div>
      <div class="mt-auto flex items-center justify-evenly gap-3 bg-white p-1">
        <Button
          icon="pi pi-arrow-left"
          :class="{ invisible: overlay.currCommentIdx == 0 }"
          @click="$emit('go-page', -1)"
        />
        <Button
          icon="pi pi-arrow-right"
          :class="{
            invisible:
              overlay.currCommentIdx == overlay.commentHistory.length - 1,
          }"
          @click="$emit('go-page', 1)"
        />
      </div>
    </div>
  </div>
</template>
