<template>
  <!-- Logo SVG de Mastercard — se detecta cuando el número empieza en 51-55 o 2221-2720 -->
  <svg viewBox="0 0 152 108" xmlns="http://www.w3.org/2000/svg" v-bind="$attrs">
    <rect width="152" height="108" rx="8" fill="#252525"/>
    <circle cx="60" cy="54" r="34" fill="#EB001B"/>
    <circle cx="92" cy="54" r="34" fill="#F79E1B"/>
    <path d="M76 27.3C83.5 33.1 88.5 41.9 88.5 54C88.5 66.1 83.5 74.9 76 80.7C68.5 74.9 63.5 66.1 63.5 54C63.5 41.9 68.5 33.1 76 27.3Z" fill="#FF5F00"/>
  </svg>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>
