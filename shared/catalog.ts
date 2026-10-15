/**
 * Curated RPLT USA catalog.
 *
 * The lineup is the overlap between the ProLongevity Peptides store catalog and the
 * highest demand peptides in the Q2 2026 US search market brief (brand volume plus
 * "buy" and "for sale" purchase intent). `demandRank` keeps that order.
 *
 * Price, size and stock below are a snapshot of the store API. At build time and
 * again in the browser, `/api/catalog` refreshes them from the live store.
 */

export type CategoryKey = 'metabolic' | 'recovery' | 'growth-hormone' | 'longevity' | 'skin'

export interface Category {
  key: CategoryKey
  label: string
  icon: string
}

export interface PeptideFaq {
  q: string
  a: string
}

export interface Peptide {
  /** RPLT USA URL slug */
  slug: string
  /** Product id on the store, used for product.html?id= */
  storeId: string
  name: string
  /** Optional longer formal name */
  fullName?: string
  category: CategoryKey
  demandRank: number
  featured: boolean
  image: string
  imageAlt: string
  /** One line hook used on cards */
  tagline: string
  /** Two to three sentence overview */
  summary: string
  /** What the compound is studied for, research framing only */
  researchAreas: string[]
  /** Short technical facts */
  facts: { label: string, value: string }[]
  faqs: PeptideFaq[]
  /** Snapshot values, refreshed from the store */
  price: number
  size: string
  backordered: boolean
  listed: boolean
  /** `{size}` is replaced with the live vial size */
  seo: {
    title: string
    description: string
  }
}

export const CATEGORIES: Record<CategoryKey, Category> = {
  'metabolic': { key: 'metabolic', label: 'Metabolic', icon: 'i-lucide-flame' },
  'recovery': { key: 'recovery', label: 'Recovery', icon: 'i-lucide-activity' },
  'growth-hormone': { key: 'growth-hormone', label: 'Growth Hormone', icon: 'i-lucide-trending-up' },
  'longevity': { key: 'longevity', label: 'Longevity', icon: 'i-lucide-hourglass' },
  'skin': { key: 'skin', label: 'Skin and Anti-Aging', icon: 'i-lucide-sparkles' },
}

/** Vial amount is rendered separately from the live catalog size */
const standardFacts = (form = 'Lyophilized powder') => [
  { label: 'Form', value: form },
  { label: 'Purity', value: '99% or higher' },
  { label: 'Documentation', value: 'Certificate of Analysis' },
  { label: 'Intended use', value: 'Laboratory research only' },
]

const storageFaq: PeptideFaq = {
  q: 'How should the vial be stored?',
  a: 'Keep lyophilized vials cold, dry and away from light. Refrigeration is standard for short term storage and freezing for long term storage. Once reconstituted with bacteriostatic water, keep the vial refrigerated.',
}

const useFaq = (name: string): PeptideFaq => ({
  q: `Is ${name} approved for human use?`,
  a: `No. ${name} is sold strictly for in vitro and laboratory research. It is not a drug, food or supplement, has not been evaluated by the FDA for this use, and is not for human or veterinary consumption.`,
})

const orderFaq = (name: string): PeptideFaq => ({
  q: `Where do I order ${name}?`,
  a: `Orders are placed and fulfilled through ProLongevity Peptides, the official store for the RPLT USA catalog. Tap any Shop button to check out securely. Orders over $150 ship free within the US.`,
})

