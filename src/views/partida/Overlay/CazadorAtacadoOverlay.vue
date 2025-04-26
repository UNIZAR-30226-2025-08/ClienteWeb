<template>
  <div class="cazador-atacado-overlay">
    <div class="dialog">
      <h2>Cuidado</h2>
      <p>El Cazador está a punto de disparar. ¡Prepárate!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CazadorAtacadoOverlay",
};
</script>

<style scoped>
.cazador-atacado-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}
.dialog {
  background: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  max-width: 80%;
}
</style>
