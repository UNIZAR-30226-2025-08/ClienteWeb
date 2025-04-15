<template>
    <div class="botones-container">
      <button class="boton-bruja" @click="$emit('usar-pocima-vida')">
        <img src="../../../assets/pocimaVida.png" alt="Poción de Vida" class="icono" />
      </button>
      <button class="boton-bruja" @click="$emit('usar-pocima-muerte')">
        <img src="../../../assets/pocimaMuerte.png" alt="Poción de Muerte" class="icono" />
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: "BotonesBruja"
  };
  </script>
  
  <style scoped>
  .botones-container {
    display: flex;
    gap: 1rem;           /* Separación entre botones */
    justify-content: center;
    align-items: center;
  }
  
  .boton-bruja {
    background-color: #262522;
    border: none;
    border-radius: 50%;
    width: 4rem;         /* Puedes ajustar: en una base de 1920px, 4rem ≈ 64px */
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
    width: 60%;          /* La imagen ocupará el 60% del botón */
    height: auto;
  }
  </style>
