<script setup lang="ts">
import { SUPPORT, STORE } from '#shared/site'

const shop = useShop()
const { peptides } = useCatalog()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-navy-950 text-navy-200">
    <UContainer class="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
      <div>
        <NuxtLink to="/">
          <AppLogo inverted />
        </NuxtLink>
        <p class="mt-5 max-w-xs text-sm leading-relaxed text-navy-300">
          A curated catalog of lab tested research peptides for US researchers. Orders are fulfilled by {{ STORE.name }}, our official store.
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
            v-for="p in peptides.slice(0, 6)"
            :key="p.slug"
          >
            <NuxtLink
              :to="`/peptides/${p.slug}`"
              class="hover:text-white"
            >
              {{ p.name }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/peptides"
              class="font-semibold text-brand-300 hover:text-white"
            >
              All research peptides
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <nav aria-label="Company">
        <h2 class="text-sm font-bold text-white">
          RPLT USA
        </h2>
        <ul class="mt-4 space-y-2.5 text-sm">
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
          <li>
            <NuxtLink
              to="/terms"
              class="hover:text-white"
            >Terms and disclaimer</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/privacy"
              class="hover:text-white"
            >Privacy policy</NuxtLink>
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
        <div class="mt-5 flex flex-col gap-2 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {{ year }} RPLT USA. All rights reserved.</p>
          <p>Orders are processed and fulfilled by {{ STORE.name }}.</p>
        </div>
      </UContainer>
    </div>
  </footer>
</template>
