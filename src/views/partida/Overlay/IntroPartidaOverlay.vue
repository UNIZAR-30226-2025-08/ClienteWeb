<template>
  <div class="intro-overlay fadeInOut" @animationend="onAnimationEnd">
    <h1 class="overlay-text">{{ displayText }}</h1>
  </div>
</template>

<script>
import audioDia from "../../../assets/audios/5 DIA.wav";

export default {
  props: {
    text: {
      type: String,
      default: "AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS",
    },
    isFirstTime: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      audio: null,
    };
  },
  computed: {
    displayText() {
      if (this.isFirstTime) {
        return this.text;
      } else {
        return `${this.text}. Y a continuación se muestran las víctimas de la última noche.`;
      }
    },
  },
  mounted() {
    if (!this.isFirstTime) {
      this.audio = new Audio(audioDia);
      this.audio.play();
    }
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
.intro-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.overlay-text {
  color: white;
  font-size: 3rem;
  text-align: center; /*prittier*/
  max-width: 80%;
  line-height: 1.2;
  font-family: "MedievalSharp", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.fadeInOut {
  animation: fadeInOut 6s forwards;
}
</style>
