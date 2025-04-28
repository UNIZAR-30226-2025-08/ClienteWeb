<template>
  <div class="overlay fadeInOut">
    <h1 class="overlay-text">{{ text }}</h1>
  </div>
</template>

<script>
export default {
  name: "PocionMuerteUsadaOverlay",
  props: {
    text: {
      type: String,
      default: "La bruja ha usado su poción de muerte.",
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0; /*prittier*/
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.overlay-text {
  color: white;
  font-size: 4rem;
  font-family: "Times New Roman", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
}

.fadeInOut {
  animation: fadeInOut 3s forwards;
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
