import type { Overlay, Comment } from "~/ts-type/models/thread";
import { loadCommentChildren } from "~/utils/thread";

export function useThreadOverlay(postId: Ref<string>) {
  const overlay = ref<Overlay>();

  async function viewOverlayDetailed(comment: Comment) {
    const children = await loadCommentChildren(comment, postId.value);

    overlay.value = {
      visible: true,
      isLight: false,
      commentHistory: [{ comment, children }],
      currCommentIdx: 0,
    };

    disableScroll();
  }

  async function viewOverlayLight(commentId: number) {
    const comment = await api(`/api/post/${postId.value}/comments/${commentId}`);
    overlay.value = { isLight: true, visible: true, comment };

    disableScroll();
  }

  function goPage(page: number) {
    if (!overlay.value || overlay.value.isLight) return;
    overlay.value.currCommentIdx = page;
  }

  async function onViewOverlayReply(parentCmt: Comment) {
    if (!overlay.value) return;

    if (overlay.value.isLight) {
      viewOverlayDetailed(parentCmt);
      return;
    }

    const cmtHistory = overlay.value.commentHistory;
    const idx = overlay.value.currCommentIdx;
    const { comment: nextComment } = cmtHistory[idx] ?? {};

    if (!nextComment || nextComment.commentId != parentCmt.commentId) {
      const children = await loadCommentChildren(parentCmt, postId.value);
      const newHistory = { comment: parentCmt, children };

      if (!nextComment) cmtHistory.push(newHistory);
      else
        overlay.value.commentHistory = [
          ...cmtHistory.slice(0, idx + 1),
          newHistory,
        ];
    }

    ++overlay.value.currCommentIdx;
  }

  function closeOverlay() {
    overlay.value!.visible = false;
    enableScroll();
  }

  function disableScroll() {
    document.body.style.overflow = "hidden";
  }

  function enableScroll() {
    document.body.style.overflow = "";
  }

  return {
    overlay,
    viewOverlayDetailed,
    viewOverlayLight,
    closeOverlay,
    goPage,
    onViewOverlayReply,
  };
}
