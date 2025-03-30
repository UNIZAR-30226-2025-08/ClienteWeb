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
    bottom: 1.25rem;         /*20px;*/
    left: 1.25rem;         /*20px;*/
    background-color: #262522;
    color: #fff;
    padding: 1.25rem;         /*20px;*/;
    border-radius: 0.625rem;         /*10px;*/
    width: 26.25rem;         /*420px;*/
    height: 18.75rem;         /*300px;*/
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;         /*10px;*/
  }
  
  .top-row {
    display: flex;
    align-items: center;
    gap: 0.9375rem;
  }
  
  .role-info-image {
    width: 3.75rem;
    height: 3.75rem;
    object-fit: cover;
    border-radius: 0.3125rem;
  }
  
  .role-info-title {
    margin: 0;
    font-size: 2rem;
    color: #fff;
    font-family: serif;
    text-align: left;
  }
  
  .role-description {
    margin: 0;
    font-size: 1rem;
    line-height: 1.4;
    color: #eee;
    font-family: sans-serif;
    text-align: justify;
  }
  </style>