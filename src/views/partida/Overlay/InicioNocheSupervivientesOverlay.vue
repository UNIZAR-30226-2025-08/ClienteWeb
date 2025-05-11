<template>
  <div class="noche-overlay fadeInOut" @animationend="onAnimationEnd">
    <h1 class="noche-text">{{ text }}</h1>
  </div>
</template>

<script>
import audioNoche from "../../../assets/audios/7. Noche. Volver a 2.wav";

export default {
  props: {
    text: {
      type: String,
      default: "SE HACE DE NOCHE. LOS SUPERVIVIENTES SE VUELVEN A DORMIR.",
    },
  },
  data() {
    return {
      audio: null,
    };
  },
  mounted() {
    this.audio = new Audio(audioNoche);
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
.noche-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /*prittier*/
}

.noche-text {
  color: white;
  font-size: 3rem;
  text-align: center;
  max-width: 80%;
  line-height: 1.3;
  font-family: "MedievalSharp", serif;
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
