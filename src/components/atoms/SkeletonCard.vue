<template>
  <!-- Skeleton loader para las tarjetas de producto mientras carga la API -->
  <div class="glass-card overflow-hidden animate-fade-in">
    <!-- Imagen placeholder -->
    <div class="skeleton h-48 w-full rounded-t-2xl rounded-b-none" />
    <div class="p-4 space-y-3">
      <!-- Nombre del producto -->
      <div class="skeleton h-5 w-3/4 rounded-lg" />
      <!-- Descripción -->
      <div class="skeleton h-3.5 w-full rounded-lg" />
      <div class="skeleton h-3.5 w-2/3 rounded-lg" />
      <!-- Precio y badge -->
      <div class="flex items-center justify-between pt-1">
        <div class="skeleton h-6 w-28 rounded-lg" />
        <div class="skeleton h-5 w-20 rounded-full" />
      </div>
      <!-- Botón -->
      <div class="skeleton h-10 w-full rounded-xl mt-2" />
    </div>
  </div>
</template>
