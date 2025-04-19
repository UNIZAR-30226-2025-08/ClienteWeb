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
        <div v-if="player.nombre == MiPlayerNombre" class="self-icon">👑</div>
        <div v-if="deadPlayers.includes(player.id)" class="skull-overlay">
          💀
        </div>
      </div>

      <!-- Etiqueta con el nombre del jugador -->
      <span
        class="player-label"
        :class="{
          dead: deadPlayers.includes(player.id),
          self: player.nombre == MiPlayerNombre,
        }"
      >
        {{ player.nombre }}
        {{ console.log(MiPlayerNombre) }}
      </span>

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
    //Quien es el jugador que maneja el cliente.
    MiPlayerNombre: {
      type: String,
      required: true,
    },

    deadPlayers: {
      type: Array,
      default: () => [],
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
  position: relative;
  display: inline-block;
  transition: color 0.3s;
  color: black;
}

.player-label.dead {
  color: #888;
}
.player-label.self {
  color: black; /* por ejemplo, azul vivo */
  font-weight: bold; /* opcional */
}
.self-icon {
  position: absolute;
  top: -1.8vw;
  right: -1.2vw;
  font-size: 2.2vw;
  pointer-events: none;
  text-shadow: 0 0 0.2vw rgba(0, 0, 0, 0.7);
}

.player-label.dead::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 3px;
  background: #f00; /* color de la línea */
  transform: scaleX(0);
  transform-origin: left center;
  animation: strike 1.5s forwards;
}

@keyframes strike {
  to {
    transform: scaleX(1);
  }
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
.skull-overlay {
  position: absolute;
  top: 0vw;
  right: 0.2vw;
  font-size: 3vw;
  pointer-events: none;
  z-index: 5;
}

.player-icon.selected .avatar-wrapper {
  outline: 0.3vw solid yellow; /* o un valor en px si prefieres */
  outline-offset: -0.3vw; /* hace que el contorno quede "pegado" al borde */
  border-radius: 50%; /* mantiene la forma circular */
}
</style>
