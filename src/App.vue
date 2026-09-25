<template>
  <!-- Shell principal de la app — transición fade sin mode para evitar
       dependencia en transitionend/animationend. Las vistas se superponen
       brevemente durante la transición (0.2s), efecto fade limpio. -->
  <div class="min-h-screen" style="background: var(--gradient-hero)">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" :key="$route.fullPath" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
// App.vue intencionalmente minimalista — toda la lógica vive en vistas y store
</script>
