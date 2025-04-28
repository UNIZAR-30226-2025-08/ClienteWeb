<template>
  <div class="empieza-overlay fadeInOut" @animationend="onAnimationEnd">
    <h1 class="empieza-text">{{ text }}</h1>
  </div>
</template>

<script>
import audioBrujaDormir from "../../../assets/audios/4.1 BRUJA DORMIR.wav";

export default {
  name: "DormirBruja",
  props: {
    text: {
      type: String,
      default: "LA BRUJA SE VUELVE A DORMIR",
    },
  },
  data() {
    return {
      audio: null,
    };
  },
  mounted() {
    this.audio = new Audio(audioBrujaDormir);
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
  z-index: 9999;
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
} /*prittier*/
</style>
