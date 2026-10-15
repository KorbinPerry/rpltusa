<script setup lang="ts">
defineProps<{ title: string, updated: string }>()
</script>

<template>
  <div>
    <section class="border-b border-navy-100 bg-gradient-to-b from-white to-brand-50/60">
      <UContainer class="max-w-3xl py-12 sm:py-14">
        <h1 class="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          {{ title }}
        </h1>
        <p class="mt-3 text-sm text-muted">
          Last updated {{ updated }}
        </p>
      </UContainer>
    </section>
    <UContainer class="max-w-3xl py-12 sm:py-14">
      <div class="legal space-y-8 text-[0.97rem] leading-relaxed text-navy-700">
        <slot />
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.legal :deep(h2) {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-navy-950);
  margin-bottom: 0.6rem;
}

.legal :deep(p + p) {
  margin-top: 0.75rem;
}

.legal :deep(ul) {
  list-style: disc;
  padding-left: 1.25rem;
  margin-top: 0.6rem;
}

.legal :deep(li + li) {
  margin-top: 0.35rem;
}

.legal :deep(a) {
  color: var(--color-brand-600);
  font-weight: 600;
}

.legal :deep(a:hover) {
  text-decoration: underline;
}
</style>
