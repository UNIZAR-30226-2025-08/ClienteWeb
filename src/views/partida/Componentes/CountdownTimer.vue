<template>
    <div class="countdown-container">
      <div class="countdown-circle">
        <span class="countdown-text">{{ timeLeft }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      timeLeft: {
        type: Number,
        required: true,
        default: 60
      }
    }
  }
  </script>
  
  <style scoped>
  .countdown-container {
    position: absolute;
    left: 60px;
    top: 150px;
  }
  
  .countdown-circle {
    width: 100px;
    height: 100px;
    background-color: #262522;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .countdown-text {
    color: #fff;
    font-size: 2rem;
    font-weight: bold;
    font-family: sans-serif;
  }
  </style>