<template>
  <div class="empieza-overlay fadeInOut" @animationend="onAnimationEnd">
    <h1 class="empieza-text">{{ text }}</h1>
  </div>
</template>

<script>
import audioBruja from "../../../assets/audios/4.0 BRUJA.wav";

export default {
  name: "DespertarBruja",
  props: {
    text: {
      type: String,
      default:
        "LA BRUJA SE DESPIERTA, OBSERVA LA NUEVA VÍCTIMA DE LOS HOMBRES LOBO. ¿USARÁ SU POCIÓN CURATIVA O SU POCIÓN VENENOSA?",
    },
  },
  data() {
    return {
      audio: null,
    };
  },
  mounted() {
    this.audio = new Audio(audioBruja);
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
  z-index: 9999; /*prittier*/
}

.empieza-text {
  color: white;
  font-size: 4rem;
  font-family: "Times New Roman", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
  text-align: center;
  padding: 0 20px;
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
