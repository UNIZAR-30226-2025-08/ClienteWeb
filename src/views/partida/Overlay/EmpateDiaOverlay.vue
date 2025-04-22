<template>
  <div class="overlay fadeInOut">
    <div class="overlay-content">
      <h1>¡Empate en la votación!</h1>
      <p>Se repiten las votaciones del día.</p>
    </div>
  </div>
</template>
<script>
export default { name: "EmpateDiaOverlay" };
</script>
<style scoped>
.overlay {
  /* igual que otros overlays */
}
.fadeInOut {
  animation: fadeInOut 5s forwards;
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
.overlay-content {
  color: white;
  text-align: center;
}
</style>
