<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const shop = useShop()
const is404 = computed(() => props.error?.statusCode === 404)

useSeoMeta({
  title: () => (is404.value ? 'Page not found' : 'Something went wrong'),
  robots: 'noindex, follow',
})
</script>

<template>
  <UApp>
    <AppTopBar />
    <AppHeader />
    <main
      id="main"
      class="bg-gradient-to-b from-white to-brand-50/70"
    >
      <UContainer class="flex min-h-[60vh] max-w-2xl flex-col items-center justify-center py-20 text-center">
        <p class="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
          {{ is404 ? 'Error 404' : `Error ${error?.statusCode || 500}` }}
        </p>
        <h1 class="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-5xl">
          {{ is404 ? 'This page does not exist' : 'Something went wrong' }}
        </h1>
        <p class="mt-4 text-base text-muted sm:text-lg">
          {{ is404 ? 'The link may be outdated. Everything RPLT USA offers is on the home page.' : 'Please try again in a moment.' }}
        </p>
        <div class="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <UButton
            size="xl"
            class="justify-center rounded-xl px-7"
            @click="clearError({ redirect: '/' })"
          >
            Back to home
          </UButton>
          <UButton
            :to="shop.catalog({ placement: 'not_found' })"
            rel="noopener"
            size="xl"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-arrow-up-right"
            class="justify-center rounded-xl bg-white px-7"
          >
            Visit the store
          </UButton>
        </div>
      </UContainer>
    </main>
    <AppFooter />
  </UApp>
</template>
