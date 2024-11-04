export function useElementScrollLazyload(
  container: Ref<HTMLElement | undefined>,
  minOffset: number,
  onScrollToEnd: () => Promise<any>,
) {
  let isHandling = false;
  let isWithin = false;

  onMounted(() => {
    if (!container.value) throw new Error("No reference to the container.");

    container.value.addEventListener("scroll", onContainerScroll);
  });

  async function onContainerScroll() {
    const ctn = container.value!;
    const currOffset = ctn.scrollHeight - ctn.scrollTop - ctn.clientHeight;

    if (currOffset <= minOffset) {
      if (!isWithin && !isHandling) {
        isHandling = true;

        await onScrollToEnd();
        isHandling = false;
      }
      isWithin = true;
    } else isWithin = false;
  }
}
