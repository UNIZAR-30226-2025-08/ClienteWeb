<template>
  <div class="partida-container">
    <!-- Overlay 1: Intro "AMANECE..." -->
    <div v-if="introActive" class="intro-overlay fadeInOut">
      <h1 class="intro-text">
        AMANECE EN LA ALDEA, TODO EL MUNDO DESPIERTA Y ABRE LOS OJOS
      </h1>
    </div>

    <!-- Overlay 2: Mostrar el rol aleatorio -->
    <div v-if="roleActive" class="role-overlay fadeInOut">
      <h1 class="role-title">TU ROL ES</h1>
      <img :src="chosenRole.src" class="role-image" :alt="chosenRole.nombre" />
      <h2 class="role-name">{{ chosenRole.nombre?.toUpperCase() }}</h2>
    </div>

    <!-- Overlay 3: Mensaje "Empieza la partida" -->
    <div v-if="empiezaOverlayActive" class="empieza-overlay fadeInOut">
      <h1 class="empieza-text">EMPIEZA LA PARTIDA</h1>
    </div>

    <!-- Overlay 4: Elección del Alguacil -->
    <div v-if="alguacilOverlayActive" class="intro-overlay fadeInOut">
      <h1 class="intro-text">
        LOS JUGADORES ELEGIRÁN DE MANERA CONSENSUADA QUIÉN SERÁ EL ALGUACIL
      </h1>
    </div>

    <!-- Cabecera / Secciones de la partida -->
    <div v-if="partidaActive && !alguacilOverlayActive" class="top-sections">
      <div class="section">
        <img src="../assets/aldeanosVivos.png" alt="Aldeanos Vivos" class="icon" />
        <div class="text">
          <strong>PUEBLO</strong>
          <span>5/6 Vivos</span>
        </div>
      </div>

      <div class="section center">
        <strong>JORNADA 2</strong>
        <span>DÍA</span>
      </div>

      <div class="section">
        <img src="../assets/lobosVivos.png" alt="Lobos Vivos" class="icon" />
        <div class="text">
          <strong>LOBOS</strong>
          <span>2/2 Vivos</span>
        </div>
      </div>
    </div>

    <!-- Panel inferior izquierdo (Habilidad) -->
    <div v-if="partidaActive && !alguacilOverlayActive" class="bottom-left-info">
      <div class="top-row">
        <img :src="chosenRole.src" alt="Imagen del Rol" class="role-info-image" />
        <h3 class="role-info-title">HABILIDAD</h3>
      </div>
      <p class="role-description">
        {{ chosenRole.descripcion }}
      </p>
    </div>

    <!-- Contador (círculo) -->
    <div v-if="partidaActive && alguacilVotingActive" class="countdown-container">
      <div class="countdown-circle">
        <span class="countdown-text">{{ timeLeft }}</span>
      </div>
    </div>

    <!-- Botón de votar (ahora más ancho y encima de la parte de habilidad) -->
    <div 
      v-if="partidaActive && alguacilVotingActive" 
      class="vote-button-container"
    >
      <button 
        class="vote-button" 
        :class="{ active: selectedPlayerIndex !== null }"
        :disabled="hasVoted"
        @click="voteForPlayer"
      >
        <!-- Si no has votado, texto "VOTAR" -->
        <template v-if="!hasVoted">
          VOTAR
        </template>
        <!-- Si ya has votado, texto "YA HAS VOTADO" + icono candado -->
        <template v-else>
          <img src="../assets/candado.png" alt="candado" class="candado-icon" />
          YA HAS VOTADO
        </template>
      </button>
    </div>

    <!-- Ocho jugadores alrededor de la hoguera -->
    <div 
      v-if="partidaActive && !alguacilOverlayActive" 
      class="players-container" 
      :class="{ clickable: alguacilVotingActive }"
    >
      <!-- Jugador 1 -->
      <div 
        class="player-icon player-1" 
        :class="{ selected: selectedPlayerIndex === 1 }"
        @click="selectPlayer(1)"
      >
        <span class="player-label">JUGADOR 1</span>
        <img src="../assets/player.png" alt="Jugador 1" />
      </div>

      <!-- Jugador 2 -->
      <div 
        class="player-icon player-2"
        :class="{ selected: selectedPlayerIndex === 2 }"
        @click="selectPlayer(2)"
      >
        <span class="player-label">JUGADOR 2</span>
        <img src="../assets/player.png" alt="Jugador 2" />
      </div>

      <!-- Jugador 3 -->
      <div 
        class="player-icon player-3"
        :class="{ selected: selectedPlayerIndex === 3 }"
        @click="selectPlayer(3)"
      >
        <span class="player-label">JUGADOR 3</span>
        <img src="../assets/player.png" alt="Jugador 3" />
      </div>

      <!-- Jugador 4 -->
      <div 
        class="player-icon player-4"
        :class="{ selected: selectedPlayerIndex === 4 }"
        @click="selectPlayer(4)"
      >
        <span class="player-label">JUGADOR 4</span>
        <img src="../assets/player.png" alt="Jugador 4" />
      </div>

      <!-- Jugador 5 -->
      <div 
        class="player-icon player-5"
        :class="{ selected: selectedPlayerIndex === 5 }"
        @click="selectPlayer(5)"
      >
        <span class="player-label">JUGADOR 5</span>
        <img src="../assets/player.png" alt="Jugador 5" />
      </div>

      <!-- Jugador 6 -->
      <div 
        class="player-icon player-6"
        :class="{ selected: selectedPlayerIndex === 6 }"
        @click="selectPlayer(6)"
      >
        <span class="player-label">JUGADOR 6</span>
        <img src="../assets/player.png" alt="Jugador 6" />
      </div>

      <!-- Jugador 7 -->
      <div 
        class="player-icon player-7"
        :class="{ selected: selectedPlayerIndex === 7 }"
        @click="selectPlayer(7)"
      >
        <span class="player-label">JUGADOR 7</span>
        <img src="../assets/player.png" alt="Jugador 7" />
      </div>

      <!-- Jugador 8 -->
      <div 
        class="player-icon player-8"
        :class="{ selected: selectedPlayerIndex === 8 }"
        @click="selectPlayer(8)"
      >
        <span class="player-label">JUGADOR 8</span>
        <img src="../assets/player.png" alt="Jugador 8" />
      </div>
    </div>
  </div>
