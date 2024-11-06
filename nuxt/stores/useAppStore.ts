export const useAppStore = defineStore("appStore", () => {
  const isAppMenuVisible = ref(false);
  const isAppLoadingVisible = ref(false);
  const loginDialogVisible = ref(false);
  const toast = useToast();

  return { isAppMenuVisible, loginDialogVisible, isAppLoadingVisible, toast };
});
