export const useAppStore = defineStore("appStore", () => {
  const appMenuVisible = ref(false);
  const dialogLoginVisible = ref(false);

  return { appMenuVisible, dialogLoginVisible };
});
