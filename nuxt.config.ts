// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // compatibilityDate: "2025-07-15",

  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/ui",
    "@unocss/nuxt",
    "@vueuse/nuxt",
    "motion-v/nuxt",
    "nuxt-og-image",
  ],
});
