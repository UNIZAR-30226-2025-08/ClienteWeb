<template>
  <!-- Usamos una transición sencilla para la entrada/salida del overlay -->
  <transition name="fade">
    <!-- Mostramos el overlay sólo si la prop `visible` es true -->
    <div class="overlay-container" v-if="visible">
      <div class="overlay-text">
        <h1>SE HACE DE NOCHE</h1>
        <p>LA ALDEA DUERME, LOS JUGADORES CIERRAN LOS OJOS</p>
      </div>
    </div>
  </transition>
</template>

<script>
import nocheAudioSrc from "../../../assets/audios/0 NOCHE.wav";
export default {
  name: "NocheOverlay",
  props: {
    // Controla si el overlay está visible o no
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      audio: new Audio(nocheAudioSrc),
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.audio.play();
      } else {
        this.audio.pause();
        this.audio.currentTime = 0;
      }
    },
  },
  mounted() {
    if (this.visible) {
      this.audio.play();
    }
  },
};
</script>

<style scoped>
/* Contenedor principal del overlay */
.overlay-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Fondo oscuro para simular la noche */
  background: rgba(0, 0, 0, 0.8);
  /* Si tienes una imagen de noche, podrías hacer algo así: 
       background: url('@/assets/fondoNoche.jpeg') center/cover no-repeat; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Asegúrate de que se muestre por encima de otros elementos */
}

/* Estilos del texto */
.overlay-text {
  text-align: center;
  color: #fff;
  font-family: "MedievalSharp", serif; /* Ejemplo de fuente, puedes cambiarla */
}

.overlay-text h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.overlay-text p {
  font-size: 1.5rem;
}

/* Animaciones de entrada/salida con transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
