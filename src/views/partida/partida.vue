<template>
  <!-- Contenedor principal: se aplica la clase "modo-noche" si currentPeriod es "NOCHE" -->
  <div
    class="partida-container"
    :class="{ 'modo-noche': currentPeriod === 'NOCHE' }"
  >
    <!-- Si la fase actual es tratada como overlay, se muestran sólo los overlays -->
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

    <!-- Cuando no es fase overlay se muestra el contenido principal -->
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

      <!-- Círculo de jugadores -->
      <PlayersCircle
        :players="players"
        :alguacil-voting-active="isVotingPhase"
        :reveal-votes="revealVotes"
        :reveal-index="revealIndex"
        @select-player="selectPlayer"
      />

      <!-- Contador: se muestra en fase "game_voting" y en "vidente_action" -->
      <CountdownTimer v-if="isVotingPhase" :time-left="timeLeft" />

      <!-- Botón de voto se muestra solo en fase de votación (y para quienes NO son la Vidente) -->
      <VoteButton
        v-if="isVotingPhase && !isVidente()"
        :selected-player-index="selectedPlayerIndex"
        :has-voted="hasVoted"
        @vote="voteForPlayer"
      />

      <!-- Nuevo bloque para la acción de la Vidente (fase "vidente_action") -->
      <div
        v-if="currentPhase === 'vidente_action' && isVidente()"
        class="vidente-buttons"
      >
        <TurnButton :has-passed="hasPassedTurn" @pass="handlePassTurn" />
        <DiscoverRoleButton
          :has-discovered="hasDiscoveredRole"
          @discover="handleDiscoverRole"
        />
      </div>

      <!-- Mensaje cuando ya has votado -->
      <div v-if="hasVoted && isVotingPhase" class="vote-message">
        Has votado al <strong>Jugador {{ selectedPlayerIndex }}</strong>
      </div>

      <Chat :messages="chatMessages" @new-message="addMessage" />

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

import TurnButton from "../../views/partida/Componentes/TurnButton.vue";
import DiscoverRoleButton from "../../views/partida/Componentes/DiscoverRoleButton.vue";

import Chat from "../../views/partida/Componentes/Chat.vue"; 


