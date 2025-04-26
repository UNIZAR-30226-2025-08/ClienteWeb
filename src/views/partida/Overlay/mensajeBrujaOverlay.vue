<template>
  <div class="result-overlay fadeInOut">
    <img
      src="../../../assets/peligro_lobo.png"
      alt="Peligro Lobo"
      class="peligro-img"
    />
    <h1 class="result-text">
      {{ victimName }} ha sido atacado por los lobos
    </h1>
  </div>
</template>

<script>
export default {
  name: "AtaqueLobosOverlay",
  props: {
    victimName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.result-text {
  color: #8b0000;
  font-size: 4rem;
  font-family: "Times New Roman", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.fadeInOut {
  animation: fadeInOut 6s forwards;
}

.peligro-img {
  width: 10vw;
  margin-bottom: 2vh;
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0;
  }
  10%,
  90% {
    opacity: 1;
  }
}
</style>
