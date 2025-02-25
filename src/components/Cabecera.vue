<template>
    <header class="cabecera">
      <div class="contenido">
        <h1>{{ titulo }}</h1>
      </div>
    </header>
  </template>
  
  <script setup>
  const props = defineProps({
    titulo: {
      type: String,
      default: 'Mi Aplicación'  // Título por defecto
    }
  });
  </script>
  
  <style scoped>
  .cabecera {
    width: 100%;
    background-color: #262522; /* Fondo oscuro */
    color: #fff;
    padding: 1rem;
    box-sizing: border-box;
  }
  .contenido {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }
  </style>
  