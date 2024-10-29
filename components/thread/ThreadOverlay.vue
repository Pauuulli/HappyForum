<script setup lang="ts">
import type { Comment, Overlay } from "~/ts-type/models/thread";

interface ViewHistoryItem {
  comment: Comment;
  children: Comment[];
}

const props = defineProps<{ postId: string }>();

const { onVote } = useThreadComment(props.postId);
const overlay = defineModel<Overlay>({ required: true });
const viewHistory = ref<ViewHistoryItem[]>([]);
const currCmtIdx = ref(0);

const threadCommentOn = {
  vote: onVote,
  viewReply: onViewReply,
};

watch(
  () => overlay.value.visible,
  async () => {
    if (!import.meta.client) return;

    const visible = overlay.value.visible;

    if (visible) {
      document.body.style.overflow = "hidden";

      const { visible, comment, isLightMode } = overlay.value;
      if (!visible || !comment || isLightMode) return;

      const children = await loadChildren(comment);
      viewHistory.value = [{ comment, children }];
    } else {
      document.body.style.overflow = "";
      viewHistory.value = [];
      currCmtIdx.value = 0;
    }
  },
);

async function onViewReply(parentCmt: Comment) {
  if (overlay.value.isLightMode) {
    overlay.value.isLightMode = false;
    const children = await loadChildren(viewHistory.value[0].comment);
    viewHistory.value[0].children = children;
    return;
  }

  const { comment: nextComment } =
    viewHistory.value[currCmtIdx.value + 1] ?? {};

  if (!nextComment || nextComment.commentId != parentCmt.commentId) {
    const children = await loadChildren(parentCmt);
    const newHistory = { comment: parentCmt, children };

    if (!nextComment) viewHistory.value.push(newHistory);
    else
      viewHistory.value = [
        ...viewHistory.value.slice(0, currCmtIdx.value + 1),
        newHistory,
      ];
  }

  ++currCmtIdx.value;
}

function onOverlayClick(e: Event) {
  if (e.target != e.currentTarget) return;
  overlay.value.visible = false;
}

async function loadChildren(comment: Comment) {
  const childrenIds = comment.children.map((chd) => chd.commentId);
  const { data: newChildren } = await api<{ data: Comment[] }>(
    `/api/post/${props.postId}/comments`,
    {
      query: { commentIds: childrenIds },
    },
  );
  return newChildren;
}
</script>

<template>
  <div
    v-if="overlay.visible"
    class="fixed left-0 top-0 z-20 flex h-screen w-full items-center bg-gray-400/30"
    @click="onOverlayClick"
  >
    <div v-if="overlay.isLightMode && overlay.comment">
      <ThreadComment :item="overlay.comment" v-on="threadCommentOn" />
    </div>

    <div
      v-else-if="viewHistory[currCmtIdx]"
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
        :item="viewHistory[currCmtIdx].comment"
        :show-reply-btn="false"
      />
      <div class="mt-5 flex flex-col gap-3">
        <ThreadComment
          v-for="child in viewHistory[currCmtIdx].children"
          :key="child.commentId"
          :item="child"
          v-on="threadCommentOn"
        />
      </div>
      <div class="mt-auto flex items-center justify-evenly gap-3 bg-white p-1">
        <Button
          icon="pi pi-arrow-left"
          :class="{ invisible: currCmtIdx == 0 }"
          @click="--currCmtIdx"
        />
        <Button
          icon="pi pi-arrow-right"
          :class="{ invisible: currCmtIdx == viewHistory.length - 1 }"
          @click="++currCmtIdx"
        />
      </div>
    </div>
  </div>
</template>
