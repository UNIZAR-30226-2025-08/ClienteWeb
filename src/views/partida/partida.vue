<template>
  <!-- Contenedor principal, aplicamos modo-noche si currentPeriod === 'NOCHE' -->
  <div
    class="partida-container"
    :class="{ 'modo-noche': currentPeriod === 'NOCHE' }"
  >
    <!-- Mostrar exclusivamente los overlays si la fase actual es una overlay -->
    <template v-if="isOverlayActive">
      <!-- Overlays iniciales -->
      <IntroOverlay v-if="currentPhase === 'intro'" />
      <RoleOverlay v-else-if="currentPhase === 'role'" :role="chosenRole" />
      <EmpiezaOverlay v-else-if="currentPhase === 'start'" />

      <!-- Overlays del alguacil -->
      <AlguacilOverlay v-else-if="currentPhase === 'alguacil_announce'" />
      <AlguacilResultOverlay
        v-else-if="currentPhase === 'alguacil_result'"
        :winner-index="alguacilWinnerIndex"
      />

      <!-- Overlay de noche -->
      <NocheOverlay v-else-if="currentPhase === 'night'" :visible="true" />

      <!-- Overlays de la vidente -->
      <VidenteOverlay
        v-else-if="currentPhase === 'vidente_awaken'"
        :visible="true"
      />
      <OjoCerradoOverlay
        v-else-if="currentPhase === 'ojo_cerrado'"
        :visible="true"
      />
    </template>

    <!-- Mostrar el contenido principal del juego cuando NO es fase overlay -->
    <template v-else>
      <GameStatus
        :aliveVillagers="aliveVillagers"
        :totalVillagers="totalVillagers"
        :aliveWolves="aliveWolves"
        :totalWolves="totalWolves"
        :currentDay="currentDay"
        :timePeriod="currentPeriod"
      />
      <RoleInfoPanel :role="chosenRole" />

      <!-- Círculo de jugadores, donde se puede hacer clic para votar -->
      <PlayersCircle
        :players="players"
        :alguacil-voting-active="isVotingPhase"
        :reveal-votes="revealVotes"
        :reveal-index="revealIndex"
        @select-player="selectPlayer"
      />

      <!-- Contador de tiempo para la votación -->
      <CountdownTimer v-if="isVotingPhase" :time-left="timeLeft" />

      <!-- Botón de voto -->
      <VoteButton
        v-if="isVotingPhase"
        :selected-player-index="selectedPlayerIndex"
        :has-voted="hasVoted"
        @vote="voteForPlayer"
      />

      <!-- Mensaje cuando ya has votado -->
      <div v-if="hasVoted && isVotingPhase" class="vote-message">
        Has votado al <strong>Jugador {{ selectedPlayerIndex }}</strong>
      </div>
    </template>
  </div>
</template>

<script>
import { roles } from "../../assets/data/roles.js";
import GameStatus from "../../views/partida/Componentes/GameStatus.vue";
import RoleInfoPanel from "../../views/partida/Componentes/DescripcionRol.vue";
import CountdownTimer from "../../views/partida/Componentes/CountdownTimer.vue";
import VoteButton from "../../views/partida/Componentes/VoteButton.vue";
import PlayersCircle from "../../views/partida/Componentes/PlayerCard.vue";

import IntroOverlay from "../../views/partida/Overlay/IntroPartidaOverlay.vue";
import RoleOverlay from "../../views/partida/Overlay/RolOverlay.vue";
import EmpiezaOverlay from "../../views/partida/Overlay/InicioPartidaOverlay.vue";

import AlguacilOverlay from "../../views/partida/Overlay/VotacionAlguacilOverlay.vue";
import AlguacilResultOverlay from "../../views/partida/Overlay/ResultadoAlguacilOverlay.vue";

import NocheOverlay from "../../views/partida/Overlay/InicioNocheOverlay.vue";
import VidenteOverlay from "../../views/partida/Overlay/VidenteOverlay.vue";
import OjoCerradoOverlay from "../../views/partida/Overlay/OjoCerradoOverlay.vue";

