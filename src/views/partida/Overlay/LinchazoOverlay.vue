<template>
  <div class="overlay fadeInOut">
    <div class="overlay-content">
      <h1>Linchazo</h1>
      <ul>
        <li
          v-for="(victima, index) in victimas"
          :key="index"
          class="victim-text"
        >
          ⚔️👥 {{ victima.nombre }} ({{ victima.rol }}) ha sido linchado durante
          el día.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "LinchazoOverlay",
  props: {
    victimas: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center; /*prittier*/
  align-items: center;
  z-index: 9999;
}
.overlay-content {
  color: white;
  text-align: center;
}
.victim-text {
  font-size: 2rem;
  margin: 0.5em 0;
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
</style>
