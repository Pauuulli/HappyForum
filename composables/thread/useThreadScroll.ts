import { FOOTER_HEIGHT } from "~/constants/layout";
import type { PaginatedData } from "~/ts-type/models/pagination";
import type { CommentPage, Comment } from "~/ts-type/models/thread";

export function useThreadScroll(
  commentsPages: Ref<CommentPage[]>,
  pageCurrNumber: ComputedRef<number>,
  pagination: Ref<PaginatedData<any>["pagination"]>,
  loadCommentsAndUpdatePagination: (page: number) => Promise<Comment[]>,
  changeUrlPage: (page: number) => void,
) {
  let lastScrollY = -1;
  const headerHeight = 48;

  onMounted(() => window.addEventListener("scroll", onScroll));

  onUnmounted(() => window.removeEventListener("scroll", onScroll));

  async function onScroll() {
    window.removeEventListener("scroll", onScroll);

    const currScrollY = window.scrollY;
    const pageCurrIdx = commentsPages.value.findIndex(
      (cp) => cp.page == pageCurrNumber.value,
    );
    const pageElem = commentsPages.value[pageCurrIdx].elem;
    const { top, bottom } = pageElem!.getBoundingClientRect();
    const windowTop = headerHeight;
    const windowBottom =
      document.documentElement.clientHeight - parseFloat(FOOTER_HEIGHT);

    if (
      lastScrollY < currScrollY &&
      bottom < windowBottom &&
      pageCurrNumber.value < pagination.value.totalPages - 1
    ) {
      let pageNextComments = commentsPages.value[pageCurrIdx + 1]?.comments;
      if (!pageNextComments) {
        pageNextComments = await loadCommentsAndUpdatePagination(
          pageCurrNumber.value + 1,
        );
        commentsPages.value.push({
          comments: pageNextComments,
          page: pageCurrNumber.value + 1,
        });
      }
      changeUrlPage(pageCurrNumber.value + 1);
    } else if (
      lastScrollY > currScrollY &&
      top > windowTop &&
      pageCurrNumber.value > commentsPages.value[0].page
    ) {
      changeUrlPage(pageCurrNumber.value - 1);
    }

    lastScrollY = currScrollY;
    window.addEventListener("scroll", onScroll);
  }

  function scrollToTop(elem: HTMLElement) {
    window.removeEventListener("scroll", onScroll);

    const { y: elemY } = elem.getBoundingClientRect();
    const windowY = window.scrollY;

    window.scrollTo({ top: windowY + elemY - headerHeight });

    setTimeout(() => window.addEventListener("scroll", onScroll), 0);
  }

  return { scrollToTop };
}
