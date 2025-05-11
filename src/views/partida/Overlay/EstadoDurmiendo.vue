<template>
  <!-- Se remueve la clase fadeInOut para que no se aplique la animación -->
  <div class="empieza-overlay">
    <h1 class="empieza-text">{{ text }}</h1>
  </div>
</template>

<script>
export default {
  name: "EstadoDurmiendo",
  props: {
    text: {
      type: String,
      default: "Estas Durmiendo",
    },
  },
};
</script>

<style scoped>
.empieza-overlay {
  position: fixed;
  top: 0;
  left: 0; /*prittier*/
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Puedes mantener estos estilos para el texto */
.empieza-text {
  color: white;
  font-size: 4rem;
  font-family: "MedievalSharp", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
}
</style>
