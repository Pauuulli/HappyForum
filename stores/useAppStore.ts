export const useAppStore = defineStore("appStore", () => {
  const isAppMenuVisible = ref(false);
  const isAppLoadingVisible = ref(false);
  const dialogLoginVisible = ref(false);
  const toast = useToast();

  return { isAppMenuVisible, dialogLoginVisible, isAppLoadingVisible, toast };
});
