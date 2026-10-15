/**
 * Peptides featured on the RPLT USA landing page.
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

export interface Peptide {
  /** Stable key, also sent to the store as utm_term */
  slug: string
  /** Product id on the store, used for product.html?id= */
  storeId: string
  name: string
  category: CategoryKey
  demandRank: number
  /** Shown in the main best sellers grid; the rest appear under "More from the catalog" */
  featured: boolean
  image: string
  imageAlt: string
  /** One line description used on cards */
  tagline: string
  /** Snapshot values, refreshed from the store */
  price: number
  size: string
  backordered: boolean
  listed: boolean
}

export const CATEGORIES: Record<CategoryKey, Category> = {
  'metabolic': { key: 'metabolic', label: 'Metabolic', icon: 'i-lucide-flame' },
  'recovery': { key: 'recovery', label: 'Recovery', icon: 'i-lucide-activity' },
  'growth-hormone': { key: 'growth-hormone', label: 'Growth Hormone', icon: 'i-lucide-trending-up' },
  'longevity': { key: 'longevity', label: 'Longevity', icon: 'i-lucide-hourglass' },
  'skin': { key: 'skin', label: 'Skin and Anti-Aging', icon: 'i-lucide-sparkles' },
}

const peptide = (p: Omit<Peptide, 'backordered' | 'listed' | 'image' | 'imageAlt'> & { imageAlt?: string }): Peptide => ({
  ...p,
  image: `/images/peptides/${p.slug}.webp`,
  imageAlt: p.imageAlt ?? `${p.name} research peptide vial`,
  backordered: false,
  listed: true,
})

export const PEPTIDES: Peptide[] = [
  peptide({ slug: 'tirzepatide', storeId: 'tirzepatide', name: 'Tirzepatide', category: 'metabolic', demandRank: 1, featured: true, tagline: 'Dual GIP and GLP-1 receptor agonist', price: 215, size: '5mg' }),
  peptide({ slug: 'semaglutide', storeId: 'semaglutide', name: 'Semaglutide', category: 'metabolic', demandRank: 2, featured: true, tagline: 'Long acting GLP-1 receptor agonist', price: 195, size: '5mg' }),
  peptide({ slug: 'bpc-157', storeId: 'bpc-157', name: 'BPC-157', category: 'recovery', demandRank: 3, featured: true, tagline: 'The most studied recovery peptide', price: 90, size: '10mg' }),
  peptide({ slug: 'ghk-cu', storeId: 'ghk-cu', name: 'GHK-Cu', category: 'skin', demandRank: 4, featured: true, tagline: 'Copper peptide for skin and collagen research', price: 90, size: '100mg', imageAlt: 'GHK-Cu copper peptide research vial' }),
  peptide({ slug: 'tesamorelin', storeId: 'tesamorelin', name: 'Tesamorelin', category: 'growth-hormone', demandRank: 5, featured: true, tagline: 'GHRH analog for body composition research', price: 95, size: '2mg' }),
  peptide({ slug: 'tb-500', storeId: 'tb-500', name: 'TB-500', category: 'recovery', demandRank: 6, featured: true, tagline: 'Thymosin Beta-4 fragment for repair research', price: 90, size: '10mg' }),
  peptide({ slug: 'cjc-1295-ipamorelin', storeId: 'cjc-1295', name: 'CJC-1295 / Ipamorelin', category: 'growth-hormone', demandRank: 7, featured: true, tagline: 'GHRH analog paired with a GH secretagogue', price: 130, size: '10mg', imageAlt: 'CJC-1295 with DAC and Ipamorelin research peptide vial' }),
  peptide({ slug: 'mots-c', storeId: 'mots-c', name: 'MOTS-c', category: 'longevity', demandRank: 8, featured: true, tagline: 'Mitochondrial derived metabolic peptide', price: 140, size: '40mg' }),
  peptide({ slug: 'aod-9604', storeId: 'aod-9604', name: 'AOD-9604', category: 'metabolic', demandRank: 9, featured: false, tagline: 'HGH fragment for fat metabolism research', price: 130, size: '10mg' }),
  peptide({ slug: 'ipamorelin', storeId: 'ipamorelin', name: 'Ipamorelin', category: 'growth-hormone', demandRank: 10, featured: false, tagline: 'Selective growth hormone secretagogue', price: 70, size: '10mg' }),
  peptide({ slug: 'epithalon', storeId: 'epithalon', name: 'Epithalon', category: 'longevity', demandRank: 11, featured: false, tagline: 'Tetrapeptide studied in longevity research', price: 70, size: '10mg' }),
]

export const STORE_CATALOG_SIZE = 22

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
