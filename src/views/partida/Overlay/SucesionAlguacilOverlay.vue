<template>
  <div class="alguacil-overlay fadeInOut">
    <h1 class="alguacil-text">{{ mensaje }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    mensaje: {
      type: String,
      default: "EL ALGUACIL HA SIDO ELIMINADO, AHORA ELIGIRÁ A SU SUCESOR",
    },
  },
};
</script>

<style scoped>
.alguacil-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /*prittier*/
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.alguacil-text {
  color: white;
  font-size: 2.5rem;
  text-align: center;
  max-width: 80%;
  line-height: 1.3;
  font-family: "MedievalSharp", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.fadeInOut {
  animation: fadeInOut 6s forwards;
}
</style>
