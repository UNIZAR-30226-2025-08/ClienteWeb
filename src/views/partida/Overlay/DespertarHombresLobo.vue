<template>
  <div
    class="empieza-overlay fadeInOut"
    :style="{ animationDuration: '4s' }"
    @animationend="onAnimationEnd"
  >
    <h1 class="empieza-text">
      LOS HOMBRES LOBO SE DESPIERTAN, SE RECONOCEN Y DESIGNAN UNA NUEVA VÍCTIMA
    </h1>
  </div>
</template>

<script>
import audioHombresLobo from "../../../assets/audios/3.0 HOMBRES LOBO.wav";

export default {
  name: "HombresLoboDespertar",
  data() {
    return {
      audio: null,
    };
  },
  mounted() {
    this.audio = new Audio(audioHombresLobo);
    this.audio.play();
  },
  methods: {
    onAnimationEnd() {
      this.audio.pause();
      this.audio.currentTime = 0; /*prittier*/
      this.$emit("finish");
    },
  },
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
  font-family: "MedievalSharp", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
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
