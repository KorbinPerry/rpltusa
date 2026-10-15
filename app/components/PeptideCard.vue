<script setup lang="ts">
import { CATEGORIES } from '#shared/catalog'
import type { Placement } from '#shared/referral'
import type { LivePeptide } from '~/composables/useCatalog'

const props = withDefaults(defineProps<{
  peptide: LivePeptide
  placement?: Placement
}>(), {
  placement: 'product_card',
})

const shop = useShop()
const category = computed(() => CATEGORIES[props.peptide.category])
const shopHref = computed(() => shop.product(props.peptide, { placement: props.placement }, props.peptide.listed))
</script>

<template>
  <article class="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_18px_40px_-18px_rgb(19_30_82/0.35)]">
    <div class="relative">
      <a
        :href="shopHref"
        rel="noopener"
        class="block aspect-square overflow-hidden bg-navy-50"
        tabindex="-1"
      >
        <NuxtImg
          :src="peptide.image"
          :alt="peptide.imageAlt"
          width="400"
          height="400"
          densities="x1"
          loading="lazy"
          decoding="async"
          class="size-full object-cover transition duration-300 group-hover:scale-[1.04]"
        />
      </a>
      <span class="pointer-events-none absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1 whitespace-nowrap rounded-full bg-white/95 px-2 py-1 text-[0.62rem] font-bold uppercase tracking-wide text-brand-700 shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:text-[0.68rem]">
        <UIcon
          :name="category.icon"
          class="hidden size-3 shrink-0 min-[375px]:block"
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

    <div class="flex flex-1 flex-col gap-3 p-3 sm:p-5">
      <div>
        <h3 class="text-base font-bold leading-snug text-navy-950 sm:text-lg">
          <!-- Break only at spaces, never inside names like CJC-1295 -->
          <template
            v-for="(word, i) in peptide.name.split(' ')"
            :key="i"
          >
            <span class="whitespace-nowrap">{{ word }}</span>{{ ' ' }}
          </template>
        </h3>
        <p class="mt-1 min-h-[2lh] text-xs leading-snug text-muted sm:text-sm">
          {{ peptide.tagline }}
        </p>
      </div>

      <div class="mt-auto flex items-baseline justify-between gap-2">
        <p class="whitespace-nowrap text-xl font-extrabold text-brand-600 sm:text-2xl">
          ${{ Math.round(peptide.price) }}
          <span class="hidden text-xs font-semibold text-navy-500 sm:inline">USD</span>
        </p>
        <p class="whitespace-nowrap rounded-md bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-600">
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
        :ui="{ trailingIcon: 'hidden min-[360px]:inline-flex' }"
      >
        {{ peptide.backordered ? 'Check stock' : 'Shop now' }}<span class="sr-only"> for {{ peptide.name }}</span>
      </UButton>
    </div>
  </article>
</template>
