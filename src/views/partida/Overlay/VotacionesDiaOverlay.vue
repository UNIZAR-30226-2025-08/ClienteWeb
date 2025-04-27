<template>
  <div class="votaciones-dia-overlay fadeInOut" @animationend="onAnimationEnd">
    <h1 class="votaciones-text">{{ text }}</h1>
  </div>
</template>

<script>
import audioVotaciones from "../../../assets/audios/6 VOTACIONES.wav";

export default {
  props: {
    text: {
      type: String,
      default:
        "LOS JUGADORES DEBEN ELIMINAR, DE FORMA CONSENSUADA, A UN JUGADOR SOSPECHOSO DE SER HOMBRE LOBO. COMIENZAN LAS VOTACIONES",
    },
  },
  data() {
    return {
      audio: null,
    };
  },
  mounted() {
    this.audio = new Audio(audioVotaciones);
    this.audio.play();
  },
  methods: {
    onAnimationEnd() {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
      }
      this.$emit("finish");
    },
  },
};
</script>

<style scoped>
.votaciones-dia-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.votaciones-text {
  color: white;
  font-size: 2.5rem;
  text-align: center;
  max-width: 80%;
  line-height: 1.3;
  font-family: "Times New Roman", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.fadeInOut {
  animation: fadeInOut 6s forwards;
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
