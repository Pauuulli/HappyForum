<template>
  <li class="transition-colors duration-100 hover:bg-gray-100/50">
    <NuxtLink
      to="/thread/123"
      class="flex cursor-pointer flex-col gap-3 border-b-0 border-secondary px-3 py-3"
    >
      <aside class="flex items-center gap-2">
        <div class="flex w-4 items-center justify-center"></div>
        <span class="text-male">Name</span>
        <span class="text-secondary">recently</span>
        <span class="grow text-start text-sm text-secondary"
          ><i class="pi pi-thumbs-up-fill mr-1 !text-xs"></i>286</span
        >
        <Select class="h-6 w-16" />
      </aside>
      <div class="flex items-center gap-2">
        <div class="flex w-4 items-center justify-center">
          <i class="pi pi-circle-fill !text-xs text-red-500"></i>
        </div>
        <h2 class="grow">Someone's got kidnapped!</h2>
        <span
          class="flex items-center justify-center rounded-xl bg-gray-100 px-2 py-1 text-sm text-gray-400"
          >abc</span
        >
      </div>
    </NuxtLink>
    <hr class="ml-auto w-[calc(100%-34px)] border-b" />
  </li>
</template>
