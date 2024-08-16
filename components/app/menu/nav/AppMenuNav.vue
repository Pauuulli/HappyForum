<script setup lang="ts">
const basePath = "/category";
const sections: Record<string, { text: string; href: string }[]> = {
  "": [
    { text: "吹水台", href: `${basePath}/吹水台` },
    { text: "自選台", href: `${basePath}/自選台` },
    { text: "創意台", href: `${basePath}/創意台` },
    { text: "熱門", href: `${basePath}/熱門` },
  ],
};
const appStore = useAppStore();
</script>

<template>
  <nav class="flex flex-col gap-6 bg-white p-3">
    <div
      class="flex items-center gap-6 rounded-md bg-gray-200 p-2 focus-within:outline focus-within:outline-1 focus-within:outline-yellow-400"
    >
      <i class="pi pi-search !text-xl"></i>
      <input
        type="text"
        class="w-full bg-inherit outline-0"
        placeholder="Search"
      />
    </div>

    <div class="px-2">
      <button class="button">
        <i class="pi pi-clock"></i>
        History
      </button>
      <button class="button mt-2" @click="appStore.dialogLoginVisible = true">
        <i class="pi pi-user"></i>
        Login
      </button>
    </div>

    <div class="flex flex-col gap-3 overflow-auto px-2 py-3">
      <article class="grid grid-cols-2 gap-3">
        <AppMenuNavLink
          v-for="link in sections['']"
          :text="link.text"
          :href="link.href"
        />
      </article>
    </div>
  </nav>
</template>

<style scoped>
.button {
  @apply flex items-center gap-6 text-lg transition-colors hover:text-yellow-400;
}
</style>
