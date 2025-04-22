<template>
  <div class="players-circle">
    <div
      v-for="(player, index) in players"
      :key="player.id"
      class="player-icon"
      :class="{ selected: selectedPlayerIndex === player.id }"
      :style="[
        getPlayerPositionStyle(index, players.length),
        getPlayerStyles(player),
      ]"
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
  data() {
    return {
      usernameColors: {},
      colorPalette: [
        "#FF6B6B", // Rojo
        "#4ECDC4", // Turquesa
        "#45B7D1", // Azul claro
        "#96CEB4", // Verde menta
        "#FFEEAD", // Amarillo claro
        "#D4A5A5", // Rosa
        "#9B59B6", // Púrpura
        "#3498DB", // Azul
        "#E67E22", // Naranja
        "#2ECC71", // Verde
        "#F1C40F", // Amarillo
        "#E74C3C", // Rojo oscuro
        "#1ABC9C", // Verde esmeralda
        "#34495E", // Azul oscuro
        "#F39C12", // Naranja oscuro
      ],
    };
  },
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
    getUsernameColor(username) {
      if (!this.usernameColors[username]) {
        const hash = username.split("").reduce((acc, char, index) => {
          return acc + char.charCodeAt(0) * (index + 1);
        }, 0);
        const colorIndex = hash % this.colorPalette.length;
        this.usernameColors[username] = this.colorPalette[colorIndex];
      }
      return this.usernameColors[username];
    },
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
    getPlayerStyles(player) {
      const color = this.getUsernameColor(player.nombre);
      return {
        "--player-color": color,
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
  border: 0.3vw solid var(--player-color);
  transition: border-color 0.3s, transform 0.3s;
}

.player-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.player-label {
  position: relative;
  display: inline-block;
  transition: color 0.3s;
  color: var(--player-color);
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
}

.player-label.dead {
  color: #888;
}

.player-label.self {
  font-weight: bold;
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
  background: #f00;
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
  top: 0;
  right: 0.2vw;
  font-size: 3vw;
  pointer-events: none;
  z-index: 5;
}

/* Efecto de halo y escalado para avatar seleccionado */
.player-icon.selected .avatar-wrapper {
  border-color: #ffeb3b;
  transform: scale(1.3);
  animation: pulseGlow 1.5s infinite ease-out;
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 0.5vw rgba(255, 235, 59, 0.9);
  }
  50% {
    box-shadow: 0 0 3vw rgba(255, 235, 59, 0);
  }
  100% {
    box-shadow: 0 0 0.5vw rgba(255, 235, 59, 0.9);
  }
}
</style>
