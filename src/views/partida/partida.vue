<template>
  <div class="partida-container">
    <!-- Mostrar exclusivamente los overlays si la fase actual es una overlay -->
    <template v-if="isOverlayActive">
      <IntroOverlay v-if="currentPhase === 'intro'" />
      <RoleOverlay v-else-if="currentPhase === 'role'" :role="chosenRole" />
      <EmpiezaOverlay v-else-if="currentPhase === 'start'" />
      <AlguacilOverlay v-else-if="currentPhase === 'alguacil_announce'" />
      <AlguacilResultOverlay
        v-else-if="currentPhase === 'alguacil_result'"
        :winner-index="alguacilWinnerIndex"
      />
    </template>

    <!-- Mostrar el contenido principal del juego cuando NO es fase overlay -->
    <template v-else>
      <GameStatus
        :pueblo-vivos="aliveVillagers"
        :total-pueblo="totalVillagers"
        :lobos-vivos="aliveWolves"
        :total-lobos="totalWolves"
        :jornada="currentDay"
        :periodo="currentPeriod"
      />

      <RoleInfoPanel :role="chosenRole" />

      <PlayersCircle
        :players="players"
        :alguacil-voting-active="isVotingPhase"
        :reveal-votes="revealVotes"
        :reveal-index="revealIndex"
        @select-player="selectPlayer"
      />

      <CountdownTimer v-if="isVotingPhase" :time-left="timeLeft" />

      <VoteButton
        v-if="isVotingPhase"
        :selected-player-index="selectedPlayerIndex"
        :has-voted="hasVoted"
        @vote="voteForPlayer"
      />

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
  },
  data() {
    return {
      // Flujo del juego
      currentPhase: "intro", // Fases posibles: 'intro', 'role', 'start', 'alguacil_announce', 'alguacil_result', 'game', 'game_voting'
      isGameActive: false,
      isVotingPhase: false,

      // Temporizadores
      timeLeft: 60,
      countdownInterval: null,

      // Jugadores y votación
      players: Array()
        .fill()
        .map((_, i) => ({ id: i + 1, votes: 0 })),
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
    // Define las fases que deben mostrar únicamente el overlay
    isOverlayActive() {
      return [
        "intro",
        "role",
        "start",
        "alguacil_announce",
        "alguacil_result",
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

    // Asignar el rol del jugador actual según lo asignado en la sala
    const myId = this.getMyId(); // Implementa este método para obtener el id del usuario actual
    const miJugador = this.players.find((j) => j.id == myId);
    if (miJugador && miJugador.rol) {
      this.chosenRole = miJugador.rol;
    } else {
      console.error("No se encontró un rol asignado para el jugador");
    }

    // Sincronizar el estado dinámico de la partida
    this.currentPhase = sala.currentPhase || "game";
    this.currentDay = sala.currentDay || 1;
    this.currentPeriod = sala.currentPeriod || "DÍA";

    // Sincronizar los totales a partir de maxRoles (si existe)
    if (sala.maxRoles) {
      //Asignamos los roles al inicio con lo que recuperamos de la sala
      this.aliveWolves = sala.maxRoles["Hombre lobo"] || 0;
      this.totalWolves = sala.maxRoles["Hombre lobo"] || 0;
      this.aliveVillagers = sala.maxRoles["Aldeano"] || 0;
      this.totalVillagers = sala.maxRoles["Aldeano"] || 0;
    } else {
      // Si no se definió maxRoles, puedes asignar valores por defecto
      this.aliveWolves = 0;
      this.totalWolves = 0;
      this.aliveVillagers = 0;
      this.totalVillagers = 0;
    }

    // Construir el id de la partida (asegúrate de que coincida con la lógica del servidor)
    const idPartida = "partida_" + sala.id;
    // Emitir un evento para unirse a la partida
    socket.emit("unirsePartida", { idPartida, idUsuario: myId });

    // Configurar los listeners para recibir actualizaciones desde el servidor
    socket.on("turnoCambiado", ({ estado, mensaje }) => {
      this.currentPhase = estado.turno || "game";
      this.players = estado.jugadores || this.players;
      this.currentDay = estado.currentDay || this.currentDay;
      this.currentPeriod = estado.currentPeriod || this.currentPeriod;
    });

    socket.on("votoRegistrado", ({ estado }) => {
      this.players = estado.jugadores || this.players;
    });

    socket.on("rolAsignado", (data) => {
      // Aunque ya se asignó el rol, este listener sirve para actualizarlo en caso de reconexión o cambios
      if (data.idSala === sala.id && data.rol) {
        this.chosenRole = data.rol;
      }
    });
  },

  beforeUnmount() {
    clearInterval(this.countdownInterval);
    socket.off("turnoCambiado");
    socket.off("votoRegistrado");
    socket.off("rolAsignado");
  },
  methods: {
    getMyId() {
      const user = localStorage.getItem("usuario");
      return user ? JSON.parse(user).id : null;
    },
    startGameFlow() {
      // Secuencia inicial de overlays
      setTimeout(() => {
        this.currentPhase = "role";
        this.chosenRole = this.getRandomRole();

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

      // Programar votación del Alguacil después de 30 segundos
      setTimeout(() => {
        this.currentPhase = "alguacil_announce";

        setTimeout(() => {
          this.startAlguacilVoting();
        }, 6000);
      }, 30000);
    },

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

    endVotingPhase() {
      this.isVotingPhase = false;
      this.revealVotes = true;
      this.showVotesProgressively();

      // Calcular ganador
      const maxVotes = Math.max(...this.players.map((p) => p.votes));
      const winners = this.players.filter((p) => p.votes === maxVotes);
      this.alguacilWinnerIndex = winners[0].id;

      // Mostrar resultado
      this.currentPhase = "alguacil_result";

      setTimeout(() => {
        this.currentPhase = "game";
        this.resetVotingState();
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