export const PEPTIDES: Peptide[] = [
  {
    slug: 'tirzepatide',
    storeId: 'tirzepatide',
    name: 'Tirzepatide',
    category: 'metabolic',
    demandRank: 1,
    featured: true,
    image: '/images/peptides/tirzepatide.webp',
    imageAlt: 'Tirzepatide research peptide vial',
    tagline: 'Dual GIP and GLP-1 receptor agonist',
    summary: 'Tirzepatide is a dual GIP and GLP-1 receptor agonist and one of the most searched peptides in the United States. It is a leading subject of metabolic research into appetite signaling, insulin sensitivity and body weight regulation.',
    researchAreas: [
      'GIP and GLP-1 receptor signaling',
      'Glucose and insulin regulation models',
      'Energy balance and body composition studies',
    ],
    facts: standardFacts(),
    faqs: [
      { q: 'How is Tirzepatide different from Semaglutide?', a: 'Semaglutide activates the GLP-1 receptor only. Tirzepatide activates both the GIP and GLP-1 receptors, which is why researchers often study the two side by side.' },
      useFaq('Tirzepatide'),
      storageFaq,
      orderFaq('Tirzepatide'),
    ],
    price: 215,
    size: '5mg',
    backordered: false,
    listed: true,
    seo: {
      title: 'Buy Tirzepatide Research Peptide {size}',
      description: 'Buy Tirzepatide {size} research peptide with 99%+ purity and a Certificate of Analysis. Lab tested, research use only. Free US shipping on orders over $150.',
    },
  },
  {
    slug: 'semaglutide',
    storeId: 'semaglutide',
    name: 'Semaglutide',
    category: 'metabolic',
    demandRank: 2,
    featured: true,
    image: '/images/peptides/semaglutide.webp',
    imageAlt: 'Semaglutide research peptide vial',
    tagline: 'Long acting GLP-1 receptor agonist',
    summary: 'Semaglutide is a long acting GLP-1 receptor agonist and one of the most extensively studied peptides in metabolic research. Its extended half life makes it a reference compound for GLP-1 pathway studies.',
    researchAreas: [
      'GLP-1 receptor pharmacology',
      'Appetite and satiety signaling',
      'Glycemic control models',
    ],
    facts: standardFacts(),
    faqs: [
      { q: 'What makes Semaglutide a common reference compound?', a: 'It binds albumin, which extends its half life well beyond native GLP-1. That stability makes it a consistent benchmark in GLP-1 receptor research.' },
      useFaq('Semaglutide'),
      storageFaq,
      orderFaq('Semaglutide'),
    ],
    price: 195,
    size: '5mg',
    backordered: false,
    listed: true,
    seo: {
      title: 'Buy Semaglutide Research Peptide {size}',
      description: 'Buy Semaglutide {size} research peptide, 99%+ purity with a Certificate of Analysis. Lab tested GLP-1 research compound. Free US shipping over $150.',
    },
  },
  {
    slug: 'bpc-157',
    storeId: 'bpc-157',
    name: 'BPC-157',
    fullName: 'Body Protection Compound 157',
    category: 'recovery',
    demandRank: 3,
    featured: true,
    image: '/images/peptides/bpc-157.webp',
    imageAlt: 'BPC-157 research peptide vial',
    tagline: 'The most studied recovery peptide',
    summary: 'BPC-157 (Body Protection Compound 157) is a 15 amino acid peptide fragment derived from a protein found in gastric juice. Preclinical studies explore its role in tissue repair, tendon and ligament models and gut lining integrity.',
    researchAreas: [
      'Soft tissue, tendon and ligament repair models',
      'Gastrointestinal lining research',
      'Angiogenesis and blood flow signaling',
    ],
    facts: standardFacts(),
    faqs: [
      { q: 'Is BPC-157 often studied with TB-500?', a: 'Yes. BPC-157 and TB-500 are frequently researched together in recovery models because they are thought to act through different repair pathways. Both are available in the RPLT USA catalog.' },
      useFaq('BPC-157'),
      storageFaq,
      orderFaq('BPC-157'),
    ],
    price: 90,
    size: '10mg',
    backordered: false,
    listed: true,
    seo: {
      title: 'Buy BPC-157 Research Peptide {size}',
      description: 'Buy BPC-157 {size} research peptide for sale with 99%+ purity and a Certificate of Analysis. Lab tested and shipped across the US. Free shipping over $150.',
    },
  },
  {
    slug: 'ghk-cu',
    storeId: 'ghk-cu',
    name: 'GHK-Cu',
    fullName: 'Copper Tripeptide-1',
    category: 'skin',
    demandRank: 4,
    featured: true,
    image: '/images/peptides/ghk-cu.webp',
    imageAlt: 'GHK-Cu copper peptide research vial',
    tagline: 'Copper peptide for skin and collagen research',
    summary: 'GHK-Cu is a naturally occurring copper binding tripeptide (glycyl-L-histidyl-L-lysine). Research focuses on collagen synthesis, skin remodeling, wound models and hair follicle studies.',
    researchAreas: [
      'Collagen and elastin synthesis',
      'Skin remodeling and wound models',
      'Hair follicle research',
    ],
    facts: standardFacts(),
    faqs: [
      { q: 'Why is GHK-Cu called a copper peptide?', a: 'GHK has a strong affinity for copper ions and forms the GHK-Cu complex. The copper bound form is the one most often studied in skin and collagen research.' },
      useFaq('GHK-Cu'),
      storageFaq,
      orderFaq('GHK-Cu'),
    ],
    price: 90,
    size: '100mg',
    backordered: false,
    listed: true,
    seo: {
      title: 'Buy GHK-Cu Copper Peptide {size}',
      description: 'Buy GHK-Cu copper peptide {size} with 99%+ purity and a Certificate of Analysis. Lab tested for skin and collagen research. Free US shipping over $150.',
    },
  },
  {
    slug: 'tesamorelin',
    storeId: 'tesamorelin',
    name: 'Tesamorelin',
    category: 'growth-hormone',
    demandRank: 5,
    featured: true,
    image: '/images/peptides/tesamorelin.webp',
    imageAlt: 'Tesamorelin research peptide vial',
    tagline: 'GHRH analog for body composition research',
    summary: 'Tesamorelin is a synthetic analog of growth hormone releasing hormone (GHRH). Research examines how it stimulates pituitary growth hormone release and its effect on visceral fat in body composition studies.',
    researchAreas: [
      'Pituitary growth hormone release',
      'Visceral fat and body composition studies',
      'IGF-1 signaling',
    ],
    facts: standardFacts(),
    faqs: [
      { q: 'How does Tesamorelin work in research models?', a: 'Tesamorelin binds the GHRH receptor in the pituitary, prompting the natural, pulsatile release of growth hormone rather than supplying growth hormone directly.' },
      useFaq('Tesamorelin'),
      storageFaq,
      orderFaq('Tesamorelin'),
    ],
    price: 95,
    size: '2mg',
    backordered: false,
    listed: true,
    seo: {
      title: 'Buy Tesamorelin Research Peptide {size}',
      description: 'Buy Tesamorelin {size} research peptide, a GHRH analog with 99%+ purity and a Certificate of Analysis. Lab tested. Free US shipping on orders over $150.',
    },
  },
  {
    slug: 'tb-500',
    storeId: 'tb-500',
    name: 'TB-500',
    fullName: 'Thymosin Beta-4 fragment',
    category: 'recovery',
    demandRank: 6,
    featured: true,
    image: '/images/peptides/tb-500.webp',
    imageAlt: 'TB-500 research peptide vial',
    tagline: 'Thymosin Beta-4 fragment for repair research',
    summary: 'TB-500 is a synthetic version of the active region of Thymosin Beta-4, a protein involved in cell migration and actin regulation. It is studied in models of tissue repair, inflammation and muscle recovery.',
    researchAreas: [
      'Cell migration and actin regulation',
      'Muscle and connective tissue repair models',
      'Inflammation research',
    ],
    facts: standardFacts(),
    faqs: [
      { q: 'What is the difference between TB-500 and Thymosin Beta-4?', a: 'Thymosin Beta-4 is the full 43 amino acid protein. TB-500 is a shorter synthetic peptide based on its active region, which is the form most often used in research.' },
      useFaq('TB-500'),
      storageFaq,
      orderFaq('TB-500'),
    ],
    price: 90,
    size: '10mg',
    backordered: false,
    listed: true,
    seo: {
      title: 'Buy TB-500 Research Peptide {size}',
      description: 'Buy TB-500 {size} research peptide for sale with 99%+ purity and a Certificate of Analysis. Lab tested Thymosin Beta-4 fragment. Free US shipping over $150.',
    },
  },
  {
    slug: 'cjc-1295-ipamorelin',
    storeId: 'cjc-1295',
    name: 'CJC-1295 / Ipamorelin',
    fullName: 'CJC-1295 with DAC and Ipamorelin',
    category: 'growth-hormone',
    demandRank: 7,
    featured: true,
    image: '/images/peptides/cjc-1295-ipamorelin.webp',
    imageAlt: 'CJC-1295 with DAC and Ipamorelin research peptide vial',
    tagline: 'GHRH analog paired with a GH secretagogue',
    summary: 'This blend pairs CJC-1295 with DAC, a long acting GHRH analog, with Ipamorelin, a selective ghrelin receptor agonist. Researchers use the combination to study sustained and pulsatile growth hormone release together.',
    researchAreas: [
      'Sustained and pulsatile growth hormone release',
      'GHRH and ghrelin receptor interaction',
      'Body composition and recovery models',
    ],
    facts: standardFacts(),
    faqs: [
      { q: 'What does DAC mean in CJC-1295 with DAC?', a: 'DAC stands for Drug Affinity Complex. It lets CJC-1295 bind albumin in circulation, which greatly extends its half life compared with CJC-1295 without DAC.' },
      useFaq('CJC-1295 / Ipamorelin'),
      storageFaq,
      orderFaq('CJC-1295 / Ipamorelin'),
    ],
    price: 130,
    size: '10mg',
    backordered: false,
    listed: true,
    seo: {
      title: 'Buy CJC-1295 with DAC / Ipamorelin {size}',
      description: 'Buy CJC-1295 with DAC and Ipamorelin {size} research blend, 99%+ purity with a Certificate of Analysis. Lab tested. Free US shipping over $150.',
    },
  },
  {
    slug: 'mots-c',
    storeId: 'mots-c',
    name: 'MOTS-c',
    category: 'longevity',
    demandRank: 8,
    featured: true,
    image: '/images/peptides/mots-c.webp',
    imageAlt: 'MOTS-c mitochondrial peptide research vial',
    tagline: 'Mitochondrial derived metabolic peptide',
    summary: 'MOTS-c is a 16 amino acid peptide encoded in mitochondrial DNA. Research explores its role in metabolic regulation, insulin sensitivity and exercise capacity, particularly in aging models.',
    researchAreas: [
      'Mitochondrial signaling and metabolism',
      'Insulin sensitivity models',
      'Exercise capacity and aging research',
    ],
    facts: standardFacts(),
    faqs: [
      { q: 'Why is MOTS-c called a mitochondrial derived peptide?', a: 'Unlike most peptides, MOTS-c is encoded by the mitochondrial genome rather than nuclear DNA, which places it in a small class of mitochondrial derived peptides studied in longevity research.' },
      useFaq('MOTS-c'),
      storageFaq,
      orderFaq('MOTS-c'),
    ],
    price: 140,
    size: '40mg',
    backordered: false,
    listed: true,
    seo: {
      title: 'Buy MOTS-c Research Peptide {size}',
      description: 'Buy MOTS-c {size} mitochondrial research peptide with 99%+ purity and a Certificate of Analysis. Lab tested. Free US shipping on orders over $150.',
    },
  },
  {
    slug: 'aod-9604',
    storeId: 'aod-9604',
    name: 'AOD-9604',
    category: 'metabolic',
    demandRank: 9,
    featured: false,
    image: '/images/peptides/aod-9604.webp',
    imageAlt: 'AOD-9604 research peptide vial',
    tagline: 'HGH fragment for fat metabolism research',
    summary: 'AOD-9604 is a modified fragment of human growth hormone covering amino acids 177 to 191. It is studied for fat metabolism in research models without the broader growth effects of full length growth hormone.',
    researchAreas: [
      'Lipolysis and fat metabolism',
      'Growth hormone fragment pharmacology',
      'Cartilage research',
    ],
    facts: standardFacts(),
    faqs: [
      { q: 'How does AOD-9604 relate to growth hormone?', a: 'AOD-9604 is based on the C terminal end of human growth hormone, the region associated with fat metabolism, and is studied separately from the rest of the hormone.' },
      useFaq('AOD-9604'),
      storageFaq,
      orderFaq('AOD-9604'),
    ],
    price: 130,
    size: '10mg',
    backordered: false,
    listed: true,
    seo: {
      title: 'Buy AOD-9604 Research Peptide {size}',
      description: 'Buy AOD-9604 {size} research peptide with 99%+ purity and a Certificate of Analysis. Lab tested HGH fragment. Free US shipping on orders over $150.',
    },
  },
  {
    slug: 'ipamorelin',
    storeId: 'ipamorelin',
    name: 'Ipamorelin',
    category: 'growth-hormone',
    demandRank: 10,
    featured: false,
    image: '/images/peptides/ipamorelin.webp',
    imageAlt: 'Ipamorelin research peptide vial',
    tagline: 'Selective growth hormone secretagogue',
    summary: 'Ipamorelin is a pentapeptide growth hormone secretagogue that acts on the ghrelin receptor. Early studies noted its selectivity, releasing growth hormone with little effect on cortisol or prolactin.',
    researchAreas: [
      'Ghrelin receptor agonism',
      'Selective growth hormone release',
      'Lean mass and recovery models',
    ],
    facts: standardFacts(),
    faqs: [
      { q: 'Why is Ipamorelin described as selective?', a: 'In early research it stimulated growth hormone release without the notable rise in cortisol or prolactin seen with older secretagogues such as GHRP-6.' },
      useFaq('Ipamorelin'),
      storageFaq,
      orderFaq('Ipamorelin'),
    ],
    price: 70,
    size: '10mg',
    backordered: false,
    listed: true,
    seo: {
      title: 'Buy Ipamorelin Research Peptide {size}',
      description: 'Buy Ipamorelin {size} research peptide with 99%+ purity and a Certificate of Analysis. Lab tested growth hormone secretagogue. Free US shipping over $150.',
    },
  },
  {
    slug: 'epithalon',
    storeId: 'epithalon',
    name: 'Epithalon',
    fullName: 'Epitalon (Ala-Glu-Asp-Gly)',
    category: 'longevity',
    demandRank: 11,
    featured: false,
    image: '/images/peptides/epithalon.webp',
    imageAlt: 'Epithalon research peptide vial',
    tagline: 'Tetrapeptide studied in longevity research',
    summary: 'Epithalon, also spelled Epitalon, is a synthetic tetrapeptide (Ala-Glu-Asp-Gly). It is studied in longevity research for telomerase activity, telomere length and circadian rhythm regulation.',
    researchAreas: [
      'Telomerase activity and telomere length',
      'Circadian rhythm and melatonin regulation',
      'Cellular aging models',
    ],
    facts: standardFacts(),
    faqs: [
      { q: 'Is Epithalon the same as Epitalon?', a: 'Yes. Both names refer to the same synthetic tetrapeptide, Ala-Glu-Asp-Gly. The spelling varies between research papers and suppliers.' },
      useFaq('Epithalon'),
      storageFaq,
      orderFaq('Epithalon'),
    ],
    price: 70,
    size: '10mg',
    backordered: false,
    listed: true,
    seo: {
      title: 'Buy Epithalon (Epitalon) Peptide {size}',
      description: 'Buy Epithalon (Epitalon) {size} research peptide with 99%+ purity and a Certificate of Analysis. Lab tested for longevity research. Free US shipping over $150.',
    },
  },
]

export const STORE_CATALOG_SIZE = 22

export function getPeptide(slug: string): Peptide | undefined {
  return PEPTIDES.find(p => p.slug === slug)
}

export interface CatalogItem {
  slug: string
  price: number
  size: string
  backordered: boolean
  listed: boolean
}

export interface CatalogResponse {
  source: 'live' | 'snapshot'
  updatedAt: string
  items: CatalogItem[]
}

export function snapshotCatalog(): CatalogResponse {
  return {
    source: 'snapshot',
    updatedAt: '2026-10-14T00:00:00.000Z',
    items: PEPTIDES.map(({ slug, price, size, backordered, listed }) => ({ slug, price, size, backordered, listed })),
  }
}
