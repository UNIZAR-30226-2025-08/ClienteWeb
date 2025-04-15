<template>
    <button
      class="action-button turn-button"
      :class="{ active: hasPassed }"
      :disabled="hasPassed"
      @click="$emit('pass')"
    >
      <template v-if="!hasPassed"> PASAR TURNO </template>
      <template v-else>
        <img src="../../../assets/candado.png" alt="candado" class="candado-icon" />
        YA HAS PASADO
      </template>
    </button>
  </template>
  
  <script>
  export default {
    name: "TurnButton",
    props: {
      hasPassed: {
        type: Boolean,
        default: false
      }
    },
    emits: ['pass']
  };
  </script>
  
  <style scoped>
  .turn-button {
    background-color: #262522;
    color: #fff;
    /* 1rem ~ 16px -> 0.83vw */
    font-size: 0.9vw;
    /* 0.75rem ≈ 12px → 0.63vw, 1.875rem ≈ 30px → 1.56vw */
    padding: 0.65vw 1.6vw;
    /* 0.125rem ≈ 2px → 0.1vw */
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
  
  .turn-button:hover {
    background-color: #333;
  }
  
  .candado-icon {
    /* 1.25rem ≈ 20px → 1vw */
    width: 1vw;
    height: 1vw;
  }
  
  .turn-button.active {
    border-color: #33ff00;
    color: #33ff00;
  }
  
  .turn-button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
  </style>  
  