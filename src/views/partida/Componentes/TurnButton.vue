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
    font-size: 1rem;
    padding: 0.75rem 1.875rem;
    border: 0.125rem solid #fff;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 15%;
    text-align: center;
  }
  
  .turn-button:hover {
    background-color: #333;
  }
  
  .candado-icon {
    width: 1.25rem;
    height: 1.25rem;
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
  