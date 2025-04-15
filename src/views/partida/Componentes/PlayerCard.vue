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

      <!-- Etiqueta con el nombre del jugador -->
      <span class="player-label">{{ player.nombre }}</span>

      <!-- Visualización de los votos (Palitos) -->
      <div class="votes-bar">
        <!-- Convertimos player.votes a número y, si no es un número válido, se usa 0 -->
        <div
          v-for="n in Number(player.votes) || 0"
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
      const angle = (360 / totalPlayers) * index;
      const radiusX = 350; // Radio para eje X
      const radiusY = 300; // Radio para eje Y
      const rad = (angle * Math.PI) / 180;
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
  width: 0.2vw;
  height: 0.8vw;
  background-color: #33ff00;
  margin: 0.2vw;
}
</style>
