export function useQuill() {
  const content = ref("");
  let uploadedImgNames: string[] = [];

  function deleteUnusedImages() {
    const unusedImgNames = uploadedImgNames.filter(
      (ip) => !content.value.includes(ip),
    );

    unusedImgNames.forEach((uin) =>
      api(`/api/assets/image/${uin}`, { method: "DELETE" }),
    );
    uploadedImgNames = [];
  }

  function onImageUploaded(imageName: string) {
    uploadedImgNames.push(imageName);
  }

  return { content, deleteUnusedImages, onImageUploaded };
}
