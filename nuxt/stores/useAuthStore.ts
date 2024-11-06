export const useAuthStore = defineStore("authStore", () => {
  const isLoggedIn = ref(false);

  async function login(name: string, password: string) {
    const { exp } = await api<{ exp: number }>("/api/user/login", {
      method: "POST",
      body: {
        name,
        password,
      },
    });

    localStorage.setItem("USER_NAME", name);
    localStorage.setItem("USER_EXP", String(exp));

    isLoggedIn.value = true;
  }

  async function logout() {
    await api("/api/user/logout", { method: "DELETE" });
    clearLoginInfo();
  }

  async function refreshToken() {
    const { exp } = await api<{ exp: number }>("/api/user/refresh", {
      method: "POST",
    });

    localStorage.setItem("USER_EXP", String(exp));
  }

  function getUserName() {
    return isLoggedIn.value ? localStorage.getItem("USER_NAME") : undefined;
  }

  function clearLoginInfo() {
    localStorage.removeItem("USER_NAME");
    localStorage.removeItem("USER_EXP");

    isLoggedIn.value = false;
  }

  return {
    isLoggedIn,
    login,
    logout,
    refreshToken,
    getUserName,
    clearLoginInfo,
  };
});
