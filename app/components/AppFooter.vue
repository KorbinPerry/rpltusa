<script setup lang="ts">
import { SUPPORT, STORE } from '#shared/site'

const shop = useShop()
const { peptides } = useCatalog()
const popular = computed(() => [...peptides.value].sort((a, b) => a.demandRank - b.demandRank).slice(0, 6))
const year = new Date().getFullYear()

// Open the matching legal panel when a visitor lands on /#terms or /#privacy.
const route = useRoute()
const openPanel = ref<string | null>(null)
watch(() => route.hash, (hash) => {
  if (hash === '#terms' || hash === '#privacy')
    openPanel.value = hash.slice(1)
}, { immediate: true })
</script>

<template>
  <footer class="bg-navy-950 text-navy-200">
    <UContainer class="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
      <div>
        <NuxtLink to="/">
          <AppLogo inverted />
        </NuxtLink>
        <p class="mt-5 max-w-xs text-sm leading-relaxed text-navy-300">
          A curated lineup of lab tested research peptides for US researchers. Orders are fulfilled by {{ STORE.name }}, our official store.
        </p>
        <UButton
          :to="shop.catalog({ placement: 'footer' })"
          rel="noopener"
          size="lg"
          class="mt-6 min-h-11 rounded-xl"
          trailing-icon="i-lucide-arrow-up-right"
        >
          Visit the store
        </UButton>
      </div>

      <nav aria-label="Popular peptides">
        <h2 class="text-sm font-bold text-white">
          Popular peptides
        </h2>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li
            v-for="p in popular"
            :key="p.slug"
          >
            <a
              :href="shop.product(p, { placement: 'footer' }, p.listed)"
              rel="noopener"
              class="hover:text-white"
            >
              {{ p.name }}
            </a>
          </li>
        </ul>
      </nav>

      <nav aria-label="On this page">
        <h2 class="text-sm font-bold text-white">
          RPLT USA
        </h2>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li>
            <NuxtLink
              to="/#best-sellers"
              class="hover:text-white"
            >Best sellers</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/#how-it-works"
              class="hover:text-white"
            >How it works</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/#quality"
              class="hover:text-white"
            >Quality standards</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/#faq"
              class="hover:text-white"
            >FAQ</NuxtLink>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="text-sm font-bold text-white">
          Order support
        </h2>
        <p class="mt-4 text-sm leading-relaxed text-navy-300">
          Questions about an order, shipping or a product? The {{ STORE.name }} team handles all orders and support.
        </p>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li>
            <a
              :href="SUPPORT.phoneHref"
              class="flex items-center gap-2 hover:text-white"
            >
              <UIcon
                name="i-lucide-phone"
                class="size-4 text-brand-300"
              />
              {{ SUPPORT.phone }}
            </a>
          </li>
          <li>
            <a
              :href="`mailto:${SUPPORT.email}`"
              class="flex items-center gap-2 break-all hover:text-white"
            >
              <UIcon
                name="i-lucide-mail"
                class="size-4 shrink-0 text-brand-300"
              />
              {{ SUPPORT.email }}
            </a>
          </li>
          <li class="flex items-center gap-2 text-navy-300">
            <UIcon
              name="i-lucide-clock"
              class="size-4 text-brand-300"
            />
            {{ SUPPORT.hours }}
          </li>
          <li>
            <a
              :href="shop.contact({ placement: 'footer' })"
              rel="noopener"
              class="flex items-center gap-2 hover:text-white"
            >
              <UIcon
                name="i-lucide-message-square"
                class="size-4 text-brand-300"
              />
              Contact form
            </a>
          </li>
        </ul>
      </div>
    </UContainer>

    <div class="border-t border-white/10">
      <UContainer class="pb-28 pt-6 md:pb-6">
        <p class="text-xs leading-relaxed text-navy-400">
          <strong class="text-navy-200">Research use only.</strong>
          All products listed on this website are intended solely for in vitro research and laboratory use by qualified professionals. They are not drugs, foods, cosmetics or dietary supplements, are not for human or veterinary use, and are not intended to diagnose, treat, cure or prevent any disease. Statements on this website have not been evaluated by the Food and Drug Administration. You must be 18 or older to purchase.
        </p>

        <div class="mt-5 space-y-2 text-xs leading-relaxed text-navy-400">
          <details
            id="terms"
            class="group rounded-lg border border-white/10 px-4 py-3"
            :open="openPanel === 'terms'"
          >
            <summary class="flex cursor-pointer list-none items-center justify-between font-semibold text-navy-200 marker:hidden">
              Terms of use and research disclaimer
              <UIcon
                name="i-lucide-chevron-down"
                class="size-4 transition group-open:rotate-180"
              />
            </summary>
            <div class="mt-3 space-y-2">
              <p>RPLT USA (rpltusa.com) is an informational page. It does not sell products, take payments or create accounts. All orders are placed with, processed by and fulfilled by {{ STORE.name }} and are governed by the terms, shipping policy and return policy published on that store.</p>
              <p>By continuing to the store and ordering you confirm that you are at least 18 years of age, are purchasing for lawful laboratory research only, and accept responsibility for complying with all local, state and federal laws that apply to you.</p>
              <p>Prices, vial sizes and stock shown here are read from the store and refreshed regularly. The price and availability shown at checkout are final. Content on this page is provided as is, without warranties, and RPLT USA is not liable for any use or misuse of information on this page or of any product purchased from the store.</p>
            </div>
          </details>
          <details
            id="privacy"
            class="group rounded-lg border border-white/10 px-4 py-3"
            :open="openPanel === 'privacy'"
          >
            <summary class="flex cursor-pointer list-none items-center justify-between font-semibold text-navy-200 marker:hidden">
              Privacy
              <UIcon
                name="i-lucide-chevron-down"
                class="size-4 transition group-open:rotate-180"
              />
            </summary>
            <div class="mt-3 space-y-2">
              <p>RPLT USA has no forms or checkout and does not ask for your name, email, address or payment details. Purchases happen on {{ STORE.name }}, whose privacy policy applies to anything you provide there.</p>
              <p>To credit visits that start here, this page stores an anonymous visitor id (rplt_vid) and the campaign tags from the link that brought you here (rplt_attr, kept up to 30 days) in your browser's local storage. Links to the store carry those values plus referral tags such as utm_source=rpltusa. Clear site data for rpltusa.com in your browser to remove them.</p>
              <p>The site is hosted on Vercel, which processes standard request data to deliver and secure it. When enabled, Vercel Web Analytics collects aggregated, cookie free page view statistics. Questions: {{ SUPPORT.email }}.</p>
            </div>
          </details>
        </div>

        <div class="mt-5 flex flex-col gap-2 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {{ year }} RPLT USA. All rights reserved.</p>
          <p>Orders are processed and fulfilled by {{ STORE.name }}.</p>
        </div>
      </UContainer>
    </div>
  </footer>
</template>
