<template>
  <transition name="fade">
    <div class="overlay-container" v-if="visible">
      <img
        src="../../../assets/ojoCerrado.png"
        alt="Ojo Cerrado"
        class="ojo-cerrado"
      />
      <p>La vidente averiguará el rol de un jugador</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: "OjoCerradoOverlay",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.overlay-container {
  position: absolute;
  top: 0;
  left: 0; /*prittier*/
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.ojo-cerrado {
  max-width: 200px;
  margin-bottom: 20px;
}

p {
  color: #fff;
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
}

/* Transiciones de entrada/salida */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
