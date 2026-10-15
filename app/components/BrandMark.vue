<script setup lang="ts">
withDefaults(defineProps<{ size?: number, inverted?: boolean }>(), { size: 36, inverted: false })
const id = useId()
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient
        :id="`${id}-g`"
        x1="6"
        y1="3"
        x2="34"
        y2="37"
        gradientUnits="userSpaceOnUse"
      >
        <stop :stop-color="inverted ? '#ffffff' : '#3a63ff'" />
        <stop
          offset="1"
          :stop-color="inverted ? '#dbe5ff' : '#1a34b0'"
        />
      </linearGradient>
    </defs>
    <polygon
      points="20,3 34.72,11.5 34.72,28.5 20,37 5.28,28.5 5.28,11.5"
      :fill="`url(#${id}-g)`"
      :stroke="`url(#${id}-g)`"
      stroke-width="4"
      stroke-linejoin="round"
    />
    <path
      d="M11.5 24.5 L16.5 14.5 L23 25.5 L28.5 15.5"
      :stroke="inverted ? '#1f4ff5' : '#ffffff'"
      stroke-width="2.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle
      cx="11.5"
      cy="24.5"
      r="2.8"
      :fill="inverted ? '#1f4ff5' : '#ffffff'"
    />
    <circle
      cx="16.5"
      cy="14.5"
      r="2.8"
      :fill="inverted ? '#1f4ff5' : '#ffffff'"
    />
    <circle
      cx="23"
      cy="25.5"
      r="2.8"
      :fill="inverted ? '#1f4ff5' : '#ffffff'"
    />
    <circle
      cx="28.5"
      cy="15.5"
      r="3.2"
      fill="#e23744"
      :stroke="inverted ? '#1f4ff5' : '#ffffff'"
      stroke-width="1.6"
    />
  </svg>
</template>