export default {
  name: "Partida",
  components: {
    GameStatus,
    RoleInfoPanel,
    CountdownTimer,
    VoteButton,
    PlayersCircle,
    IntroOverlay,
    RoleOverlay,
    EmpiezaOverlay,
    AlguacilOverlay,
    AlguacilResultOverlay,
    NocheOverlay,
    VidenteOverlay,
    OjoCerradoOverlay,
  },
  data() {
    return {
      // Fases posibles:
      // 'intro', 'role', 'start', 'alguacil_announce', 'game_voting', 'alguacil_result',
      // 'night', 'vidente_awaken', 'ojo_cerrado', 'game'
      currentPhase: "intro",
      isGameActive: false,
      isVotingPhase: false,

      // Temporizador
      timeLeft: 60,
      countdownInterval: null,

      // Jugadores y votación
      players: [],
      selectedPlayerIndex: null,
      hasVoted: false,
      revealVotes: false,
      revealIndex: 0,

      // Roles y estado del juego
      chosenRole: {},
      alguacilWinnerIndex: null,
      aliveVillagers: 5,
      totalVillagers: 6,
      aliveWolves: 2,
      totalWolves: 2,
      currentDay: 1,
      currentPeriod: "DÍA",
    };
  },
  computed: {
    /**
     * Define qué fases deben mostrar únicamente un overlay
     * No incluimos "game_voting" aquí, para que en esa fase
     * se muestre el contenido principal (contador, jugadores, etc.).
     */
    isOverlayActive() {
      return [
        "intro",
        "role",
        "start",
        "alguacil_announce",
        "alguacil_result",
        "night",
        "vidente_awaken",
        "ojo_cerrado",
      ].includes(this.currentPhase);
    },
  },
  mounted() {
    const salaGuardada = localStorage.getItem("salaActual");
    if (!salaGuardada) {
      console.error("No se encontró la información de la sala");
      this.$router.push("/juego");
      return;
    }
    const sala = JSON.parse(salaGuardada);

    // Sincronizar lista de jugadores
    this.players = sala.jugadores || [];

    // Asignar el rol del jugador actual
    const rol = localStorage.getItem("miRol");
    const rolMayus = JSON.parse(rol);
    if (rolMayus) {
      this.chosenRole = roles.find(
        (role) => role.nombre.toLowerCase() === rolMayus.toLowerCase()
      );
    } else {
      console.error("No se encontró el rol del jugador actual");
    }

    this.aliveVillagers = sala.maxJugadores;
    this.totalVillagers = sala.maxJugadores;
    // Sincronizar los totales a partir de maxRoles (si existe)
    this.aliveWolves = sala.maxRoles["Hombre lobo"] || 0;
    this.totalWolves = sala.maxRoles["Hombre lobo"] || 0;

    // Iniciar flujo de juego
    this.startGameFlow();
    /* Ejemplo de conexión con socket:
    const idPartida = "partida_" + sala.id;
    socket.emit("unirsePartida", { idPartida, idUsuario: myId });
    socket.on("turnoCambiado", ({ estado, mensaje }) => {
      this.currentPhase = estado.turno || "game";
      this.players = estado.jugadores || this.players;
      this.currentDay = estado.currentDay || this.currentDay;
      this.currentPeriod = estado.currentPeriod || this.currentPeriod;
    });
    */
  },
  beforeUnmount() {
    clearInterval(this.countdownInterval);
    // Si usas sockets, desuscríbete aquí
    // socket.off("turnoCambiado");
    // socket.off("votoRegistrado");
    // socket.off("rolAsignado");
  },
  methods: {
    getMyId() {
      const user = localStorage.getItem("usuario");
      return user ? JSON.parse(user).id : null;
    },

    // Saber si el jugador actual es la Vidente
    isVidente() {
      return this.chosenRole && this.chosenRole.nombre === "Vidente";
    },

    startGameFlow() {
      // Secuencia inicial
      setTimeout(() => {
        this.currentPhase = "role";

        setTimeout(() => {
          this.currentPhase = "start";

          setTimeout(() => {
            this.startMainGame();
          }, 6000);
        }, 6000);
      }, 6000);
    },

    startMainGame() {
      this.currentPhase = "game";
      this.isGameActive = true;

      // Pasados 30s en game, se anuncia la votación del alguacil
      setTimeout(() => {
        this.currentPhase = "alguacil_announce";
        setTimeout(() => {
          this.startAlguacilVoting();
        }, 6000);
      }, 30000);
    },

    // Fase de votación de Alguacil (NO es overlay, se ve en el contenido principal)
    startAlguacilVoting() {
      this.currentPhase = "game_voting";
      this.isVotingPhase = true;
      this.timeLeft = 60;

      this.countdownInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(this.countdownInterval);
          this.endVotingPhase();
        }
      }, 1000);
    },

    // Cuando termina la votación, calculamos el ganador y mostramos el resultado
    endVotingPhase() {
      this.isVotingPhase = false;
      this.revealVotes = true;
      this.showVotesProgressively();

      // Calcular ganador
      const maxVotes = Math.max(...this.players.map((p) => p.votes));
      const winners = this.players.filter((p) => p.votes === maxVotes);
      this.alguacilWinnerIndex = winners[0]?.id || null;

      // Pasamos a mostrar el overlay de resultado
      this.currentPhase = "alguacil_result";

      setTimeout(() => {
        // Llamamos a la función que gestiona TODO el proceso de noche
        this.startNightSequence();
      }, 6000);
    },

    /**
     * Encapsula TODO el proceso de la noche:
     *  1) Overlay de noche
     *  2) Vidente se despierta
     *  3) Ojo cerrado para los demás
     *  4) Volver al juego
     */
    startNightSequence() {
      // 1) Comenzamos la noche
      this.currentPhase = "night";
      this.currentPeriod = "NOCHE";

      setTimeout(() => {
        // 2) Overlay: la Vidente se despierta (para TODOS)
        this.currentPhase = "vidente_awaken";
        setTimeout(() => {
          // 3) Si eres la Vidente, vas directo al juego
          if (this.isVidente()) {
            this.currentPhase = "game";
            this.resetVotingState();
          } else {
            // Si NO eres la Vidente, ves el ojo cerrado
            this.currentPhase = "ojo_cerrado";
            setTimeout(() => {
              // 4) Todos vuelven al juego
              this.currentPhase = "game";
              this.resetVotingState();
            }, 6000);
          }
        }, 6000);
      }, 6000);
    },

    showVotesProgressively() {
      let i = 0;
      const revealInterval = setInterval(() => {
        if (i >= this.players.length) {
          clearInterval(revealInterval);
          return;
        }
        this.revealIndex = i + 1;
        i++;
      }, 500);
    },

    selectPlayer(playerIndex) {
      if (!this.isVotingPhase || this.hasVoted) return;
      this.selectedPlayerIndex =
        this.selectedPlayerIndex === playerIndex ? null : playerIndex;
    },

    voteForPlayer() {
      if (this.selectedPlayerIndex && !this.hasVoted) {
        this.players[this.selectedPlayerIndex - 1].votes++;
        this.hasVoted = true;
      }
    },

    resetVotingState() {
      this.selectedPlayerIndex = null;
      this.hasVoted = false;
      this.revealVotes = false;
      this.revealIndex = 0;
      this.players.forEach((p) => (p.votes = 0));
    },

    getRandomRole() {
      // Lógica para elegir rol (por ejemplo, excluir 'alguacil' si es un rol aparte)
      const validRoles = roles.filter(
        (role) => role.nombre.toLowerCase() !== "alguacil"
      );
      return validRoles[Math.floor(Math.random() * validRoles.length)];
    },
  },
};
</script>

<style scoped>
.partida-container {
  background-image: url("../../assets/fondoPartida.jpeg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Aplica un filtro de oscuridad cuando sea de noche */
.modo-noche {
  filter: brightness(0.4);
}

.vote-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #262522;
  color: white;
  padding: 20px 40px;
  border-radius: 10px;
  font-size: 1.5rem;
  z-index: 1000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}
</style>
