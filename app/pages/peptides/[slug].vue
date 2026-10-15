<script setup lang="ts">
import { CATEGORIES, getPeptide } from '#shared/catalog'
import { STORE } from '#shared/site'
import { STORE_PATHS } from '#shared/referral'

const route = useRoute()
const slug = String(route.params.slug)

if (!getPeptide(slug))
  throw createError({ statusCode: 404, statusMessage: 'Peptide not found', fatal: true })

const shop = useShop()
const { peptides, bySlug } = useCatalog()
const peptide = computed(() => bySlug(slug)!)
const category = computed(() => CATEGORIES[peptide.value.category])

const primaryHref = computed(() => shop.product(peptide.value, { placement: 'product_page_primary' }, peptide.value.listed))
const stickyHref = computed(() => shop.product(peptide.value, { placement: 'sticky_mobile' }, peptide.value.listed))

const heading = computed(() => peptide.value.slug === 'ghk-cu' ? 'GHK-Cu Copper Peptide' : `${peptide.value.name} Research Peptide`)

const specs = computed(() => [
  { label: 'Amount', value: peptide.value.size },
  ...peptide.value.facts,
  { label: 'Storage', value: 'Cold, dry and away from light' },
])

const related = computed(() => {
  const others = peptides.value.filter(p => p.slug !== slug)
  const sameCategory = others.filter(p => p.category === peptide.value.category)
  const rest = others.filter(p => p.category !== peptide.value.category).sort((a, b) => a.demandRank - b.demandRank)
  return [...sameCategory, ...rest].slice(0, 4)
})

const faqItems = computed(() => peptide.value.faqs.map(f => ({ label: f.q, content: f.a })))

const fill = (text: string) => text.replaceAll('{size}', peptide.value.size)
const seoTitle = computed(() => fill(peptide.value.seo.title))
const seoDescription = computed(() => fill(peptide.value.seo.description))

usePageSeo({
  title: seoTitle,
  description: seoDescription,
  image: `/og/${slug}.jpg`,
  imageAlt: () => `${peptide.value.name} research peptide from RPLT USA`,
})

const { shopUrl } = useRuntimeConfig().public
const storeProductUrl = computed(() => new URL(peptide.value.listed ? STORE_PATHS.product(peptide.value.storeId) : STORE_PATHS.catalog, shopUrl).toString())

