<template>
    <button
      class="action-button discover-button"
      :class="{ active: hasDiscovered }"
      :disabled="hasDiscovered"
      @click="$emit('discover')"
    >
      <template v-if="!hasDiscovered"> DESCUBRIR ROL </template>
      <template v-else>
        <img src="../../../assets/candado.png" alt="candado" class="candado-icon" />
        ROL DESCUBIERTO
      </template>
    </button>
  </template>
  
  <script>
  export default {
    name: "DiscoverRoleButton",
    props: {
      hasDiscovered: {
        type: Boolean,
        default: false
      }
    },
    emits: ['discover']
  };
  </script>
  
  <style scoped>
  .discover-button {
    background-color: #262522;
    color: #fff;
    /* 16px ≈ 0.83vw */
    font-size: 0.9vw;
    /* 0.3rem ≈ 5px y 6rem ≈ 96px; convertimos: 5px ≈ 0.3vw, 96px ≈ 5vw */
    padding: 0.3vw 5vw;
    /* 0.125rem ≈ 2px; 2px ≈ 0.1vw */
    border: 0.1vw solid #fff;
    border-radius: 0.5vw;
    cursor: pointer;
    transition: all 0.2s;
    font-family: sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5vw;
    width: 15%;
    text-align: center;
  }
  
  .discover-button:hover {
    background-color: #333;
  }
  
  .candado-icon {
    /* 1.25rem ≈ 20px → 20/1920*100 ≈ 1vw */
    width: 1vw;
    height: 1vw;
  }
  
  .discover-button.active {
    border-color: #33ff00;
    color: #33ff00;
  }
  
  .discover-button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
  </style>
  
  