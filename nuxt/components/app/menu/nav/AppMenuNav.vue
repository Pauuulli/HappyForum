<script setup lang="ts">
const appStore = useAppStore();
const authStore = useAuthStore();

const basePath = "/category";
const sections: Record<string, { text: string; href: string }[]> = {
  "": [
    { text: "時事台", href: `${basePath}/1` },
    { text: "財經台", href: `${basePath}/2` },
  ],
};
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
      <button
        class="button mt-2"
        :disabled="authStore.isLoggedIn"
        :class="{ 'button-inactive': authStore.isLoggedIn }"
        @click="appStore.loginDialogVisible = true"
      >
        <i class="pi pi-user"></i>
        {{ authStore.isLoggedIn ? authStore.getUserName() : "Login" }}
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

.button-inactive {
  @apply hover:text-black;
}
</style>
