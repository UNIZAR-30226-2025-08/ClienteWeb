<template>
    <div class="result-overlay fadeInOut">
      <h1 class="result-text">JUGADOR {{ winnerIndex }} ES EL ALGUACIL</h1>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      winnerIndex: {
        type: Number,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .result-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .result-text {
    color: #8B0000;
    font-size: 4rem;
    font-family: 'Times New Roman', serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    text-align: center;
  }
  
  .fadeInOut {
    animation: fadeInOut 6s forwards;
  }
  </style>