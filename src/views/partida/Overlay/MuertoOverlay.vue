<template>
  <div class="death-overlay">
    <div class="death-dialog">
      <h2>Has muerto</h2>
      <p>Ahora sólo puedes ver la partida.</p>
      <div class="buttons">
        <button @click="$emit('continue')">Seguir viendo</button>
        <button @click="$emit('exit')">Salir al menú</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MuertoOverlay",
};
</script>

<style scoped>
.death-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0; /*prittier*/
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}
.death-dialog {
  background: #000000;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  max-width: 90%;
}
.death-dialog h2 {
  margin-bottom: 1rem;
}
.death-dialog .buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.death-dialog button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}
</style>
