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
        <img
          src="../assets/aldeanosVivos.png"
          alt="Aldeanos Vivos"
          class="icon"
        />
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
    <div
      v-if="partidaActive && !alguacilOverlayActive"
      class="bottom-left-info"
    >
      <div class="top-row">
        <img
          :src="chosenRole.src"
          alt="Imagen del Rol"
          class="role-info-image"
        />
        <h3 class="role-info-title">HABILIDAD</h3>
      </div>
      <p class="role-description">
        {{ chosenRole.descripcion }}
      </p>
    </div>

    <!-- Contador (círculo) -->
    <div
      v-if="partidaActive && alguacilVotingActive"
      class="countdown-container"
    >
      <div class="countdown-circle">
        <span class="countdown-text">{{ timeLeft }}</span>
      </div>
    </div>

    <!-- Botón de votar (candado si ya has votado) -->
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
        <template v-if="!hasVoted"> VOTAR </template>
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
        <!-- Palitos de votos -->
        <div v-if="revealVotes && revealIndex >= 1" class="votes-palos">
          <span
            v-for="(vote, idx) in playersVotes[0]"
            :key="idx"
            class="palito"
          >
            |
          </span>
        </div>
      </div>

      <!-- Jugador 2 -->
      <div
        class="player-icon player-2"
        :class="{ selected: selectedPlayerIndex === 2 }"
        @click="selectPlayer(2)"
      >
        <span class="player-label">JUGADOR 2</span>
        <img src="../assets/player.png" alt="Jugador 2" />
        <div v-if="revealVotes && revealIndex >= 2" class="votes-palos">
          <span
            v-for="(vote, idx) in playersVotes[1]"
            :key="idx"
            class="palito"
          >
            |
          </span>
        </div>
      </div>

      <!-- Jugador 3 -->
      <div
        class="player-icon player-3"
        :class="{ selected: selectedPlayerIndex === 3 }"
        @click="selectPlayer(3)"
      >
        <span class="player-label">JUGADOR 3</span>
        <img src="../assets/player.png" alt="Jugador 3" />
        <div v-if="revealVotes && revealIndex >= 3" class="votes-palos">
          <span
            v-for="(vote, idx) in playersVotes[2]"
            :key="idx"
            class="palito"
          >
            |
          </span>
        </div>
      </div>

      <!-- Jugador 4 -->
      <div
        class="player-icon player-4"
        :class="{ selected: selectedPlayerIndex === 4 }"
        @click="selectPlayer(4)"
      >
        <span class="player-label">JUGADOR 4</span>
        <img src="../assets/player.png" alt="Jugador 4" />
        <div v-if="revealVotes && revealIndex >= 4" class="votes-palos">
          <span
            v-for="(vote, idx) in playersVotes[3]"
            :key="idx"
            class="palito"
          >
            |
          </span>
        </div>
      </div>

      <!-- Jugador 5 -->
      <div
        class="player-icon player-5"
        :class="{ selected: selectedPlayerIndex === 5 }"
        @click="selectPlayer(5)"
      >
        <span class="player-label">JUGADOR 5</span>
        <img src="../assets/player.png" alt="Jugador 5" />
        <div v-if="revealVotes && revealIndex >= 5" class="votes-palos">
          <span
            v-for="(vote, idx) in playersVotes[4]"
            :key="idx"
            class="palito"
          >
            |
          </span>
        </div>
      </div>

      <!-- Jugador 6 -->
      <div
        class="player-icon player-6"
        :class="{ selected: selectedPlayerIndex === 6 }"
        @click="selectPlayer(6)"
      >
        <span class="player-label">JUGADOR 6</span>
        <img src="../assets/player.png" alt="Jugador 6" />
        <div v-if="revealVotes && revealIndex >= 6" class="votes-palos">
          <span
            v-for="(vote, idx) in playersVotes[5]"
            :key="idx"
            class="palito"
          >
            |
          </span>
        </div>
      </div>

      <!-- Jugador 7 -->
      <div
        class="player-icon player-7"
        :class="{ selected: selectedPlayerIndex === 7 }"
        @click="selectPlayer(7)"
      >
        <span class="player-label">JUGADOR 7</span>
        <img src="../assets/player.png" alt="Jugador 7" />
        <div v-if="revealVotes && revealIndex >= 7" class="votes-palos">
          <span
            v-for="(vote, idx) in playersVotes[6]"
            :key="idx"
            class="palito"
          >
            |
          </span>
        </div>
      </div>

      <!-- Jugador 8 -->
      <div
        class="player-icon player-8"
        :class="{ selected: selectedPlayerIndex === 8 }"
        @click="selectPlayer(8)"
      >
        <span class="player-label">JUGADOR 8</span>
        <img src="../assets/player.png" alt="Jugador 8" />
        <div v-if="revealVotes && revealIndex >= 8" class="votes-palos">
          <span
            v-for="(vote, idx) in playersVotes[7]"
            :key="idx"
            class="palito"
          >
            |
          </span>
        </div>
      </div>
    </div>

    <!-- Mensaje central de "Has votado al jugador X" -->
    <div v-if="hasVoted && alguacilVotingActive" class="vote-message">
      Has votado al <strong>Jugador {{ selectedPlayerIndex }}</strong>
    </div>

    <!-- Pantalla final: "JUGADOR X ES EL ALGUACIL" -->
    <div v-if="alguacilResultOverlayActive" class="intro-overlay fadeInOut">
      <h1 class="intro-text">
        JUGADOR {{ alguacilWinnerIndex }} ES EL ALGUACIL
      </h1>
    </div>

    <RolOverlay v-if="mostrarRolOverlay" :role="rolData" />
  </div>
