export const useAppDialogStore = defineStore("appDialogStore", () => {
  const currLayer = ref(20);

  return { currLayer };
});
