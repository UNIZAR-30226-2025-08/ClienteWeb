<template>
  <div class="cazador-overlay">
    <div class="cazador-dialog">
      <h2>¡Alguacil Has Muerto!</h2>

      <p v-if="!hasVoted">Selecciona un jugador para que te suceda:</p>

      <!-- Muestra la lista de jugadores solo si no has elegido sucesor -->
      <ul class="target-list" v-if="!hasVoted">
        <li v-for="player in players" :key="player.id">
          <button
            class="target-button"
            :disabled="player.id === myId"
            @click="confirmSucessor(player.id)"
          >
            {{ player.nombre }}
          </button>
        </li>
      </ul>

      <!-- Popup de confirmación -->
      <div v-if="showConfirm" class="confirmation-popup">
        <p>
          ¿Dejas la responsabilidad de ser Alguacil a {{ selectedPlayerName }}?
        </p>
        <button @click="firePlayer">Confirmar</button>
        <button @click="cancelFire">Cancelar</button>
      </div>

      <!-- Muestra el mensaje después de disparar -->
      <div class="actions" v-if="hasVoted">
        <p>Tu sucesor será {{ sucessorName }}.</p>
        <button @click="$emit('continue')">Seguir viendo</button>
        <button @click="$emit('exit')">Salir al menú</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AlguacilEligeSucesor",
  props: {
    players: Array,
    myId: Number, // Recibe el ID del jugador actual
  },
  data() {
    return {
      selectedId: null,
      hasVoted: false,
      sucessorName: "", // Guardará el nombre el nuevo alguacil
      showConfirm: false, // Controla la visibilidad del popup de confirmación
      selectedPlayerName: "", // Nombre del jugador seleccionado para disparar
    };
  },
  methods: {
    // Muestra el popup de confirmación antes de disparar
    confirmSucessor(id) {
      if (this.hasVoted || id === this.myId) return; // No permite dispararse a sí mismo ni disparar si ya se disparó
      this.selectedId = id;
      this.selectedPlayerName = this.players.find(
        (player) => player.id === id
      ).nombre;
      this.showConfirm = true; // Muestra el popup
    },

    // Confirma que el cazador disparará
    firePlayer() {
      this.hasVoted = true;
      this.sucessorName = this.selectedPlayerName; // Guarda el nombre de la víctima
      this.showConfirm = false; // Cierra el popup
      this.$emit("fire", this.selectedId); // Emite el evento para notificar que se disparó
    },

    // Cancela la acción de disparar
    cancelFire() {
      this.showConfirm = false; // Cierra el popup sin hacer nada
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
  background-color: #4caf50;
  color: white;
  transition: background-color 0.3s ease;
}
.target-button:disabled {
  background-color: #9e9e9e; /* Cambia el color cuando el botón está deshabilitado */
  cursor: not-allowed;
}

.confirmation-popup {
  background: rgba(0, 0, 0, 0.85);
  padding: 1rem;
  border-radius: 10px;
  color: white;
  text-align: center;
}
.confirmation-popup button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  background-color: #ff5722;
  color: white;
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
  background-color: #ff5722;
  color: white;
}
</style>
