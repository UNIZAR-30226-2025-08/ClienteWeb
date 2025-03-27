<template>
    <div class="intro-overlay fadeInOut">
      <h1 class="overlay-text">{{ text }}</h1>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      text: {
        type: String,
        default: "AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS"
      }
    }
  }
  </script>
  
  <style scoped>
  .intro-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .overlay-text {
    color: white;
    font-size: 3rem;
    text-align: center;
    max-width: 80%;
    line-height: 1.2;
    font-family: 'Times New Roman', serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  @keyframes fadeInOut {
    0% { opacity: 0; }
    25% { opacity: 1; }
    75% { opacity: 1; }
    100% { opacity: 0; }
  }
  
  .fadeInOut {
    animation: fadeInOut 6s forwards;
  }
  </style>