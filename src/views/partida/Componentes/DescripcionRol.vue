<template>
    <div class="role-info-panel">
      <div class="top-row">
        <img :src="role.src" alt="Rol" class="role-info-image" />
        <h3 class="role-info-title">HABILIDAD</h3>
      </div>
      <p class="role-description">{{ role.descripcion }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      role: {
        type: Object,
        required: true,
        default: () => ({
          src: '',
          nombre: '',
          descripcion: ''
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .role-info-panel {
    position: absolute;
    /* 20px en vertical: 20/1080≈1.85vh, 20px en horizontal: 20/1920≈1.04vw */
    bottom: 2vh;
    left: 1vw;
    background-color: #262522;
    color: #fff;
    /* Usamos 1vw de padding (aprox. 20px) */
    padding: 1vw;
    border-radius: 0.5vw; /* 10px aproximados */
    /* 420px ≈ 420/1920*100 ≈ 22vw, 300px ≈ 300/1080*100 ≈ 27.8vh */
    width: 22vw;
    height: 28vh;
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5vw;
  }
  
  .top-row {
    display: flex;
    align-items: center;
    gap: 0.8vw;
  }
  
  .role-info-image {
    width: 3vw;      /* 60px ≈ 3.1vw */
    height: 3vw;
    object-fit: cover;
    border-radius: 0.3vw; /* Aproximadamente 5px-6px */
  }
  
  .role-info-title {
    margin: 0;
    font-size: 1.7vw;  /* 32px ≈ 1.67vw */
    color: #fff;
    font-family: serif;
    text-align: left;
  }
  
  .role-description {
    margin: 0;
    font-size: 0.9vw;  /* 16px ≈ 0.83vw, redondeamos a 0.9vw */
    line-height: 1.4;
    color: #eee;
    font-family: sans-serif;
    text-align: justify;
  }
  </style>
  