<script setup lang="ts">
import { STORE, SUPPORT } from '#shared/site'

usePageSeo({
  title: 'Privacy Policy',
  description: 'How RPLT USA handles visitor data, referral parameters and analytics.',
})
</script>

<template>
  <LegalPage
    title="Privacy Policy"
    updated="October 14, 2026"
  >
    <section>
      <h2>Summary</h2>
      <p>
        RPLT USA does not have accounts, forms or checkout, and does not ask for your name, email, address or payment details. Purchases happen on {{ STORE.name }}, whose own privacy policy applies to any information you provide there.
      </p>
    </section>

    <section>
      <h2>Information stored in your browser</h2>
      <p>To credit visits that start on RPLT USA, this website stores two items in your browser's local storage:</p>
      <ul>
        <li><strong>rplt_vid</strong>: a random, anonymous visitor identifier. It contains no personal information.</li>
        <li><strong>rplt_attr</strong>: the campaign tags (such as utm_source) and ad click identifiers present in the link that brought you here, the page you landed on and the referring website, kept for up to 30 days.</li>
      </ul>
      <p>You can remove both at any time by clearing site data for rpltusa.com in your browser settings.</p>
    </section>

    <section>
      <h2>Information shared with the store</h2>
      <p>
        When you follow a link to {{ STORE.name }}, the link includes RPLT USA referral parameters (for example utm_source=rpltusa), the anonymous visitor identifier, the RPLT USA page you came from and the campaign tags described above. This lets the store measure which visits started on RPLT USA. No other data is shared.
      </p>
    </section>

    <section>
      <h2>Analytics and hosting</h2>
      <p>
        This website is hosted on Vercel. Vercel processes standard request data, such as IP address and browser type, to deliver and secure the website. When enabled, Vercel Web Analytics collects aggregated, cookie free page view statistics.
      </p>
    </section>

    <section>
      <h2>Children</h2>
      <p>This website is intended for adults 18 and older and is not directed to children.</p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>
        Privacy questions: email <a :href="`mailto:${SUPPORT.email}`">{{ SUPPORT.email }}</a> or call <a :href="SUPPORT.phoneHref">{{ SUPPORT.phone }}</a>.
      </p>
    </section>
  </LegalPage>
</template>
