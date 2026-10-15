<script setup lang="ts">
import { SUPPORT } from '#shared/site'
</script>

<template>
  <div class="bg-navy-950 text-navy-100">
    <UContainer class="flex h-10 items-center justify-center gap-6 text-xs sm:justify-between sm:text-[0.8rem]">
      <p class="flex items-center gap-2 font-medium">
        <UIcon
          name="i-lucide-truck"
          class="size-4 shrink-0 text-brand-300"
        />
        <span>Free US shipping on orders over $150</span>
        <span class="hidden text-navy-400 md:inline">|</span>
        <span class="hidden md:inline">Ships to all 50 states</span>
      </p>
      <div class="hidden items-center gap-5 sm:flex">
        <a
          :href="SUPPORT.phoneHref"
          class="flex items-center gap-1.5 hover:text-white"
        >
          <UIcon
            name="i-lucide-phone"
            class="size-3.5"
          />
          {{ SUPPORT.phone }}
        </a>
        <span class="flex items-center gap-1.5 text-navy-300">
          <UIcon
            name="i-lucide-flask-conical"
            class="size-3.5"
          />
          For research use only
        </span>
      </div>
    </UContainer>
  </div>
</template>
