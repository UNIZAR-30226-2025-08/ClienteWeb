<template>
    <button
      class="vote-button"
      :class="{ active: selectedPlayerIndex !== null }"
      :disabled="hasVoted"
      @click="$emit('vote')"
    >
      <template v-if="!hasVoted"> VOTAR </template>
      <template v-else>
        <img src="../../../assets/candado.png" alt="candado" class="candado-icon" />
        YA HAS VOTADO
      </template>
    </button>
  </template>
  
  <script>
  export default {
    props: {
      hasVoted: {
        type: Boolean,
        default: false
      },
      selectedPlayerIndex: {
        type: Number,
        default: null
      }
    },
    emits: ['vote']
  }
  </script>
  
  <style scoped>
  .vote-button {
    position: absolute; 
    top: 35rem;          
    right: 96.875rem;        
    z-index: 9999;      /* valor alto para que quede por encima */
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

  
  .vote-button:hover {
    background-color: #333;
  }
  
  .candado-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .vote-button.active {
    border-color: #33ff00;
    color: #33ff00;
  }
  
  .vote-button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
  </style>