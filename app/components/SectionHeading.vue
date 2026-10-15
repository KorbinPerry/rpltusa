<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
  as?: 'h1' | 'h2'
}>(), {
  eyebrow: undefined,
  description: undefined,
  align: 'center',
  as: 'h2',
})
</script>

<template>
  <div
    class="max-w-2xl"
    :class="align === 'center' ? 'mx-auto text-center' : ''"
  >
    <p
      v-if="eyebrow"
      class="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 sm:text-[0.8rem]"
    >
      {{ eyebrow }}
    </p>
    <component
      :is="as"
      class="mt-2.5 text-[1.8rem] font-extrabold leading-tight tracking-tight text-navy-950 sm:text-4xl"
    >
      {{ title }}
    </component>
    <p
      v-if="description"
      class="mt-3.5 text-base leading-relaxed text-muted sm:text-lg"
    >
      {{ description }}
    </p>
  </div>
</template>
