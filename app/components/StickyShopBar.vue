<script setup lang="ts">
import type { Placement } from '#shared/referral'

const props = withDefaults(defineProps<{
  href?: string
  label?: string
  note?: string
}>(), {
  href: undefined,
  label: 'Shop research peptides',
  note: 'Free US shipping over $150',
})

const shop = useShop()
const placement: Placement = 'sticky_mobile'
const target = computed(() => props.href || shop.catalog({ placement }))

const visible = ref(false)
let onScroll: (() => void) | undefined

onMounted(() => {
  onScroll = () => {
    visible.value = window.scrollY > 520
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  if (onScroll)
    window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div
    class="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white/95 px-4 pt-3 shadow-[0_-10px_30px_-12px_rgb(19_30_82/0.25)] backdrop-blur transition-transform duration-300 md:hidden"
    :class="visible ? 'translate-y-0' : 'pointer-events-none translate-y-full'"
    :aria-hidden="!visible"
    style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom))"
    data-testid="sticky-shop-bar"
  >
    <div class="flex items-center gap-3">
      <p class="min-w-0 flex-1 text-xs font-semibold leading-tight text-navy-600">
        {{ note }}
      </p>
      <UButton
        :to="target"
        rel="noopener"
        size="lg"
        trailing-icon="i-lucide-arrow-up-right"
        class="min-h-11 shrink-0 rounded-xl"
        :tabindex="visible ? 0 : -1"
      >
        {{ label }}
      </UButton>
    </div>
  </div>
</template>