</template>

<script>
import { roles } from "../assets/data/roles.js";

export default {
  name: "Partida",
  data() {
    return {
      // Overlays
      introActive: true,
      roleActive: false,
      empiezaOverlayActive: false,
      partidaActive: false,
      alguacilOverlayActive: false,

      // Fase de votación Alguacil
      alguacilVotingActive: false,
      timeLeft: 60,
      countdownInterval: null,

      // Selección de jugador y voto
      selectedPlayerIndex: null,
      hasVoted: false,

      // Rol aleatorio elegido
      chosenRole: {}
    };
  },
  mounted() {
    // Simulación del flujo de pantallas
    setTimeout(() => {
      this.introActive = false;

      // Escoge rol aleatorio
      const validRoles = roles.filter(role => role.nombre.toLowerCase() !== "aguacil");
      const randomIndex = Math.floor(Math.random() * validRoles.length);
      this.chosenRole = validRoles[randomIndex];
      this.roleActive = true;

      setTimeout(() => {
        this.roleActive = false;
        this.empiezaOverlayActive = true;

        setTimeout(() => {
          this.empiezaOverlayActive = false;
          this.partidaActive = true;

          // A los 30s, sale la pantalla de Alguacil
          setTimeout(() => {
            this.alguacilOverlayActive = true;

            // Tras 6s de animación, la ocultamos y empezamos la votación
            setTimeout(() => {
              this.alguacilOverlayActive = false;
              this.startAlguacilVoting();
            }, 6000);
          }, 30000);

        }, 6000);
      }, 6000);
    }, 6000);
  },
  methods: {
    // Inicia la votación del Alguacil
    startAlguacilVoting() {
      this.alguacilVotingActive = true;
      this.timeLeft = 60;

      this.countdownInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(this.countdownInterval);
          // Se acabó el tiempo, podrías cerrar la votación o asignar por defecto
          this.alguacilVotingActive = false;
        }
      }, 1000);
    },

    // Seleccionar/deseleccionar un jugador
    selectPlayer(playerIndex) {
      if (!this.alguacilVotingActive || this.hasVoted) return;

      // Si ya estaba seleccionado, lo deseleccionamos
      if (this.selectedPlayerIndex === playerIndex) {
        this.selectedPlayerIndex = null;
      } else {
        this.selectedPlayerIndex = playerIndex;
      }
    },

    // Botón "VOTAR"
    voteForPlayer() {
      // Solo permitimos votar si hay un jugador seleccionado y no se ha votado antes
      if (this.selectedPlayerIndex !== null && !this.hasVoted) {
        console.log("Has votado al jugador", this.selectedPlayerIndex);

        // Marcar que ya has votado
        this.hasVoted = true;

        // Opcional: podrías limpiar la cuenta atrás
        // clearInterval(this.countdownInterval);
        // this.alguacilVotingActive = false;
      }
    }
  }
};
</script>

<style scoped>
@import "./partida.css";
</style>
