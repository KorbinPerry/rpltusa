import type { MaybeRefOrGetter } from 'vue'

interface PageSeo {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  /** Social title; defaults to the page title with the brand appended */
  socialTitle?: MaybeRefOrGetter<string>
  /** Path to a 1200x630 JPG in /public/og */
  image?: MaybeRefOrGetter<string>
  imageAlt?: MaybeRefOrGetter<string>
}

/** Title, description and a complete, consistent set of social tags for a page. */
export function usePageSeo(seo: PageSeo) {
  const { siteUrl } = useRuntimeConfig().public
  const absolute = (path: string) => new URL(path, siteUrl).toString()
  const socialTitle = () => toValue(seo.socialTitle) || `${toValue(seo.title)} | RPLT USA`
  const image = () => ({
    url: absolute(toValue(seo.image) || '/og/default.jpg'),
    width: 1200,
    height: 630,
    type: 'image/jpeg' as const,
    alt: toValue(seo.imageAlt) || 'RPLT USA lab tested research peptides',
  })

  useSeoMeta({
    title: () => toValue(seo.title),
    description: () => toValue(seo.description),
    ogTitle: socialTitle,
    ogDescription: () => toValue(seo.description),
    ogImage: image,
    twitterTitle: socialTitle,
    twitterDescription: () => toValue(seo.description),
    twitterImage: () => image().url,
    twitterImageAlt: () => image().alt,
  })
}
