<template>
  <!-- Usamos una transición sencilla para la entrada/salida del overlay -->
  <transition name="fade">
    <div class="overlay-container" v-if="visible">
      <div class="overlay-text">
        <h1>LA VIDENTE SE DESPIERTA</h1>
        <p>
          SEÑALA A UN JUGADOR DEL QUE QUIERE CONOCER LA VERDADERA PERSONALIDAD
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "VidenteOverlay",
  props: {
    // Controla si el overlay está visible o no
    visible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.overlay-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Asegúrate de que se muestre por encima de otros elementos */
}

.overlay-text {
  text-align: center;
  color: #fff;
  font-family: "MedievalSharp", serif; /* Puedes cambiarla por la que uses */
}

.overlay-text h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.overlay-text p {
  font-size: 1.5rem;
}

/* Transiciones de entrada/salida */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
