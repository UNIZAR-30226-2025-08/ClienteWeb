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
      <!-- Contenedor exclusivo para la imagen con overflow hidden -->
      <div class="avatar-wrapper">
        <img
          :src="avatarMap[player.avatar] || defaultAvatar"
          alt="Avatar Jugador"
          class="player-image"
        />
      </div>

      <!-- Etiqueta con el nombre del jugador, fuera del contenedor de imagen -->
      <span class="player-label">{{ player.nombre }}</span>

      <!-- Visualización de los votos (Palitos) -->
      <div class="votes-bar">
        <div v-for="n in player.votes" :key="n" class="vote-stick"></div>
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
    avatarMap: {
      type: Object,
      required: true,
    },
    defaultAvatar: {
      type: String,
      required: true,
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
.players-circle {
  position: absolute;
  top: 54%;
  left: 50%;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
}

.player-icon {
  position: absolute;
  /* 5.625rem ≈ 90px, 90/1920*100 ≈ 4.7vw */
  width: 4.7vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.avatar-wrapper {
  width: 4.7vw;
  height: 4.7vw;
  border-radius: 50%;
  overflow: hidden;
}

.player-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-label {
  margin-top: 0.5vw;
  color: #000;
  /* 1.2rem ≈ 19px, ~1vw */
  font-size: 1vw;
  font-weight: bold;
  white-space: nowrap;
}

.votes-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5vw;
}

.vote-stick {
  /* 0.25rem ≈ 4px → 4/1920*100 ≈ 0.2vw; 1rem ≈ 16px → 16/1920*100 ≈ 0.83vw */
  width: 0.2vw;
  height: 0.8vw;
  background-color: #33ff00;
  margin: 0.2vw;
}
</style>
