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
      <img src="../../../assets/player.png" alt="Jugador" class="player-image" />
      <!-- Etiqueta con el número o nombre del jugador -->
      <span class="player-label">Jugador {{ player.id }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayersCircle",
  props: {
    players: {
      type: Array,
      required: true
    },
    selectedPlayerIndex: {
      type: Number,
      default: null
    }
  },
  methods: {
    onPlayerClick(playerId) {
      this.$emit('select-player', playerId);
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
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
      };
    }

  }
};
</script>

<style scoped>
/* Contenedor que define la "zona" del círculo */
.players-circle {
  position: absolute;        /* o relative, según tu necesidad */
  top: 54%;                  /* centrado vertical */
  left: 50%;                 /* centrado horizontal */
  width: 0px;                /* No necesita ancho/alto específico, ya que se usa para posicionar */
  height: 0px;
  transform: translate(-50%, -50%);
  /* Para debug, puedes agregar un borde:
  border: 2px dashed red;
  */
}

/* Cada "jugador" se ubica en posición absoluta dentro del contenedor */
.player-icon {
  position: absolute;
  width: 90px;              /* Tamaño del circulito */
  height: 90px;
  background-color: #262522; /* Fondo oscuro */
  border-radius: 50%;       /* Circulo */
  display: flex;            /* Centrado del contenido */
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Imagen del jugador */
.player-image {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

/* Etiqueta del jugador (ej: "Jugador 1") */
.player-label {
  position: absolute;
  top: 100%;              /* Justo debajo de la imagen */
  left: 50%;
  transform: translateX(-50%);
  color: #000000;
  font-size: 0.9rem;
  white-space: nowrap;
}

/* Destacar jugador seleccionado */
.selected {
  outline: 2px solid yellow;
  border-radius: 50%;
}
</style>
