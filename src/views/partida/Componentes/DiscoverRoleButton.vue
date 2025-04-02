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
  
  .discover-button:hover {
    background-color: #333;
  }
  
  .candado-icon {
    width: 1.25rem;
    height: 1.25rem;
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
  