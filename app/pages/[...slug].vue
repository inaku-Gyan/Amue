<script setup lang="ts">
const route = useRoute();

const docPath = computed(() => {
  return route.path === "/" ? "/" : route.path.endsWith("/") ? route.path.slice(0, -1) : route.path;
});

const { data: doc } = await useAsyncData(
  () => `content:${docPath.value}`,
  () => queryCollection("content").path(docPath.value).first(),
  { watch: [docPath] },
);
</script>

<template>
  <div
    v-if="doc"
    class="prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-pink-500"
  >
    <h1 v-if="doc.title">{{ doc.title }}</h1>
    <ContentRenderer :value="doc" />
  </div>

  <div v-else class="space-y-2">
    <h2 class="text-lg font-semibold">内容不存在</h2>
    <p class="text-sm text-slate-500">请在内容目录中创建对应路径的 Markdown 文件。</p>
  </div>
</template>
