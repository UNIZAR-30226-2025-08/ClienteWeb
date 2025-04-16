<template>
    <button class="boton-bruja" @click="$emit('usar-pocima-vida')">
      <img src="../../../assets/pocimaVida.png" alt="Poción de Vida" class="icono" />
    </button>
  </template>
  
  <script>
  export default {
    name: "BotonBrujaVida"
  };
  </script>
  
  <style scoped>
  .boton-bruja {
    background-color: #262522;
    border: none;
    border-radius: 50%;
    width: 4rem;       /* Aproximadamente 64px en una base de 1920px */
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .boton-bruja:hover {
    transform: scale(1.05);
  }
  
  .icono {
    width: 60%;        /* La imagen ocupará el 60% del botón */
    height: auto;
  }
  </style>
  