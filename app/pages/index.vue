<script setup lang="ts">
import { STORE_CATALOG_SIZE } from '#shared/catalog'
import { STORE, SUPPORT } from '#shared/site'

const shop = useShop()
const { peptides, bySlug } = useCatalog()

const featured = computed(() => peptides.value.filter(p => p.featured).sort((a, b) => a.demandRank - b.demandRank))
const more = computed(() => peptides.value.filter(p => !p.featured).sort((a, b) => a.demandRank - b.demandRank))
const heroPeptide = computed(() => bySlug('bpc-157')!)

const heroStats = [
  { value: '99%+', label: 'Purity' },
  { value: 'COA', label: 'Every vial' },
  { value: '50', label: 'US states' },
]

const trust = [
  { icon: 'i-lucide-badge-check', title: '99%+ purity', text: 'Every vial is listed at 99% purity or higher.' },
  { icon: 'i-lucide-file-check-2', title: 'Certificate of Analysis', text: 'Documentation included with each order.' },
  { icon: 'i-lucide-package-check', title: 'Tracked, discreet shipping', text: 'Insured delivery to all 50 states.' },
  { icon: 'i-lucide-lock', title: 'Secure checkout', text: `Orders handled by ${STORE.name}.` },
]

const steps = [
  { icon: 'i-lucide-search', title: 'Pick your peptide', text: 'Compare the most researched compounds in the US, with vial sizes and live pricing right on this page.' },
  { icon: 'i-lucide-shopping-bag', title: `Check out at ${STORE.name}`, text: 'Tap Shop and you land on the exact product at our official store, where checkout is secure and fast.' },
  { icon: 'i-lucide-truck', title: 'Track it to your door', text: 'Orders are processed in 1 to 2 business days and typically arrive 2 to 5 business days after dispatch.' },
]

const quality = [
  { title: 'Purity of 99% or higher', text: 'Each listing meets a 99% minimum purity standard.' },
  { title: 'Certificate of Analysis', text: 'Documentation with your order to verify identity and purity.' },
  { title: 'Lyophilized for stability', text: 'Freeze dried powder in sealed vials holds up in transit and storage.' },
  { title: 'Protected, discreet packaging', text: 'Temperature sensitive items ship with protective materials.' },
]

const faqs = [
  { label: 'What is RPLT USA?', content: `RPLT USA is a curated research peptide catalog for US researchers. We feature the most researched compounds and connect you to ${STORE.name}, our official store, for secure checkout and fulfillment.` },
  { label: 'Who processes and ships my order?', content: `Every order is placed, processed and shipped by ${STORE.name}. When you tap a Shop button you go straight to the matching product on the store.` },
  { label: 'How fast is shipping?', content: `Orders are processed within 1 to 2 business days after payment is confirmed. Standard US delivery typically takes 2 to 5 business days after dispatch, and tracking is emailed when your order ships. Orders over $${STORE.freeShippingThreshold} ship free.` },
  { label: 'Do the peptides come with a Certificate of Analysis?', content: 'Yes. Every peptide in the catalog is listed at 99% purity or higher and includes a Certificate of Analysis.' },
  { label: 'How is Tirzepatide different from Semaglutide?', content: 'Semaglutide activates the GLP-1 receptor only. Tirzepatide activates both the GIP and GLP-1 receptors, which is why researchers often study the two side by side.' },
  { label: 'How should the vials be stored?', content: 'Keep lyophilized vials cold, dry and away from light. Refrigeration is standard for short term storage and freezing for long term storage. Once reconstituted with bacteriostatic water, keep the vial refrigerated.' },
  { label: 'Are these products for human use?', content: 'No. All products are sold strictly for in vitro research and laboratory use. They are not drugs, foods or supplements and are not for human or veterinary consumption. You must be 18 or older to purchase.' },
  { label: 'What is the return policy?', content: 'Because research compounds cannot be verified once they leave the facility, sales are final. Damaged, defective or incorrect items reported within 7 days of delivery are replaced or refunded.' },
  { label: 'How do I contact support?', content: `Call ${SUPPORT.phone} or email ${SUPPORT.email}, ${SUPPORT.hours}. The store team answers all order and product questions.` },
]

