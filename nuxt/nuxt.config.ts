// https://nuxt.com/docs/api/configuration/nuxt-config
import { AppPreset } from "./presets/app-preset";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  routeRules: {
    "/": { redirect: "/category/1" },
  },
  modules: ["@primevue/nuxt-module", "@pinia/nuxt", "@vee-validate/nuxt"],
  primevue: {
    options: {
      theme: {
        preset: AppPreset,
        options: {
          cssLayer: {
            name: "primevue",
            order: "tailwind-base, primevue, primeIcon, tailwind-utilities",
          },
        },
      },
    },
    importPT: { as: "Aura", from: "~/presets/aura" },
  },
});
