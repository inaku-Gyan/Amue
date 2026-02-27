// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@unocss/nuxt"],
  css: ["@unocss/reset/tailwind.css"],
  app: {
    baseURL: process.env.AMUE_BASE_URL || process.env.NUXT_APP_BASE_URL || "/",
  },
  nitro: {
    preset: "static",
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
  },
  content: {
    sources: {
      content: {
        driver: "fs",
        base: process.env.AMUE_CONTENT_DIR || "content",
      },
    },
  },
});
