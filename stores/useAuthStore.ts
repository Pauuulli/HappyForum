export const useAuthStore = defineStore("authStore", () => {
  const isLoggedIn = ref(false);

  async function login(name: string, password: string) {
    const { exp } = await api<{ exp: number }>("/api/user/login", "POST", {
      name,
      password,
    });

    localStorage.setItem("USER_NAME", name);
    localStorage.setItem("USER_EXP", String(exp));

    isLoggedIn.value = true;
  }

  async function logout() {
    await api("/api/user/logout", "DELETE");

    localStorage.removeItem("USER_NAME");
    localStorage.removeItem("USER_EXP");

    isLoggedIn.value = false;
  }

  async function refreshToken(){
    const {exp} = await api<{exp: number}>('/api/user/refresh', 'POST');

    localStorage.setItem('USER_EXP', String(exp));
  }

  return { isLoggedIn, login, logout, refreshToken };
});
