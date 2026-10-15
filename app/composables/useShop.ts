import { buildShopUrl, STORE_PATHS, type ShopLinkOptions } from '#shared/referral'
import type { Peptide } from '#shared/catalog'

/** Store link builders. Every outbound link to the store must come from here. */
export function useShop() {
  const { shopUrl } = useRuntimeConfig().public

  const link = (path: string, opts: ShopLinkOptions) => buildShopUrl(shopUrl, path, opts)

  return {
    shopUrl,
    home: (opts: ShopLinkOptions) => link(STORE_PATHS.home, opts),
    catalog: (opts: ShopLinkOptions) => link(STORE_PATHS.catalog, opts),
    contact: (opts: ShopLinkOptions) => link(STORE_PATHS.contact, opts),
    /** Product page on the store, or the full catalog if the product is no longer listed */
    product: (peptide: Pick<Peptide, 'slug' | 'storeId'>, opts: Omit<ShopLinkOptions, 'product'>, listed = true) =>
      listed
        ? link(STORE_PATHS.product(peptide.storeId), { ...opts, product: peptide.slug })
        : link(STORE_PATHS.catalog, { ...opts, product: peptide.slug }),
  }
}
