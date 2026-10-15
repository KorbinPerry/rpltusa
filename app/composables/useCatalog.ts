import { PEPTIDES, snapshotCatalog, type CatalogItem, type CatalogResponse, type Peptide } from '#shared/catalog'

export type LivePeptide = Peptide & Pick<CatalogItem, 'price' | 'size' | 'backordered' | 'listed'>

/**
 * Catalog with live store pricing. Values are resolved on the server during
 * prerender, then refreshed once in the browser so prices never go stale between deploys.
 */
export function useCatalog() {
  const state = useState<CatalogResponse>('rplt-catalog', () => snapshotCatalog())

  const peptides = computed<LivePeptide[]>(() => {
    const live = new Map(state.value.items.map(item => [item.slug, item]))
    return PEPTIDES.map((p) => {
      const item = live.get(p.slug)
      return item ? { ...p, price: item.price, size: item.size, backordered: item.backordered, listed: item.listed } : p
    })
  })

  const bySlug = (slug: string) => peptides.value.find(p => p.slug === slug)

  return { state, peptides, bySlug }
}

/** Load once on the server; called from app.vue. */
export async function loadCatalog() {
  const state = useState<CatalogResponse>('rplt-catalog', () => snapshotCatalog())
  await callOnce('rplt-catalog', async () => {
    try {
      state.value = await $fetch<CatalogResponse>('/api/catalog')
    }
    catch {
      state.value = snapshotCatalog()
    }
  })
  return state
}

/** Refresh in the browser after hydration. Silent on failure. */
export function refreshCatalogInBrowser() {
  const state = useState<CatalogResponse>('rplt-catalog', () => snapshotCatalog())
  $fetch<CatalogResponse>('/api/catalog')
    .then((res) => {
      if (res && Array.isArray(res.items) && res.items.length && res.source === 'live')
        state.value = res
    })
    .catch(() => {})
}
