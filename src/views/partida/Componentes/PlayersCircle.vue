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
        <img src="../assets/player.png" alt="Jugador" class="player-image" />
  
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
        // Radio (distancia desde el centro)
        const radius = 200; // Ajusta según tu diseño
        // Convierte ángulo a radianes
        const rad = (angle * Math.PI) / 180;
        // Calcula coordenadas (x, y)
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);
  
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
    top: 50%;                  /* centrado vertical */
    left: 50%;                 /* centrado horizontal */
    width: 500px;             /* ajusta el ancho que quieras */
    height: 500px;            /* ajusta la altura que quieras */
    transform: translate(-50%, -50%);
    /* Puedes agregar un borde o background para debug
    border: 2px dashed red;
    */
  }
  
  /* Cada "jugador" se ubica en posición absoluta dentro del contenedor */
  .player-icon {
    position: absolute;
    width: 64px;    /* ajusta el tamaño del icono */
    height: 64px;
    cursor: pointer;
  }
  
  /* Imagen del jugador */
  .player-image {
    width: 100%;
    height: 100%;
  }
  
  /* Etiqueta del jugador (ej: "Jugador 1") */
  .player-label {
    position: absolute;
    top: 100%;            /* justo debajo de la imagen */
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 0.9rem;
    white-space: nowrap;
  }
  
  /* Si quieres destacar el jugador seleccionado */
  .selected {
    outline: 2px solid yellow;
    border-radius: 50%;
  }
  </style>
  