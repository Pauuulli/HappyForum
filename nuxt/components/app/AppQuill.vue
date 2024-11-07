<script setup lang="ts">
import type Quill from "quill";
import "quill/dist/quill.snow.css";

const content = defineModel();

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

function handleTextChange() {
  content.value = quill!.getSemanticHTML();
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
  for (const f of fileArr) {
    if (!f.type.startsWith("image/")) continue;

    const range = quill.getSelection(true);
    const url =
      "https://static9.depositphotos.com/1431107/1154/i/450/depositphotos_11542091-stock-photo-sample-stamp.jpg";
    quill.insertEmbed(range.index, "image", url, QuillClass.sources.USER);
    quill.setSelection(range.index + 1);
  }
}
</script>

<template>
  <div ref="quillRef" />
</template>
