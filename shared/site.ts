/** Store and support details. Support is handled by the store that fulfills orders. */
export const STORE = {
  name: 'ProLongevity Peptides',
  freeShippingThreshold: 150,
} as const

export const SUPPORT = {
  phone: '(786) 432-3315',
  phoneHref: 'tel:+17864323315',
  email: 'info@prolongevitypeptides.com',
  hours: 'Monday to Friday, 9am to 6pm ET',
} as const

export const NAV_LINKS = [
  { label: 'Best Sellers', to: '/#best-sellers' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Quality', to: '/#quality' },
  { label: 'FAQ', to: '/#faq' },
] as const
