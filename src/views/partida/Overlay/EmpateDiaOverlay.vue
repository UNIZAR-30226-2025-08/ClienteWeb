<template>
  <div class="alguacil-overlay fadeInOut">
    <div class="overlay-inner">
      <h1 class="alguacil-text">¡Empate en la votación!</h1>
      <p class="alguacil-text">Se repiten las votaciones del día.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmpateDiaOverlay",
};
</script>

<style scoped>
.alguacil-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center; /*prittier*/
  z-index: 9999;
}

.alguacil-text {
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

.overlay-inner {
  text-align: center;
}
</style>
