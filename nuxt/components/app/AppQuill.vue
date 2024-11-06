<script setup lang="ts">
import Quill from "quill";
import "quill/dist/quill.snow.css";
import type Toolbar from "quill/modules/toolbar";

const content = defineModel();

const quillRef = ref<HTMLElement>();
let quill: Quill | undefined;

onMounted(async () => {
  if (!quillRef.value) return;

  const Quill = (await import("quill")).default;

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
  quill = new Quill(quillRef.value, options);

  quill.on("text-change", handleTextChange);
});

function handleTextChange() {
  content.value = quill!.getSemanticHTML();
}

function handleImageBtnClick() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.multiple = true;
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
  // for(let i = 0; i)
  // if (files && files.length > 0) {
  //     //
  //     const fileName = files[0].name; // Get the name of the first selected file
  //     console.log('Selected file:', fileName);
  // } else {
  //     console.log('No file selected');
  // }
  fileArr.forEach(f => {
    const range = quill!.getSelection()!;
    const url = URL.createObjectURL(f);
    quill!.insertEmbed(range?.index,)
  })

  console.log(fileArr);
}


</script>

<template>
  <div ref="quillRef" />
</template>