useSchemaOrg([
  defineWebPage({ '@type': ['ItemPage', 'FAQPage'] }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: 'Peptides', item: '/peptides' },
      { name: peptide.value.name, item: `/peptides/${slug}` },
    ],
  }),
  defineProduct({
    name: `${peptide.value.name} ${peptide.value.size}`,
    description: peptide.value.summary,
    image: peptide.value.image,
    sku: `RPLT-${peptide.value.storeId.toUpperCase()}`,
    category: `Research peptides > ${category.value.label}`,
    brand: { '@type': 'Brand', 'name': STORE.name },
    offers: {
      price: peptide.value.price,
      priceCurrency: 'USD',
      availability: peptide.value.backordered ? 'BackOrder' : 'InStock',
      url: storeProductUrl.value,
      seller: { '@type': 'Organization', 'name': STORE.name },
    },
  }),
  ...peptide.value.faqs.map(f => defineQuestion({ name: f.q, acceptedAnswer: f.a })),
])
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-gradient-to-b from-white to-brand-50/70">
      <div
        class="bg-molecule pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
        aria-hidden="true"
      />
      <UContainer class="relative py-6 sm:py-10 lg:py-14">
        <nav
          aria-label="Breadcrumb"
          class="text-sm"
        >
          <ol class="flex flex-wrap items-center gap-1.5 text-navy-500">
            <li>
              <NuxtLink
                to="/"
                class="hover:text-brand-600"
              >Home</NuxtLink>
            </li>
            <li aria-hidden="true">
              <UIcon
                name="i-lucide-chevron-right"
                class="size-3.5"
              />
            </li>
            <li>
              <NuxtLink
                to="/peptides"
                class="hover:text-brand-600"
              >Peptides</NuxtLink>
            </li>
            <li aria-hidden="true">
              <UIcon
                name="i-lucide-chevron-right"
                class="size-3.5"
              />
            </li>
            <li
              aria-current="page"
              class="font-semibold text-navy-800"
            >
              {{ peptide.name }}
            </li>
          </ol>
        </nav>

        <div class="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-2 lg:gap-14">
          <div class="mx-auto w-full max-w-md lg:max-w-none">
            <div class="rounded-3xl border border-navy-100 bg-white p-3 shadow-[0_30px_70px_-34px_rgb(19_30_82/0.45)] sm:p-4">
              <NuxtImg
                :src="peptide.image"
                :alt="peptide.imageAlt"
                width="400"
                height="400"
                densities="x1"
                loading="eager"
                fetchpriority="high"
                preload
                class="aspect-square w-full rounded-2xl object-cover"
              />
            </div>
          </div>

          <div class="flex flex-col">
            <p class="inline-flex items-center gap-1.5 self-start rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              <UIcon
                :name="category.icon"
                class="size-3.5"
              />
              {{ category.label }} research
            </p>
            <h1 class="mt-4 text-[2.1rem] font-extrabold leading-tight tracking-tight text-navy-950 sm:text-5xl">
              {{ heading }}
            </h1>
            <p
              v-if="peptide.fullName"
              class="mt-2 text-base font-medium text-navy-500"
            >
              {{ peptide.fullName }}
            </p>

            <div class="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p class="text-3xl font-extrabold text-brand-600 sm:text-4xl">
                ${{ Math.round(peptide.price) }}
                <span class="text-base font-semibold text-navy-500">USD</span>
              </p>
              <p class="rounded-lg bg-white px-2.5 py-1 text-sm font-bold text-navy-700 ring-1 ring-navy-100">
                {{ peptide.size }} vial
              </p>
              <p
                class="text-sm font-semibold"
                :class="peptide.backordered ? 'text-amber-700' : 'text-emerald-700'"
              >
                <UIcon
                  :name="peptide.backordered ? 'i-lucide-clock' : 'i-lucide-circle-check'"
                  class="-mt-0.5 me-1 inline size-4 align-middle"
                />{{ peptide.backordered ? 'Backordered' : 'In stock' }}
              </p>
            </div>

            <p class="mt-5 text-base leading-relaxed text-navy-600 sm:text-lg">
              {{ peptide.summary }}
            </p>

            <div class="mt-7 flex flex-col gap-3 sm:flex-row">
              <UButton
                :to="primaryHref"
                rel="noopener"
                size="xl"
                trailing-icon="i-lucide-arrow-up-right"
                class="justify-center rounded-xl px-7 shadow-lg shadow-brand-600/25"
              >
                Buy {{ peptide.name }}
              </UButton>
              <UButton
                :to="shop.catalog({ placement: 'product_page_secondary', product: peptide.slug })"
                rel="noopener"
                size="xl"
                color="neutral"
                variant="outline"
                class="justify-center rounded-xl bg-white px-7"
              >
                Browse full catalog
              </UButton>
            </div>
            <p class="mt-3 text-sm text-muted">
              Secure checkout at {{ STORE.name }}, our official store.
            </p>

            <ul class="mt-7 grid grid-cols-2 gap-3 text-sm">
              <li class="flex items-center gap-2 font-semibold text-navy-700">
                <UIcon
                  name="i-lucide-badge-check"
                  class="size-5 shrink-0 text-brand-600"
                />99%+ purity
              </li>
              <li class="flex items-center gap-2 font-semibold text-navy-700">
                <UIcon
                  name="i-lucide-file-check-2"
                  class="size-5 shrink-0 text-brand-600"
                />COA included
              </li>
              <li class="flex items-center gap-2 font-semibold text-navy-700">
                <UIcon
                  name="i-lucide-truck"
                  class="size-5 shrink-0 text-brand-600"
                />Free shipping over ${{ STORE.freeShippingThreshold }}
              </li>
              <li class="flex items-center gap-2 font-semibold text-navy-700">
                <UIcon
                  name="i-lucide-timer"
                  class="size-5 shrink-0 text-brand-600"
                />Ships in 1 to 2 days
              </li>
            </ul>

            <ResearchNotice class="mt-7" />
          </div>
        </div>
      </UContainer>
    </section>

    <section class="py-14 sm:py-18">
      <UContainer class="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 class="text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
            What {{ peptide.name }} is studied for
          </h2>
          <ul class="mt-6 space-y-4">
            <li
              v-for="area in peptide.researchAreas"
              :key="area"
              class="flex gap-3"
            >
              <span class="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <UIcon
                  name="i-lucide-microscope"
                  class="size-4"
                />
              </span>
              <span class="text-base leading-relaxed text-navy-700">{{ area }}</span>
            </li>
          </ul>
          <p class="mt-6 text-sm leading-relaxed text-muted">
            Descriptions summarize published preclinical and laboratory research and are provided for educational purposes only. They are not medical claims.
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
            Specifications
          </h2>
          <dl class="mt-6 divide-y divide-navy-100 overflow-hidden rounded-2xl border border-navy-100 bg-white">
            <div
              v-for="spec in specs"
              :key="spec.label"
              class="flex items-center justify-between gap-4 px-5 py-3.5 text-sm"
            >
              <dt class="font-medium text-navy-500">
                {{ spec.label }}
              </dt>
              <dd class="text-right font-semibold text-navy-900">
                {{ spec.value }}
              </dd>
            </div>
          </dl>
        </div>
      </UContainer>
    </section>

    <section class="bg-navy-50/70 py-14 sm:py-18">
      <UContainer class="max-w-3xl">
        <h2 class="text-center text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
          {{ peptide.name }} FAQ
        </h2>
        <UAccordion
          :items="faqItems"
          type="multiple"
          class="mt-8 rounded-2xl border border-navy-100 bg-white px-5 sm:px-6"
          :ui="{
            item: 'border-b border-navy-100 last:border-b-0',
            trigger: 'py-5 text-base font-bold text-navy-950',
            body: 'pb-5 text-[0.95rem] leading-relaxed text-navy-600',
          }"
        />
        <div class="mt-8 text-center">
          <UButton
            :to="shop.product(peptide, { placement: 'faq' }, peptide.listed)"
            rel="noopener"
            size="lg"
            trailing-icon="i-lucide-arrow-up-right"
            class="min-h-11 rounded-xl"
          >
            Shop {{ peptide.name }} for ${{ Math.round(peptide.price) }}
          </UButton>
        </div>
      </UContainer>
    </section>

    <section class="py-14 sm:py-18">
      <UContainer>
        <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2 class="text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
            Related research peptides
          </h2>
          <NuxtLink
            to="/peptides"
            class="text-sm font-semibold text-brand-600 hover:underline"
          >
            View all peptides
          </NuxtLink>
        </div>
        <div class="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          <PeptideCard
            v-for="p in related"
            :key="p.slug"
            :peptide="p"
            placement="product_page_related"
          />
        </div>
      </UContainer>
    </section>

    <StickyShopBar
      :href="stickyHref"
      :label="`Buy ${peptide.name}`"
      :note="`$${Math.round(peptide.price)} | ${peptide.size} | Free shipping over $${STORE.freeShippingThreshold}`"
    />
  </div>
</template>
