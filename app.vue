<script setup lang="ts">
const auth = useAuthStore();
const { isLoggedIn } = storeToRefs(auth);
const { refreshToken } = auth;

onMounted(() => {
  const userExp = localStorage.getItem("USER_EXP");
  isLoggedIn.value = userExp != null && +userExp > Date.now();

  if (isLoggedIn.value) refreshToken();
});
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
