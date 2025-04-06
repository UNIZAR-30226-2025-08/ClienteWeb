<template>
  <div class="players-circle">
    <div
      v-for="(player, index) in players"
      :key="player.id"
      class="player-icon"
      :class="{ selected: selectedPlayerIndex === player.id }"
      :style="getPlayerPositionStyle(index, players.length)"
      @click="onPlayerClick(player.id)"
    >
      <!-- Imagen de cada jugador -->
      <img
        src="../../../assets/player.png"
        alt="Jugador"
        class="player-image"
      />
      <!-- Etiqueta con el número o nombre del jugador -->
      <span class="player-label"> {{ player.nombre }}</span>

      <!-- Visualización de los votos (Palitos) -->
      <div class="votes-bar">
        <div
          v-for="n in player.votes"
          :key="n"
          class="vote-stick"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayersCircle",
  props: {
    players: {
      type: Array,
      required: true,
    },
    selectedPlayerIndex: {
      type: Number,
      default: null,
    },
  },
  methods: {
    onPlayerClick(playerId) {
      this.$emit("select-player", playerId);
    },
    getPlayerPositionStyle(index, totalPlayers) {
      // Calcula el ángulo para este jugador
      const angle = (360 / totalPlayers) * index;
      // Define dos radios: uno horizontal (más grande) y uno vertical (más pequeño)
      const radiusX = 350; // Radio para eje X (más ancho)
      const radiusY = 300; // Radio para eje Y (más alto)
      // Convierte ángulo a radianes
      const rad = (angle * Math.PI) / 180;
      // Calcula coordenadas (x, y) usando los radios respectivos
      const x = radiusX * Math.cos(rad);
      const y = radiusY * Math.sin(rad);

      return {
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
      };
    },
  },
};
</script>

<style scoped>
/* Contenedor que define la "zona" del círculo */
.players-circle {
  position: absolute; /* o relative, según tu necesidad */
  top: 54%; /* centrado vertical */
  left: 50%; /* centrado horizontal */
  width: 0px;
  height: 0px;
  transform: translate(-50%, -50%);
}

/* Cada "jugador" se ubica en posición absoluta dentro del contenedor */
.player-icon {
  position: absolute;
  width: 5.625rem;
  height: 5.625rem;
  background-color: #262522;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;
}

/* Imagen del jugador */
.player-image {
  width: 4.375rem;
  height: 4.375rem;
  border-radius: 50%;
  object-fit: cover;
}

/* Etiqueta del jugador */
.player-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  color: #000000;
  font-size: 0.9rem;
  white-space: nowrap;
}

/* Visualización de los votos */
.votes-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
}

.vote-stick {
  width: 0.25rem;
  height: 1rem;
  background-color: #33ff00;
  margin: 0.25rem;
}
</style>
