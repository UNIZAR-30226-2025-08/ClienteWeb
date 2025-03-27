<template>
    <button
      class="vote-button"
      :class="{ active: selectedPlayerIndex !== null }"
      :disabled="hasVoted"
      @click="$emit('vote')"
    >
      <template v-if="!hasVoted"> VOTAR </template>
      <template v-else>
        <img src="../assets/candado.png" alt="candado" class="candado-icon" />
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
    background-color: #262522;
    color: #fff;
    font-size: 1rem;
    padding: 12px 30px;
    border: 2px solid #fff;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: sans-serif;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
  }
  
  .vote-button:hover {
    background-color: #333;
  }
  
  .candado-icon {
    width: 20px;
    height: 20px;
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