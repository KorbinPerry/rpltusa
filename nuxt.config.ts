// https://nuxt.com/docs/api/configuration/nuxt-config
import { PEPTIDES } from './shared/catalog'

const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://rpltusa.com'
const SHOP_URL = process.env.NUXT_PUBLIC_SHOP_URL || 'https://prolongevitypeptide.com'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/image', '@nuxtjs/seo'],

  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#1f4ff5' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: SITE_URL,
    name: 'RPLT USA',
    description: 'Lab tested research peptides including BPC-157, Tirzepatide, Semaglutide and GHK-Cu. 99%+ purity, COA with every vial, free US shipping over $150.',
    defaultLocale: 'en',
    trailingSlash: false,
  },

  ui: {
    // Fonts are self hosted through @fontsource (see main.css) so builds never depend on a font CDN.
    fonts: false,
    // The brand is a light theme, matching the store it refers to.
    colorMode: false,
    // Only ship theme CSS and JS for the components the site uses.
    experimental: {
      componentDetection: true,
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
      shopUrl: SHOP_URL,
      // Set to "true" after enabling Web Analytics in the Vercel dashboard.
      vercelAnalytics: process.env.NUXT_PUBLIC_VERCEL_ANALYTICS === 'true',
    },
  },

  routeRules: {
    // Live prices and stock from the store, cached at the edge.
    '/api/catalog': { isr: 1800, headers: { 'cache-control': 'public, max-age=300, s-maxage=1800, stale-while-revalidate=86400' } },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=2592000, stale-while-revalidate=86400' } },
    '/**': {
      headers: {
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'x-frame-options': 'SAMEORIGIN',
        'permissions-policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
    },
  },

  experimental: {
    defaults: {
      nuxtLink: {
        // Keep the Referer header on store links so the store can see the traffic came from RPLT USA.
        externalRelAttribute: 'noopener',
      },
    },
  },

  compatibilityDate: '2026-10-01',

  nitro: {
    // Vercel compresses at the edge; precompress for any other Node host.
    compressPublicAssets: !process.env.VERCEL,
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml', '/robots.txt'],
      // Image optimizer URLs are served by the platform (Vercel) or IPX, never prerendered.
      ignore: ['/_vercel', '/_ipx'],
      failOnError: true,
    },
  },

  // llms.txt is a static file in /public; the runtime markdown routes are not needed on Vercel.
  aiReady: false,

  eslint: {
    config: {
      stylistic: true,
    },
  },

  image: {
    format: ['webp'],
    quality: 80,
    // `card` (400) matches the native size of the product photos.
    screens: { xs: 320, card: 400, hero: 560, sm: 640, md: 768, lg: 1024, heroRetina: 1120, xl: 1280, xxl: 1536 },
  },

  linkChecker: {
    // Internal links are validated in CI by the e2e suite; skip remote checks during Vercel builds.
    enabled: false,
  },

  ogImage: {
    // Static, hand built social cards live in /public/og.
    enabled: false,
  },

  robots: {
    groups: [{ userAgent: '*', allow: '/' }],
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'RPLT USA',
      url: SITE_URL,
      logo: `${SITE_URL}/images/brand/rplt-usa-logo.png`,
    },
  },

  sitemap: {
    exclude: ['/__nuxt-seo__/**'],
    // Image entries point at the original files rather than optimizer URLs.
    discoverImages: false,
    urls: [
      {
        loc: '/',
        images: [
          { loc: '/images/hero-vials.webp', title: 'RPLT USA research peptides' },
          ...PEPTIDES.map(p => ({ loc: p.image, title: `${p.name} research peptide` })),
        ],
      },
    ],
  },

  skewProtection: false,
})
