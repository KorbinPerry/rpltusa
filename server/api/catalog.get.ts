import { PEPTIDES, snapshotCatalog, type CatalogItem, type CatalogResponse } from '#shared/catalog'

interface StoreProduct {
  id: string
  price?: number | null
  size?: string | null
  backordered?: boolean | null
}

/**
 * Live price, size and stock for the RPLT USA lineup, read from the store API.
 * Falls back to the bundled snapshot if the store is unreachable, so pages never break.
 */
export default defineCachedEventHandler(async (): Promise<CatalogResponse> => {
  const { shopUrl } = useRuntimeConfig().public
  try {
    const res = await $fetch<{ products?: StoreProduct[] }>('/api/products', {
      baseURL: shopUrl,
      timeout: 6000,
      retry: 1,
      headers: {
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (compatible; RPLTUSA-CatalogSync/1.0; +https://rpltusa.com)',
      },
    })
    const products = Array.isArray(res?.products) ? res.products : []
    if (products.length === 0)
      return snapshotCatalog()

    const byId = new Map(products.map(p => [p.id, p]))
    const items: CatalogItem[] = PEPTIDES.map((peptide) => {
      const live = byId.get(peptide.storeId)
      if (!live)
        return { slug: peptide.slug, price: peptide.price, size: peptide.size, backordered: false, listed: false }
      const price = typeof live.price === 'number' && live.price > 0 ? live.price : peptide.price
      const size = typeof live.size === 'string' && live.size.trim() ? live.size.trim().toLowerCase() : peptide.size
      return { slug: peptide.slug, price, size, backordered: Boolean(live.backordered), listed: true }
    })
    return { source: 'live', updatedAt: new Date().toISOString(), items }
  }
  catch (error) {
    console.warn('[catalog] store API unavailable, serving snapshot:', (error as Error)?.message)
    return snapshotCatalog()
  }
}, {
  name: 'rplt-catalog',
  getKey: () => 'v1',
  maxAge: 60 * 30,
  swr: true,
})