</template>

<script>
import { roles } from "../../assets/data/roles.js";
import RolOverlay from "./Overlay/RolOverlay.vue";
import { io } from "socket.io-client";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "Partida",
  components: {
    RolOverlay,
  },
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
      chosenRole: {},

      // Control de votos
      playersVotes: [0, 0, 0, 0, 0, 0, 0, 0], // votos de cada jugador
      revealVotes: false, // si estamos mostrando los votos en pantalla
      revealIndex: 0, // hasta qué jugador se han “revelado” los votos

      // Overlay final para indicar quién salió como Alguacil
      alguacilResultOverlayActive: false,
      alguacilWinnerIndex: null,

      socket: io("http://localhost:5000"),
      mostrarRolOverlay: false,
      rolData: { src: "", nombre: "" },
      route: useRoute(),
      router: useRouter(),
    };
  },
  mounted() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const idSala = this.route.params.idSala;

    if (!usuario || !idSala) {
      this.router.push("/juego");
      return;
    }

    // Escuchar la asignación de rol
    this.socket.on("rolAsignado", ({ rol, idSala }) => {
      // Actualizar el rol en el componente
      this.chosenRole = {
        nombre: rol,
        src: this.obtenerImagenRol(rol),
        descripcion: this.obtenerDescripcionRol(rol),
      };

      // Mostrar el RolOverlay
      this.rolData = {
        nombre: rol,
        src: this.obtenerImagenRol(rol),
      };
      this.mostrarRolOverlay = true;

      // Después de 6 segundos, continuar con el flujo normal
      setTimeout(() => {
        this.mostrarRolOverlay = false;
        this.iniciarFlujoPartida();
      }, 6000);
    });
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
          // Se acabó el tiempo de votar
          clearInterval(this.countdownInterval);
          this.alguacilVotingActive = false;

          // EJEMPLO: asignar los votos recibidos por cada jugador
          // (en un caso real vendrían de tu lógica o servidor)
          this.playersVotes = [2, 0, 3, 1, 4, 0, 1, 2];

          // Mostramos los votos progresivamente
          this.showVotesProgressively();
        }
      }, 1000);
    },

    // Muestra los votos de cada jugador uno tras otro
    showVotesProgressively() {
      this.revealVotes = true;
      let i = 0;
      const revealInterval = setInterval(() => {
        i++;
        this.revealIndex = i;

        if (i >= this.playersVotes.length) {
          clearInterval(revealInterval);

          // Calculamos el ganador (jugador con más votos)
          const maxVotes = Math.max(...this.playersVotes);
          const winnerIndex = this.playersVotes.indexOf(maxVotes) + 1;
          // +1 porque playersVotes es 0-based, jugadores 1..8

          this.alguacilWinnerIndex = winnerIndex;

          // Mostramos el overlay final
          this.alguacilResultOverlayActive = true;

          // Tras 6s, lo ocultamos (igual que los otros overlays fadeInOut)
          setTimeout(() => {
            this.alguacilResultOverlayActive = false;
          }, 6000);
        }
      }, 500); // cada 0.5s se “revela” el siguiente jugador
    },

    // Seleccionar/deseleccionar un jugador
    selectPlayer(playerIndex) {
      if (!this.alguacilVotingActive || this.hasVoted) return;

      if (this.selectedPlayerIndex === playerIndex) {
        this.selectedPlayerIndex = null;
      } else {
        this.selectedPlayerIndex = playerIndex;
      }
    },

    // Botón "VOTAR"
    voteForPlayer() {
      if (this.selectedPlayerIndex !== null && !this.hasVoted) {
        console.log("Has votado al jugador", this.selectedPlayerIndex);
        this.hasVoted = true;
      }
    },

    obtenerImagenRol(rol) {
      const imagenes = {
        Lobo: new URL("../../assets/roles/hombre_lobo.jpeg", import.meta.url)
          .href,
        Bruja: new URL("../../assets/roles/bruja.jpeg", import.meta.url).href,
        Vidente: new URL("../../assets/roles/vidente.jpeg", import.meta.url)
          .href,
        Aldeano: new URL("../../assets/roles/aldeano.jpeg", import.meta.url)
          .href,
        Cazador: new URL("../../assets/roles/cazador.jpeg", import.meta.url)
          .href,
      };
      return imagenes[rol] || "";
    },

    obtenerDescripcionRol(rol) {
      const descripciones = {
        Lobo: "Cada noche, los lobos se despiertan y eligen a una víctima para devorar.",
        Bruja: "Tiene dos pociones: una para salvar y otra para matar.",
        Vidente: "Cada noche puede conocer el rol de un jugador.",
        Aldeano: "Debe descubrir quiénes son los lobos y eliminarlos.",
        Cazador: "Al morir, puede llevarse a otro jugador con él.",
      };
      return descripciones[rol] || "";
    },

    iniciarFlujoPartida() {
      this.introActive = true;

      setTimeout(() => {
        this.introActive = false;
        this.roleActive = true;

        setTimeout(() => {
          this.roleActive = false;
          this.empiezaOverlayActive = true;

          setTimeout(() => {
            this.empiezaOverlayActive = false;
            this.partidaActive = true;

            setTimeout(() => {
              this.alguacilOverlayActive = true;

              setTimeout(() => {
                this.alguacilOverlayActive = false;
                this.startAlguacilVoting();
              }, 6000);
            }, 30000);
          }, 6000);
        }, 6000);
      }, 6000);
    },
  },
  beforeUnmount() {
    // Limpiar listeners de socket al desmontar
    this.socket.off("rolAsignado");
  },
};
</script>

<style scoped>
@import "./partida.css";
</style>
