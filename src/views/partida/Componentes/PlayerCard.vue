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
/* Contenedor del círculo completo */
.player-icon {
  position: absolute;
  width: 5.625rem;
  /* Altura suficiente para el avatar + label (puedes ajustar) */
  /* Por ejemplo: */
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

/* Contenedor exclusivo del avatar */
.avatar-wrapper {
  width: 5.625rem;
  height: 5.625rem;
  border-radius: 50%;
  overflow: hidden; /* Recorta la imagen al contorno circular */
}

/* Imagen del jugador ocupa todo el contenedor */
.player-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Se asegura de que la imagen llene el contenedor sin deformarse */
}

/* Etiqueta del jugador: se posiciona debajo del avatar */
.player-label {
  margin-top: 0.5rem;
  color: #000;
  font-size: 1.2rem; /* Aumenta este valor para mayor tamaño */
  font-weight: bold; /* Engrosa el texto */
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
