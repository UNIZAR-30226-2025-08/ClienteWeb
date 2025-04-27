<template>
  <div class="cazador-overlay">
    <div class="cazador-dialog">
      <h2>¡Eres el Cazador!</h2>
      <p>Selecciona un jugador para disparar:</p>
      <ul class="target-list">
        <li v-for="player in players" :key="player.id">
          <button
            class="target-button"
            :disabled="selectedId === player.id"
            @click="select(player.id)"
          >
            {{ player.nombre }}
          </button>
        </li>
      </ul>
      <div class="actions" v-if="hasFired">
        <p>Has disparado a {{ firedName }}.</p>
        <button @click="$emit('continue')">Seguir viendo</button>
        <button @click="$emit('exit')">Salir al menú</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CazadorOverlay",
  props: {
    players: Array,
  },
  data() {
    return {
      selectedId: null,
      hasFired: false,
    };
  },
  computed: {
    firedName() {
      const p = this.players.find((p) => p.id === this.selectedId);
      return p ? p.nombre : "";
    },
  },
  methods: {
    select(id) {
      if (this.hasFired) return;
      this.selectedId = id;
      this.hasFired = true;
      this.$emit("fire", id);
    },
  },
};
</script>

<style scoped>
.cazador-overlay {
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
.cazador-dialog {
  background: #000000;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  max-width: 90%;
}
.target-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}
.target-button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}
.actions {
  margin-top: 1.5rem;
}
.actions button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}
</style>
