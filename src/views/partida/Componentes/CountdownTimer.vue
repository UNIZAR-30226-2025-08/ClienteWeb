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
    /* 60px ≈ (60/1920)*100 ≈ 3.1vw, 150px ≈ (150/1080)*100 ≈ 13.9vh */
    left: 3.2vw;
    top: 14vh;
  }
  
  .countdown-circle {
    /* 100px ≈ (100/1920)*100 ≈ 5.2vw */
    width: 5.2vw;
    height: 5.2vw;
    background-color: #262522;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .countdown-text {
    color: #fff;
    /* 32px ≈ (32/1920)*100 ≈ 1.67vw */
    font-size: 1.7vw;
    font-weight: bold;
    font-family: sans-serif;
  }
  </style>
  