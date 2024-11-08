<script setup lang="ts">
import type Quill from "quill";
import type { Delta } from "quill/core";
import "quill/dist/quill.snow.css";
import type { ImageUploadResult } from "~/ts-type/models/server/api/upload/image";

const content = defineModel();

const emit = defineEmits<{
  (e: "image-uploaded", imageName: string): void;
}>();

const toast = useToast();
const quillRef = ref<HTMLElement>();
let quill: Quill;
let QuillClass: typeof Quill;

onMounted(async () => {
  if (!import.meta.client || !quillRef.value) return;

  QuillClass = (await import("quill")).default;

  const toolbarOptions = [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "link", "image"],
    [{ list: "ordered" }, { list: "bullet" }],
  ];
  const options = {
    modules: {
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: handleImageBtnClick,
        },
      },
    },
    // placeholder: "Compose an epic...",
    theme: "snow",
  };
  quill = new QuillClass(quillRef.value, options);

  quill.on("text-change", handleTextChange);
});

function handleTextChange(delta: Delta) {
  content.value = quill.getSemanticHTML();
}

function handleImageBtnClick() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.multiple = true;
  fileInput.setAttribute("accept", "image/*");
  fileInput.onchange = handleImageSelect;

  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
}

async function handleImageSelect(evt: Event) {
  const target = evt.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  const fileArr = Array.from(files);

  const formData = new FormData();
  fileArr
    .filter((f) => f.type.startsWith("image/"))
    .forEach((f) => formData.append("", f));

  const results = await api<ImageUploadResult[]>("/api/upload/images", {
    method: "POST",
    body: formData,
  });
  const successUploads = results.filter((r) => r.status == "fulfilled");
  successUploads.forEach(({ status, imageName }) => {
    const range = quill.getSelection(true);
    const imagePath = `/api/assets/image/${imageName}`;
    quill.insertEmbed(range.index, "image", imagePath, QuillClass.sources.USER);
    quill.setSelection(range.index + 1);

    emit("image-uploaded", imageName);
  });

  if (results.length != successUploads.length) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Some images failed to upload.",
      life: 3000,
    });
  }
}

// function handleDeleteImage
</script>

<template>
  <div>
    <div ref="quillRef" />
  </div>
</template>

<style>
.ql-container {
  @apply h-[calc(100%-42.84px)] rounded-b-lg;
}

.ql-toolbar {
  @apply rounded-t-lg;
}
</style>
