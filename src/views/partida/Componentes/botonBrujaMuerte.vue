<template>
    <button class="boton-bruja" @click="$emit('usar-pocima-muerte')">
      <img src="../../../assets/pocimaMuerte.png" alt="Poción de Muerte" class="icono" />
    </button>
  </template>
  
  <script>
  export default {
    name: "BotonBrujaMuerte"
  };
  </script>
  
  <style scoped>
  .boton-bruja {
    background-color: #262522;
    border: none;
    border-radius: 50%;
    width: 4rem;
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
    width: 60%;
    height: auto;
  }
  </style>
  
  