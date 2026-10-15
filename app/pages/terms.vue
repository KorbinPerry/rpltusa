<script setup lang="ts">
import { STORE, SUPPORT } from '#shared/site'

const shop = useShop()

usePageSeo({
  title: 'Terms of Use and Research Disclaimer',
  description: 'Terms of use for RPLT USA and the research use only disclaimer that applies to every product in the catalog.',
})
</script>

<template>
  <LegalPage
    title="Terms of Use and Research Disclaimer"
    updated="October 14, 2026"
  >
    <section>
      <h2>About this website</h2>
      <p>
        RPLT USA (rpltusa.com) is an informational catalog of research peptides. RPLT USA does not sell products, take payments or create accounts. All orders are placed with, processed by and fulfilled by {{ STORE.name }}, and are governed by the terms, shipping policy and return policy published on the store.
      </p>
    </section>

    <section>
      <h2>Research use only</h2>
      <p>
        Every product referenced on this website is intended solely for in vitro research and laboratory use by qualified professionals. These products are not drugs, foods, cosmetics, dietary supplements or medical devices. They are not intended to be ingested, injected, inhaled or applied to humans or animals in any way, and they are not intended to diagnose, treat, cure or prevent any disease.
      </p>
      <p>
        No statement on this website has been evaluated by the Food and Drug Administration. Product descriptions summarize published research for educational purposes and do not constitute medical advice or claims about efficacy or safety for any use.
      </p>
    </section>

    <section>
      <h2>Qualified purchasers</h2>
      <p>By continuing to the store and placing an order you confirm that you:</p>
      <ul>
        <li>are at least 18 years of age;</li>
        <li>are a researcher or otherwise qualified professional purchasing for lawful research purposes only;</li>
        <li>will handle, store and dispose of products in accordance with applicable laws and laboratory practice; and</li>
        <li>accept full responsibility for compliance with all local, state and federal laws that apply to you.</li>
      </ul>
    </section>

    <section>
      <h2>Pricing and availability</h2>
      <p>
        Prices, vial sizes and stock shown on RPLT USA are read from the store and refreshed regularly, but the price and availability shown at checkout on {{ STORE.name }} are final.
      </p>
    </section>

    <section>
      <h2>Links to the store</h2>
      <p>
        Links from RPLT USA to {{ STORE.name }} include referral parameters so the store can recognize visits that started on RPLT USA. See the <NuxtLink to="/privacy">privacy policy</NuxtLink> for details.
      </p>
    </section>

    <section>
      <h2>Limitation of liability</h2>
      <p>
        Content on this website is provided as is, without warranties of any kind. RPLT USA is not liable for any damages arising from the use or misuse of information on this website or of any product purchased from the store.
      </p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>
        Questions about these terms or an order: call <a :href="SUPPORT.phoneHref">{{ SUPPORT.phone }}</a>, email <a :href="`mailto:${SUPPORT.email}`">{{ SUPPORT.email }}</a> or use the <a :href="shop.contact({ placement: 'footer' })">store contact form</a>.
      </p>
    </section>
  </LegalPage>
</template>
