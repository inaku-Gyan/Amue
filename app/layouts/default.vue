<template>
  <div class="min-h-screen bg-pink-50 text-slate-700">
    <header class="mx-auto max-w-3xl px-6 pt-8">
      <div class="rounded-2xl border border-pink-100 bg-white/90 px-5 py-4 shadow-sm">
        <p class="text-sm text-pink-500">Amue Blog Framework</p>
        <h1 class="text-xl font-semibold tracking-tight">Cute & Flat Starter Layer</h1>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-6 py-8">
      <div class="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
        <slot />
      </div>
    </main>
  </div>
</template>
