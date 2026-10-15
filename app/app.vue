<script setup lang="ts">
const { public: config } = useRuntimeConfig()

await loadCatalog()

onMounted(() => {
  // Pages are prerendered; pick up any price or stock change made on the store since the last deploy.
  refreshCatalogInBrowser()
})

useHead({
  link: [
    { rel: 'preload', href: '/fonts/plus-jakarta-sans-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
  ],
  script: config.vercelAnalytics
    ? [
        { innerHTML: 'window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};' },
        { src: '/_vercel/insights/script.js', defer: true },
      ]
    : [],
})

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'RPLT USA',
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineWebSite({
    name: 'RPLT USA',
    description: 'Lab tested research peptides for US researchers.',
  }),
])
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <a
      href="#main"
      class="sr-only z-[100] rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >Skip to content</a>
    <AppTopBar />
    <AppHeader />
    <main id="main">
      <NuxtPage />
    </main>
    <AppFooter />
  </UApp>
</template>
