<script setup lang="ts">
withDefaults(defineProps<{ inverted?: boolean, size?: 'md' | 'lg' }>(), { inverted: false, size: 'md' })
</script>

<template>
  <span class="inline-flex items-center gap-2.5 select-none">
    <BrandMark
      :size="size === 'lg' ? 42 : 36"
      :inverted="inverted"
    />
    <span class="flex flex-col leading-none">
      <span
        class="font-extrabold tracking-tight"
        :class="[size === 'lg' ? 'text-[1.6rem]' : 'text-[1.35rem]', inverted ? 'text-white' : 'text-navy-950']"
      >
        RPLT<span :class="inverted ? 'text-brand-300' : 'text-brand-600'"> USA</span>
      </span>
      <span
        class="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em]"
        :class="inverted ? 'text-navy-300' : 'text-navy-500'"
      >
        Research Peptides
      </span>
    </span>
  </span>
</template>
