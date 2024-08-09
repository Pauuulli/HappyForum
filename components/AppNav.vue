<script setup lang="ts">
import Button from "primevue/button";
</script>

<template>
  <div class="relative h-screen w-full bg-gray-400/50">
    <article class="absolute left-0 top-0 z-10 flex w-72 h-full">
      <aside
        class="flex w-14 flex-col items-center justify-between bg-gray-200 p-3"
      >
        <Button icon="pi pi-android" />
        <section class="flex w-full flex-col items-center gap-2">
          <Button icon="pi pi-android" />
          <Button icon="pi pi-android" />
          <Button icon="pi pi-android" />
          <Button icon="pi pi-android" />
        </section>
      </aside>
      <nav class="flex flex-col gap-3 bg-white grow">
        
      </nav>
    </article>
  </div>
</template>
