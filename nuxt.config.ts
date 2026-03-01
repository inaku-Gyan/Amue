import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// https://nuxt.com/docs/api/configuration/nuxt-config
const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],
  
  modules: [
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "motion-v/nuxt",
    "nuxt-og-image",
  ],

  vite: {
    server: {
      fs: {
        allow: [rootDir, resolve(rootDir, "..")],
      },
    },
  },
});
