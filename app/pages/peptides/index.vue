<script setup lang="ts">
import { STORE_CATALOG_SIZE } from '#shared/catalog'
import { STORE } from '#shared/site'

const shop = useShop()
const { peptides } = useCatalog()
const sorted = computed(() => [...peptides.value].sort((a, b) => a.demandRank - b.demandRank))

usePageSeo({
  title: 'Research Peptides Catalog: BPC-157, Tirzepatide',
  description: 'Browse lab tested research peptides including BPC-157, Tirzepatide, Semaglutide, GHK-Cu, TB-500 and Tesamorelin. 99%+ purity with a COA. Free US shipping over $150.',
  socialTitle: 'Research Peptides Catalog | RPLT USA',
  image: '/og/peptides.jpg',
  imageAlt: 'RPLT USA research peptides catalog',
})

useSchemaOrg([
  defineWebPage({ '@type': 'CollectionPage' }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: 'Peptides', item: '/peptides' },
    ],
  }),
  defineItemList({
    name: 'RPLT USA research peptides',
    itemListElement: sorted.value.map((p, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': p.name,
      'url': `/peptides/${p.slug}`,
    })),
  }),
])
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-gradient-to-b from-white to-brand-50/70">
      <div
        class="bg-molecule pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        aria-hidden="true"
      />
      <UContainer class="relative py-12 sm:py-16">
        <SectionHeading
          as="h1"
          eyebrow="Research catalog"
          title="Research Peptides Catalog"
          :description="`The ${sorted.length} most researched peptides in the US, each lab tested to 99% purity or higher with a Certificate of Analysis. Live pricing from ${STORE.name}.`"
        />
        <div class="mt-7 flex justify-center">
          <UButton
            :to="shop.catalog({ placement: 'peptides_index' })"
            rel="noopener"
            size="xl"
            trailing-icon="i-lucide-arrow-up-right"
            class="rounded-xl px-7"
          >
            Shop all {{ STORE_CATALOG_SIZE }} peptides
          </UButton>
        </div>
      </UContainer>
    </section>

    <section class="pb-16 pt-4 sm:pb-20">
      <UContainer>
        <div class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          <PeptideCard
            v-for="(p, i) in sorted"
            :key="p.slug"
            :peptide="p"
            :eager="i < 2"
            heading-level="h2"
          />
          <div class="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-brand-900 to-brand-600 p-4 text-white sm:p-8">
            <UIcon
              name="i-lucide-layout-grid"
              class="size-7 text-brand-200 sm:size-8"
            />
            <p class="mt-3 text-lg font-extrabold leading-tight sm:mt-4 sm:text-xl">
              Looking for something else?
            </p>
            <p class="mt-2 text-xs leading-relaxed text-brand-100 sm:text-sm">
              The full store catalog has {{ STORE_CATALOG_SIZE }} research peptides, including NAD+, KPV, SS-31, PT-141 and bacteriostatic water.
            </p>
            <UButton
              :to="shop.catalog({ placement: 'catalog_all' })"
              rel="noopener"
              color="neutral"
              size="md"
              block
              trailing-icon="i-lucide-arrow-up-right"
              class="mt-5 min-h-11 justify-center rounded-xl bg-white text-brand-700 hover:bg-brand-50 sm:mt-6"
            >
              View catalog
            </UButton>
          </div>
        </div>
        <ResearchNotice class="mx-auto mt-12 max-w-3xl" />
      </UContainer>
    </section>

    <StickyShopBar />
  </div>
</template>