export default {
  name: "Partida",
  components: {
    GameStatus,
    RoleInfoPanel,
    CountdownTimer,
    VoteButton,
    PlayersCircle,
    IntroOverlay,
    Chat,
    RoleOverlay,
    EmpiezaOverlay,
    AlguacilOverlay,
    AlguacilResultOverlay,
    NocheOverlay,
    VidenteOverlay,
    OjoCerradoOverlay,
    TurnButton,
    DiscoverRoleButton,
  },
  data() {
    return {
      // Fases posibles:
      // 'intro', 'role', 'start', 'alguacil_announce', 'game_voting', 'alguacil_result',
      // 'night', 'vidente_awaken', 'vidente_action', 'ojo_cerrado', 'game'
      currentPhase: "intro",
      isGameActive: false,
      isVotingPhase: false,

      // Variables del temporizador
      timeLeft: 60,
      countdownInterval: null,

      // Jugadores y votación
      players: [],
      selectedPlayerIndex: null,
      hasVoted: false,
      revealVotes: false,
      revealIndex: 0,

      //Chat
      chatMessages: [],

      // Datos de rol y estado del juego
      chosenRole: {},
      alguacilWinnerIndex: null,
      aliveVillagers: 5,
      totalVillagers: 6,
      aliveWolves: 2,
      totalWolves: 2,
      currentDay: 1,
      currentPeriod: "DÍA",

      // Nuevas propiedades para la acción de la Vidente
      hasPassedTurn: false,
      hasDiscoveredRole: false,
    };
  },
  computed: {
    /**
     * Se tratan como overlay las siguientes fases.
     * No se incluyen "game_voting" ni "vidente_action" para que se muestre el contenido principal.
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

    // Sincronizar la lista de jugadores
    this.players = sala.jugadores || [];

    // Obtener el rol del jugador (por ejemplo, de localStorage)
    const rol = localStorage.getItem("miRol");
    const rolMayus = JSON.parse(rol);
    if (rolMayus) {
      this.chosenRole = roles.find(
        (role) => role.nombre.toLowerCase() === rolMayus.toLowerCase()
      );
    } else {
      console.error("No se encontró el rol del jugador actual");
    }

    // Ajustar totales: se usan maxJugadores para aldeanos y maxRoles para lobos
    this.aliveVillagers = sala.maxJugadores;
    this.totalVillagers = sala.maxJugadores;
    this.aliveWolves = sala.maxRoles["Hombre lobo"] || 0;
    this.totalWolves = sala.maxRoles["Hombre lobo"] || 0;

    // Iniciar el flujo de juego
    this.startGameFlow();
  },
  beforeUnmount() {
    clearInterval(this.countdownInterval);
  },
  methods: {

    addMessage(message) {
      this.chatMessages.push(message); // Agregar mensaje al array de mensajes
    },
  
    getMyId() {
      const user = localStorage.getItem("usuario");
      return user ? JSON.parse(user).id : null;
    },

    // Retorna true si el jugador actual es la Vidente
    isVidente() {
      return this.chosenRole && this.chosenRole.nombre === "Vidente";
    },

    startGameFlow() {
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
      // Después de 30 s en game, se anuncia la votación del alguacil
      setTimeout(() => {
        this.currentPhase = "alguacil_announce";
        setTimeout(() => {
          this.startAlguacilVoting();
        }, 6000);
      }, 30000);
    },

    // Fase de votación del alguacil (se muestra en el contenido principal)
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

    // Al finalizar la votación, se calcula el ganador y se inicia el proceso nocturno
    endVotingPhase() {
      this.isVotingPhase = false;
      this.revealVotes = true;
      this.showVotesProgressively();
      const maxVotes = Math.max(...this.players.map((p) => p.votes));
      const winners = this.players.filter((p) => p.votes === maxVotes);
      this.alguacilWinnerIndex = winners[0]?.id || null;
      this.currentPhase = "alguacil_result";
      setTimeout(() => {
        this.startNightSequence();
      }, 6000);
    },

    /**
     * Inicia un contador (setInterval) que decrementa timeLeft cada segundo.
     * Al llegar a 0, se ejecuta endCallback.
     */
    startCountdown(endCallback) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(this.countdownInterval);
          endCallback && endCallback();
        }
      }, 1000);
    },

    /**
     * Encapsula TODO el proceso de la noche:
     * 1) Se muestra el overlay "night" y se activa el modo NOCHE.
     * 2) Se muestra el overlay "vidente_awaken" para TODOS.
     * 3) Luego:
     *    - Si el jugador es la Vidente, se cambia a la fase "vidente_action" (contenido principal) y se inicia un countdown de 40 s,
     *      mostrando además los botones "Pasar turno" y "Descubrir rol".
     *    - Si no es la Vidente, se muestra el overlay "ojo_cerrado" durante 40 s.
     * 4) Al finalizar, se vuelve a la fase "game" y se reinicia el estado.
     */
    startNightSequence() {
      // 1) Mostrar overlay de noche y activar modo NOCHE
      this.currentPhase = "night";
      this.currentPeriod = "NOCHE";
      setTimeout(() => {
        // 2) Mostrar overlay "vidente_awaken" para TODOS
        this.currentPhase = "vidente_awaken";
        setTimeout(() => {
          // 3) Diferenciar según el rol:
          if (this.isVidente()) {
            // Si es la Vidente, pasar a "vidente_action" y mostrar el contador de 40 s
            this.currentPhase = "vidente_action";
            // Inicializamos las propiedades para los botones
            this.hasPassedTurn = false;
            this.hasDiscoveredRole = false;
            this.isVotingPhase = true; // Para mostrar el CountdownTimer
            this.timeLeft = 40;
            this.startCountdown(() => {
              // Si se agota el tiempo sin acción, finalizamos la acción de la vidente
              this.finishVidenteAction();
            });
          } else {
            // Si no es la Vidente, se muestra el overlay "ojo_cerrado" durante 40 s
            this.currentPhase = "ojo_cerrado";
            setTimeout(() => {
              this.resetVotingState();
              this.currentPhase = "game";
            }, 40000);
          }
        }, 6000);
      }, 6000);
    },

    finishVidenteAction() {
      this.isVotingPhase = false;
      this.resetVotingState();
      this.currentPhase = "game";
    },

    handlePassTurn() {
      if (!this.hasPassedTurn && !this.hasDiscoveredRole) {
        this.hasPassedTurn = true;
        // Puedes agregar lógica extra aquí si es necesario
        this.finishVidenteAction();
      }
    },

    handleDiscoverRole() {
      if (!this.hasDiscoveredRole && !this.hasPassedTurn) {
        this.hasDiscoveredRole = true;
        // Aquí podrías agregar lógica para revelar el rol de algún jugador
        this.finishVidenteAction();
      }
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
  padding: 1.25rem 2.5rem;
  border-radius: 0.625rem;
  font-size: 1.5rem;
  z-index: 1000;
  box-shadow: 0 0 1.25rem rgba(0, 0, 0, 0.5);
}

/* Opcional: estilos para el contenedor de los botones de la vidente */
.vidente-buttons {
  position: absolute;
  top: 42rem; /* Ajusta según necesites */
  right: 5rem; /* Ajusta según tu layout */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 9999;
}
</style>
