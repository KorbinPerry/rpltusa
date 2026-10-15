<script setup lang="ts">
import { NAV_LINKS } from '#shared/site'

const shop = useShop()
const route = useRoute()

const open = ref(false)
const panel = ref<HTMLElement | null>(null)
const toggleButton = ref<HTMLButtonElement | null>(null)

function close(returnFocus = false) {
  if (!open.value)
    return
  open.value = false
  if (returnFocus)
    toggleButton.value?.focus()
}

async function toggle() {
  open.value = !open.value
  if (open.value) {
    await nextTick()
    panel.value?.querySelector<HTMLElement>('a')?.focus()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape')
    close(true)
}

watch(() => route.fullPath, () => close())

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-navy-100 bg-white/90 backdrop-blur">
    <UContainer class="flex h-(--ui-header-height) items-center justify-between gap-4">
      <NuxtLink
        to="/"
        class="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
        @click="close()"
      >
        <AppLogo />
      </NuxtLink>

      <nav
        aria-label="Main"
        class="hidden lg:block"
      >
        <ul class="flex items-center gap-1">
          <li
            v-for="link in NAV_LINKS"
            :key="link.to"
          >
            <NuxtLink
              :to="link.to"
              class="rounded-lg px-3 py-2 text-[0.94rem] font-semibold text-navy-700 transition-colors hover:text-brand-600"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <UButton
          :to="shop.catalog({ placement: 'header' })"
          rel="noopener"
          size="lg"
          trailing-icon="i-lucide-arrow-up-right"
          class="hidden rounded-xl sm:inline-flex"
        >
          Shop Peptides
        </UButton>
        <button
          ref="toggleButton"
          type="button"
          class="-me-2 grid size-11 place-items-center rounded-xl text-navy-900 hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-brand-500 lg:hidden"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          @click="toggle"
        >
          <UIcon
            :name="open ? 'i-lucide-x' : 'i-lucide-menu'"
            class="size-6"
          />
        </button>
      </div>
    </UContainer>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav
        v-show="open"
        id="mobile-menu"
        ref="panel"
        aria-label="Mobile"
        class="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--ui-header-height))] overflow-y-auto border-b border-navy-100 bg-white shadow-[0_20px_40px_-20px_rgb(19_30_82/0.35)] lg:hidden"
      >
        <UContainer class="py-4">
          <ul class="divide-y divide-navy-100">
            <li
              v-for="link in NAV_LINKS"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="flex items-center justify-between py-3.5 text-base font-semibold text-navy-900"
                @click="close()"
              >
                {{ link.label }}
                <UIcon
                  name="i-lucide-chevron-right"
                  class="size-5 text-navy-300"
                />
              </NuxtLink>
            </li>
          </ul>
          <UButton
            :to="shop.catalog({ placement: 'mobile_menu' })"
            rel="noopener"
            size="xl"
            block
            trailing-icon="i-lucide-arrow-up-right"
            class="mt-4 rounded-xl"
          >
            Shop all peptides
          </UButton>
          <p class="mt-3 pb-1 text-center text-sm text-muted">
            Secure checkout at ProLongevity Peptides, our official store.
          </p>
        </UContainer>
      </nav>
    </Transition>
  </header>

  <div
    v-if="open"
    class="fixed inset-0 z-40 bg-navy-950/30 lg:hidden"
    aria-hidden="true"
    @click="close()"
  />
</template>
