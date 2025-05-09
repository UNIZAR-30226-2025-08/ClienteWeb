<!-- Archivo: ./Overlay/MuertesDuranteNocheOverlay.vue -->
<template>
  <div class="overlay fadeInOut">
    <div class="overlay-content">
      <h1>Resumen de la Noche</h1>
      <ul>
        <li
          v-for="(victima, index) in victimas"
          :key="index"
          class="victim-text"
        >
          🗡️🩸 {{ victima }} ha muerto durante la noche.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "MuertesDuranteNocheOverlay",
  props: {
    victimas: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /*prittier*/
}
.overlay-content {
  color: white;
  text-align: center;
}
/* Aumentamos el tamaño de las líneas de víctima */
.victim-text {
  font-size: 2rem; /* Ajusta a tu gusto */
  margin: 0.5em 0;
}
.fadeInOut {
  animation: fadeInOut 5s forwards;
}
@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
