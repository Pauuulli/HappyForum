<script setup lang="ts"></script>

<template>
  <article class="flex flex-col gap-6 bg-white p-3">
    <header class="flex items-center gap-3">
      <span class="text-sm text-secondary">#1</span>
      <span class="text-male">Hello World</span>
      <span class="flex grow items-center gap-1 text-sm text-secondary">
        <i class="pi pi-circle-fill !text-[5px]"></i>
        2小時前
      </span>
      <span class="text-secondary">
        <i class="pi pi-reply mr-3"></i>
        <i class="pi pi-ellipsis-h mr-3"></i>
      </span>
    </header>
    <p>由end game 開始 之後既全撚部都要重拍啦 垃圾到癲</p>
    <section class="flex gap-2">
      <div class="flex rounded-lg bg-gray-100 p-2 text-sm text-secondary">
        <span class="mr-3 flex items-center">
          <button class="hover:text-black">
            <i class="pi pi-sort-up-fill mr-1 !text-xs"></i>
          </button>
          69
        </span>
        <span class="flex items-center">
          <button class="hover:text-black">
            <i class="pi pi-sort-down-fill mr-1 !text-xs"></i>
          </button>
          12
        </span>
      </div>
      <button
        class="group flex items-center rounded-lg bg-gray-100 p-2 text-sm text-secondary"
      >
        <i class="pi pi-comments mr-3 group-hover:text-black"></i>
        5
      </button>
    </section>
  </article>
</template>
