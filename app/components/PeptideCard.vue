<script setup lang="ts">
import { CATEGORIES } from '#shared/catalog'
import type { Placement } from '#shared/referral'
import type { LivePeptide } from '~/composables/useCatalog'

const props = withDefaults(defineProps<{
  peptide: LivePeptide
  placement?: Placement
  /** Load eagerly when the card is above the fold */
  eager?: boolean
  headingLevel?: 'h2' | 'h3'
}>(), {
  placement: 'product_card',
  eager: false,
  headingLevel: 'h3',
})

const shop = useShop()
const category = computed(() => CATEGORIES[props.peptide.category])
const detailPath = computed(() => `/peptides/${props.peptide.slug}`)
const shopHref = computed(() => shop.product(props.peptide, { placement: props.placement }, props.peptide.listed))
</script>

<template>
  <article class="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_18px_40px_-18px_rgb(19_30_82/0.35)]">
    <div class="relative">
      <NuxtLink
        :to="detailPath"
        class="relative block aspect-square overflow-hidden bg-navy-50"
        tabindex="-1"
      >
        <NuxtImg
          :src="peptide.image"
          :alt="peptide.imageAlt"
          width="400"
          height="400"
          densities="x1"
          :loading="eager ? 'eager' : 'lazy'"
          :fetchpriority="eager ? 'high' : 'auto'"
          decoding="async"
          class="size-full object-cover transition duration-300 group-hover:scale-[1.04]"
        />
      </NuxtLink>
      <span class="pointer-events-none absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-brand-700 shadow-sm sm:left-3 sm:top-3">
        <UIcon
          :name="category.icon"
          class="size-3"
        />
        {{ category.label }}
      </span>
      <span
        v-if="peptide.backordered"
        class="pointer-events-none absolute right-2.5 top-2.5 rounded-full bg-amber-100 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-amber-800 sm:right-3 sm:top-3"
      >
        Backordered
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-3.5 sm:p-5">
      <div>
        <component
          :is="headingLevel"
          class="text-base font-bold leading-snug text-navy-950 sm:text-lg"
        >
          <NuxtLink
            :to="detailPath"
            class="hover:text-brand-600"
          >
            {{ peptide.name }}
          </NuxtLink>
        </component>
        <p class="mt-1 line-clamp-2 text-xs text-muted sm:text-sm">
          {{ peptide.tagline }}
        </p>
      </div>

      <div class="mt-auto flex items-baseline justify-between gap-2">
        <p class="text-xl font-extrabold text-brand-600 sm:text-2xl">
          ${{ Math.round(peptide.price) }}
          <span class="text-xs font-semibold text-navy-500">USD</span>
        </p>
        <p class="rounded-md bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-600">
          {{ peptide.size }}
        </p>
      </div>

      <UButton
        :to="shopHref"
        rel="noopener"
        block
        size="lg"
        trailing-icon="i-lucide-arrow-up-right"
        class="min-h-11 rounded-xl"
      >
        {{ peptide.backordered ? 'Check stock' : 'Shop now' }}<span class="sr-only"> for {{ peptide.name }}</span>
      </UButton>
      <NuxtLink
        :to="detailPath"
        class="-mt-1 text-center text-xs font-semibold text-navy-500 hover:text-brand-600 sm:text-sm"
      >
        Research details
      </NuxtLink>
    </div>
  </article>
</template>
