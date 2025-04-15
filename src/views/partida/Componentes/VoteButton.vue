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
    /* 35rem ≈ 560px → 560/1080 × 100 ≈ 52vh */
    top: 52vh;  
    /* 96.875rem ≈ 1550px → 1550/1920 × 100 ≈ 81vw */
    right: 81vw;        
    z-index: 9999;      /* Valor alto para que quede por encima */
    background-color: #262522;
    color: #fff;
    /* Aproximadamente 16px */
    font-size: 0.9vw;  
    /* 0.75rem ≈ 12px (vertical) y 1.875rem ≈ 30px (horizontal) */
    padding: 1.2vh 1.6vw;
    /* 0.125rem ≈ 2px */
    border: 0.1vw solid #fff;
    /* 0.5rem ≈ 8px */
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
  
  .vote-button:hover {
    background-color: #333;
  }
  
  .candado-icon {
    /* Aproximadamente 20px */
    width: 1vw;
    height: 1vw;
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