usePageSeo({
  title: 'Research Peptides for Sale USA, 99%+ Purity',
  description: 'Shop lab tested research peptides: BPC-157, Tirzepatide, Semaglutide, GHK-Cu and more. 99%+ purity, a COA with every vial and free US shipping over $150.',
  socialTitle: 'RPLT USA | Lab Tested Research Peptides',
  image: '/og/default.jpg',
})

useSchemaOrg([
  defineWebPage({ '@type': ['WebPage', 'FAQPage'] }),
  ...faqs.map(f => defineQuestion({ name: f.label, acceptedAnswer: f.content })),
])
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/60 to-brand-50">
      <div
        class="bg-molecule pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        aria-hidden="true"
      />
      <UContainer class="relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-20">
        <div>
          <p class="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm sm:text-[0.8rem]">
            <span class="size-2 rounded-full bg-flag-500" />
            Research Peptides. Lab Tested. USA.
          </p>
          <h1 class="mt-5 text-[2.1rem] font-extrabold leading-[1.06] tracking-tight text-navy-950 min-[375px]:text-[2.35rem] sm:text-5xl lg:text-[3.6rem]">
            Lab Tested Research Peptides, <span class="text-brand-600">Delivered Across the USA.</span>
          </h1>
          <p class="mt-5 max-w-xl text-base leading-relaxed text-navy-600 sm:text-lg">
            A curated lineup of the most researched peptides in the country, including
            <strong class="whitespace-nowrap font-semibold text-navy-900">BPC-157</strong>,
            <strong class="whitespace-nowrap font-semibold text-navy-900">Tirzepatide</strong>,
            <strong class="whitespace-nowrap font-semibold text-navy-900">Semaglutide</strong> and
            <strong class="whitespace-nowrap font-semibold text-navy-900">GHK-Cu</strong>.
            Every vial is 99% pure or higher and comes with a Certificate of Analysis.
          </p>
          <div class="mt-7 flex flex-col gap-3 sm:flex-row">
            <UButton
              :to="shop.catalog({ placement: 'hero_primary' })"
              rel="noopener"
              size="xl"
              trailing-icon="i-lucide-arrow-up-right"
              class="justify-center rounded-xl px-7 shadow-lg shadow-brand-600/25"
            >
              Shop research peptides
            </UButton>
            <UButton
              to="#best-sellers"
              size="xl"
              color="neutral"
              variant="outline"
              class="justify-center rounded-xl bg-white px-7"
            >
              See best sellers
            </UButton>
          </div>
          <dl class="mt-8 grid grid-cols-3 gap-2 sm:mt-9 sm:gap-4">
            <div
              v-for="stat in heroStats"
              :key="stat.label"
              class="flex flex-col-reverse justify-end rounded-2xl border border-navy-100 bg-white px-3 py-3.5 shadow-sm sm:p-4"
              data-testid="hero-stat"
            >
              <dt class="mt-1.5 whitespace-nowrap text-xs font-medium leading-none text-muted sm:text-sm">
                {{ stat.label }}
              </dt>
              <dd class="whitespace-nowrap text-[1.35rem] font-extrabold leading-none text-navy-950 sm:text-[1.7rem]">
                {{ stat.value }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="relative">
          <div class="relative rounded-3xl border border-navy-100 bg-white p-3 shadow-[0_30px_70px_-30px_rgb(19_30_82/0.45)] sm:p-4">
            <span class="absolute -top-3 right-5 z-10 rounded-xl border border-navy-100 bg-white px-3.5 py-1.5 text-xs font-bold text-navy-900 shadow-md">
              Featured: <span class="whitespace-nowrap text-brand-600">{{ heroPeptide.name }}</span>
            </span>
            <NuxtImg
              src="/images/hero-vials.webp"
              alt="BPC-157, TB-500 and CJC-1295 research peptide vials on a lab bench"
              width="1200"
              height="1200"
              sizes="xs:100vw sm:640px lg:560px"
              loading="eager"
              fetchpriority="high"
              preload
              class="aspect-[4/3] w-full rounded-2xl object-cover sm:aspect-[5/4]"
            />
            <div class="flex items-center justify-between gap-4 px-1.5 pb-1 pt-4 sm:px-2">
              <div class="min-w-0">
                <p class="truncate text-base font-bold text-navy-950 sm:text-lg">
                  {{ heroPeptide.name }} {{ heroPeptide.size }}
                </p>
                <p class="text-sm text-muted">
                  The most studied recovery peptide
                </p>
              </div>
              <UButton
                :to="shop.product(heroPeptide, { placement: 'hero_card' }, heroPeptide.listed)"
                rel="noopener"
                size="lg"
                trailing-icon="i-lucide-arrow-up-right"
                class="min-h-11 shrink-0 rounded-xl"
                :aria-label="`Shop ${heroPeptide.name} for $${Math.round(heroPeptide.price)}`"
              >
                ${{ Math.round(heroPeptide.price) }}
              </UButton>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- TRUST STRIP -->
    <section
      aria-label="Why researchers order through RPLT USA"
      class="border-y border-navy-100 bg-white"
    >
      <UContainer class="grid grid-cols-2 gap-x-3 gap-y-5 py-6 sm:gap-x-4 sm:gap-y-6 sm:py-7 lg:grid-cols-4">
        <div
          v-for="item in trust"
          :key="item.title"
          class="flex items-center gap-2.5 sm:items-start sm:gap-3"
        >
          <span class="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 sm:size-10">
            <UIcon
              :name="item.icon"
              class="size-5"
            />
          </span>
          <div>
            <p class="text-[0.8rem] font-bold leading-snug text-navy-950 sm:text-sm">
              {{ item.title }}
            </p>
            <p class="mt-0.5 hidden text-sm leading-snug text-muted sm:block">
              {{ item.text }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- BEST SELLERS -->
    <section
      id="best-sellers"
      class="py-16 sm:py-20"
    >
      <UContainer>
        <SectionHeading
          eyebrow="Best sellers"
          title="The most researched peptides in the US"
          description="Ranked by US search demand. Prices and stock update live from our store."
        />
        <div class="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          <PeptideCard
            v-for="p in featured"
            :key="p.slug"
            :peptide="p"
          />
        </div>

        <div class="mt-14">
          <h3 class="text-center text-lg font-bold text-navy-950 sm:text-xl">
            More from the catalog
          </h3>
          <div class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            <PeptideCard
              v-for="p in more"
              :key="p.slug"
              :peptide="p"
              placement="product_more"
            />
            <div class="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-brand-900 to-brand-600 p-4 text-white sm:p-8">
              <UIcon
                name="i-lucide-layout-grid"
                class="size-7 text-brand-200 sm:size-8"
              />
              <p class="mt-3 text-lg font-extrabold leading-tight sm:mt-4 sm:text-xl">
                Browse all {{ STORE_CATALOG_SIZE }} peptides
              </p>
              <p class="mt-2 text-xs leading-relaxed text-brand-100 sm:text-sm">
                Including NAD+, KPV, <span class="whitespace-nowrap">SS-31</span>, <span class="whitespace-nowrap">PT-141</span>, Kisspeptin and bacteriostatic water.
              </p>
              <UButton
                :to="shop.catalog({ placement: 'catalog_all' })"
                rel="noopener"
                color="neutral"
                variant="solid"
                size="md"
                block
                trailing-icon="i-lucide-arrow-up-right"
                class="mt-5 min-h-11 justify-center rounded-xl bg-white text-brand-700 hover:bg-brand-50 sm:mt-6"
              >
                View all
              </UButton>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- HOW IT WORKS -->
    <section
      id="how-it-works"
      class="bg-navy-50/70 py-16 sm:py-20"
    >
      <UContainer>
        <SectionHeading
          eyebrow="How it works"
          title="From research to your lab in three steps"
          :description="`RPLT USA helps you choose. ${STORE.name}, our official store, handles checkout and shipping.`"
        />
        <ol class="mt-12 grid gap-5 md:grid-cols-3">
          <li
            v-for="(step, i) in steps"
            :key="step.title"
            class="relative rounded-2xl border border-navy-100 bg-white p-6 sm:p-7"
          >
            <span class="absolute right-5 top-5 text-5xl font-extrabold text-brand-50">{{ i + 1 }}</span>
            <span class="relative grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <UIcon
                :name="step.icon"
                class="size-6"
              />
            </span>
            <h3 class="relative mt-5 text-lg font-bold text-navy-950">
              {{ step.title }}
            </h3>
            <p class="relative mt-2 text-sm leading-relaxed text-muted">
              {{ step.text }}
            </p>
          </li>
        </ol>
        <div class="mt-10 text-center">
          <UButton
            :to="shop.catalog({ placement: 'how_it_works' })"
            rel="noopener"
            size="xl"
            trailing-icon="i-lucide-arrow-up-right"
            class="rounded-xl px-8"
          >
            Start shopping
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- QUALITY -->
    <section
      id="quality"
      class="py-16 sm:py-20"
    >
      <UContainer class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="grid grid-cols-2 gap-3 sm:gap-4">
          <NuxtImg
            src="/images/peptides/tesamorelin.webp"
            alt="Research peptide vial on a sunlit surface"
            width="400"
            height="400"
            densities="x1"
            loading="lazy"
            class="aspect-square w-full rounded-2xl object-cover"
          />
          <NuxtImg
            src="/images/peptides/epithalon.webp"
            alt="Research peptide vial next to laboratory glassware"
            width="400"
            height="400"
            densities="x1"
            loading="lazy"
            class="mt-8 aspect-square w-full rounded-2xl object-cover"
          />
        </div>
        <div>
          <SectionHeading
            eyebrow="Quality standards"
            title="Lab tested, documented, ready for research"
            description="Every peptide we list meets the same standard, so the only decision you make is which compound fits your study."
            align="left"
          />
          <ul class="mt-8 space-y-5">
            <li
              v-for="q in quality"
              :key="q.title"
              class="flex gap-3.5"
            >
              <UIcon
                name="i-lucide-circle-check"
                class="mt-0.5 size-6 shrink-0 text-brand-600"
              />
              <div>
                <p class="font-bold text-navy-950">
                  {{ q.title }}
                </p>
                <p class="mt-0.5 text-sm leading-relaxed text-muted">
                  {{ q.text }}
                </p>
              </div>
            </li>
          </ul>
          <UButton
            :to="shop.catalog({ placement: 'quality' })"
            rel="noopener"
            size="lg"
            trailing-icon="i-lucide-arrow-up-right"
            class="mt-9 min-h-11 rounded-xl"
          >
            Shop lab tested peptides
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- FAQ -->
    <section
      id="faq"
      class="bg-navy-50/70 py-16 sm:py-20"
    >
      <UContainer class="max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
        />
        <UAccordion
          :items="faqs"
          type="multiple"
          :default-value="['0']"
          class="mt-10 rounded-2xl border border-navy-100 bg-white px-5 sm:px-6"
          :ui="{
            item: 'border-b border-navy-100 last:border-b-0',
            trigger: 'py-5 text-base font-bold text-navy-950',
            body: 'pb-5 text-[0.95rem] leading-relaxed text-navy-600',
          }"
        />
        <p class="mt-8 text-center text-sm text-muted">
          Still have a question?
          <a
            :href="shop.contact({ placement: 'faq' })"
            class="font-semibold text-brand-600 hover:underline"
          >Message the store team</a>
          or call
          <a
            :href="SUPPORT.phoneHref"
            class="font-semibold text-brand-600 hover:underline"
          >{{ SUPPORT.phone }}</a>.
        </p>
      </UContainer>
    </section>

    <!-- CTA BAND -->
    <section class="py-16 sm:py-20">
      <UContainer>
        <div class="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy-950 via-brand-900 to-brand-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div
            class="bg-molecule pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
          />
          <div class="relative">
            <h2 class="text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-4xl">
              Ready to order?
            </h2>
            <p class="mx-auto mt-3 max-w-xl text-base text-brand-100 sm:text-lg">
              Check out securely at {{ STORE.name }}. Free US shipping on orders over ${{ STORE.freeShippingThreshold }}.
            </p>
            <UButton
              :to="shop.catalog({ placement: 'cta_band' })"
              rel="noopener"
              size="xl"
              color="neutral"
              trailing-icon="i-lucide-arrow-up-right"
              class="mt-8 rounded-xl bg-white px-8 text-brand-700 hover:bg-brand-50"
            >
              Shop all peptides
            </UButton>
          </div>
        </div>
        <ResearchNotice class="mx-auto mt-8 max-w-3xl" />
      </UContainer>
    </section>

    <StickyShopBar />
  </div>
</template>
