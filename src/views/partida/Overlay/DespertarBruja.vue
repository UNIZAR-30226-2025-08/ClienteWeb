<template>
    <div class="empieza-overlay fadeInOut">
      <h1 class="empieza-text">{{ text }}</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: "DespertarBruja",
    props: {
      text: {
        type: String,
        default: "LA BRUJA SE DESPIERTA, OBSERVA LA NUEVA VÍCTIMA DE LOS HOMBRES LOBO. USARÁ SU POCIÓN CURATIVA O SU POCIÓN VENENOSA"
      }
    }
  };
  </script>
  
  <style scoped>
  .empieza-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .empieza-text {
    color: white;
    font-size: 4rem;
    font-family: 'Times New Roman', serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    letter-spacing: 2px;
  }
  
  .fadeInOut {
    animation: fadeInOut 6s forwards;
  }
  
  @keyframes fadeInOut {
    0% { opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; }
  }
  </style>
  