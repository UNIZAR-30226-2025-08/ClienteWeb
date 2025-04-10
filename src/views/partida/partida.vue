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
        :selected-player-index="selectedPlayerIndex"
        :alguacil-voting-active="isVotingPhase"
        :reveal-votes="revealVotes"
        :reveal-index="revealIndex"
        @select-player="selectPlayer"
      />

      <!-- Contador: se muestra en fase "game_voting" y en "vidente_action" -->
      <CountdownTimer v-if="isVotingPhase" :time-left="timeLeft" />

      <!-- Botón de voto se muestra solo en fase de votación (y para quienes NO son la Vidente) -->
      <VoteButton
        v-if="isVotingPhase"
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
import { io } from "socket.io-client";
import socket from "../../utils/socket";

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

      // Chat
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

      idPartida: null, // NUEVO: Propiedad para almacenar el ID de la partida
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
    //Todos los sockets de escucha para eventos del backend
    //Los he dejado numerados en el orden que seguiran más omenos, luego se repetiran los eventos

    this.startGameFlow();

    // 1. Evento de espera inicial para comenzar la partida
    socket.on("esperaInicial", (data) => {
      console.log("Esperando para iniciar la partida:", data.mensaje);
      //this.currentPhase = "game";
      this.currentPeriod = "DÍA"; // Inicialmente es de día
      this.timeLeft = data.tiempo || 30; // Tiempo que nos envia el backend sino pongo el tiempo que de momento se ha estimado en backend (revisar partida.js o partidaws)
    });

    //2. Evento para iniciar la votación del alguacil
    socket.on("iniciarVotacionAlguacil", (data) => {
      console.log("Votación del alguacil iniciada", data);
      this.flujoVotacionAlguacil();
      //this.currentPhase = "game_voting";
      this.timeLeft = data.tiempo || 30; // Tiempo que nos envia el backend sino pongo el tiempo que de momento se ha estimado en backend (revisar partida.js o partidaws)
      this.isVotingPhase = true;
    });

    //3. Escuchar evento para el comienzo de la noche
    socket.on("nocheComienza", (data) => {
      console.log("La noche ha comenzado", data);
      this.currentPhase = "night";
      this.currentPeriod = "NOCHE";
    });

    //4. Escuchar evento para la habilidad de la vidente
    socket.on("habilidadVidente", (data) => {
      console.log("Habilidad de la vidente activada:", data.mensaje);
      if (this.isVidente()) {
        this.currentPhase = "vidente_action"; // Cambia a la fase correspondiente
        this.timeLeft = data.tiempo || 30; // Tiempo que nos envia el backend sino pongo el tiempo que de momento se ha estimado en backend (revisar partida.js o partidaws)
      } else {
        this.currentPhase = "ojo_cerrado"; // Cambia a la fase correspondiente para los demás jugadores
      }
      this.currentPeriod = "NOCHE"; // Cambiar a NOCHE si es necesario(Desconexion jugador? Preguntar a Oscar como lo quiere hacer)
      this.timeLeft = data.tiempo || 15; // Tiempo que nos envia el backend sino pongo el tiempo que de momento se ha estimado en backend (revisar partida.js o partidaws)
    });

    //5. Escuchar evento para el turno de los hombres lobo
    socket.on("turnoHombresLobos", (data) => {
      console.log("Turno de hombres lobos:", data.mensaje);
      this.currentPhase = "turno_hombres_lobos"; // Cambia a la fase correspondiente
      this.currentPeriod = "NOCHE"; // Cambiar a NOCHE si es necesario
      this.timeLeft = data.tiempo || 30; // Tiempo que nos envia el backend sino pongo el tiempo que de momento se ha estimado en backend (revisar partida.js o partidaws)
    });

    // 6. Evento que envía el resultado de los votos de la noche a cada jugador que corresponda
    socket.on("resultadoVotosNoche", (data) => {
      console.log("Resultado votos de noche:", data.mensaje);
    });

    // 7. Evento que notifica a la bruja con el mensaje y la víctima elegida por los lobos (Si la bruja existe)
    socket.on("mensajeBruja", (data) => {
      console.log(
        "Mensaje para la bruja:",
        data.mensaje,
        "Víctima:",
        data.victima
      );
      // En la UI, muestra la interfaz para que la bruja decida si curar o eliminar, mostrando los detalles
    });
    // 8. Evento para activar la habilidad de la bruja
    socket.on("habilidadBruja", (data) => {
      console.log("Habilidad de la bruja activada:", data.mensaje);
      this.currentPhase = //TODO: Desarrollar Bruja;
        this.timeLeft = data.tiempo || 30; // Tiempo que nos envia el backend sino pongo el tiempo que de momento se ha estimado en backend (revisar partida.js o partidaws)
      // Muestra en la interfaz de la bruja la acción para usar la poción (curar o matar)
    });

    // 9. Escuchar evento para pasar al día
    socket.on("diaComienza", (data) => {
      console.log("El día ha comenzado", data);
      this.currentPhase = "game";
      this.currentPeriod = "DÍA";
      this.timeLeft = data.tiempo || 60; // Tiempo que nos envia el backend sino pongo el tiempo que de momento se ha estimado en backend (revisar partida.js o partidaws)
    });

    // 10. Evento que notifica un empate en la votación del día y reinicia la votación
    socket.on("empateVotacionDia", (data) => {
      console.log("Primer empate en la votación diaria:", data.mensaje);
      // Muestra mensaje de empate y, si es necesario, resetea la UI para permitir una segunda votación
    });

    // 11. Evento que notifica el segundo empate en la votación del día (ningún jugador es eliminado)
    socket.on("segundoEmpateVotacionDia", (data) => {
      console.log("Segundo empate en la votación diaria:", data.mensaje);
      // Muestra mensaje de segundo empate y actualiza la UI para no eliminar a ningún jugador
    });

    // 12. Evento que envía el resultado de la votación del día (quién será eliminado)
    socket.on("resultadoVotosDia", (data) => {
      console.log("Resultado votación de día:", data.mensaje);
      if (data.jugadorAEliminar) {
        console.log("Jugador a eliminar:", data.jugadorAEliminar);
      }
      // Actualiza la UI para mostrar el resultado de la votación y la acción correspondiente (por ejemplo, marcar como eliminado al jugador)
    });

    // Escuchar la finalización de la partida
    socket.on("partidaFinalizada", (resultado) => {
      console.log("Partida finalizada", resultado);
      // Manejar el final de la partida mostrando mensaje y redirigiendo o actualizando el estado
    });
    const salaGuardada = localStorage.getItem("salaActual");
    if (!salaGuardada) {
      console.error("No se encontró la información de la sala");
      this.$router.push("/juego");
      return;
    }
    const sala = JSON.parse(salaGuardada);

    // Sincronizar la lista de jugadores
    this.players = sala.jugadores || [];

    // NUEVO: Asignar el ID de la partida (suponiendo que está en la propiedad "id" de la sala)
    const partidaGuardada = localStorage.getItem("partidaID");
    if (!partidaGuardada) {
      console.error("No se encontró la información de la partida");
      this.$router.push("/juego");
      return;
    }

    this.idPartida = JSON.parse(partidaGuardada);

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
    //this.startGameFlow();

    // NUEVO: Escuchar eventos del socket para actualizar el estado tras votar
    socket.on("votoRegistrado", (data) => {
      console.log("Voto registrado, estado de partida:", data.estado);
      if (data.estado && data.estado.jugadores) {
        this.players = data.estado.jugadores;
      }
    });
    socket.on("error", (mensajeError) => {
      console.error("Error recibido del servidor:", mensajeError);
    });
  },
  beforeUnmount() {
    socket.off("iniciarVotacionAlguacil");
    socket.off("nocheComienza");
    socket.off("diaComienza");
    socket.off("habilidadVidente");
    socket.off("habilidadBruja");
    socket.off("turnoHombresLobos");
    socket.off("mensajeBruja");
    socket.off("resultadoVotosNoche");
    socket.off("resultadoVotosDia");
    socket.off("empateVotacionDia");
    socket.off("segundoEmpateVotacionDia");
    socket.off("partidaFinalizada");
    socket.off("votoRegistrado");
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
            this.currentPhase = "game";
          }, 3000);
        }, 6000);
      }, 6000);
    },

    flujoVotacionAlguacil() {
      this.currentPhase = "alguacil_announce";
      setTimeout(() => {
        this.currentPhase = "game_voting";
        this.isVotingPhase = true;
        // this.timeLeft = 25;
        this.countdownInterval = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          } else {
            clearInterval(this.countdownInterval);
            this.endVotingPhase();
          }
        }, 1000);
      }, 6000);
    },
    ////////////////////////////////////////////////////////////////////////
    startMainGame() {
      this.currentPhase = "alguacil_announce";
      setTimeout(() => {
        this.startAlguacilVoting();
      }, 6000);
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

    ////////////////////////////////////////////////////////////////////////

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

    selectPlayer(playerId) {
      if (!this.isVotingPhase || this.hasVoted) return;
      // Si el jugador ya está seleccionado, lo deselecciona; de lo contrario, asigna el ID del jugador seleccionado
      this.selectedPlayerIndex =
        this.selectedPlayerIndex === playerId ? null : playerId;
    },

    //Método modificado para emitir la votación al servidor
    voteForPlayer() {
      if (this.selectedPlayerIndex && !this.hasVoted) {
        // Buscar el jugador objetivo por su ID
        const jugadorObjetivo = this.players.find(
          (player) => player.id === this.selectedPlayerIndex
        );
        if (!jugadorObjetivo || !jugadorObjetivo.id) {
          console.error("El jugador seleccionado no tiene un ID definido");
          return;
        }
        // Incrementar el contador de votos del jugador seleccionado
        jugadorObjetivo.votes++;
        console.log(
          `Jugador ${this.getMyId()} votó por el jugador ${jugadorObjetivo.id}`
        );
        // Emitir el evento "votar" al servidor con los datos necesarios
        socket.emit("votarAlguacil", {
          idPartida: this.idPartida,
          idJugador: this.getMyId(),
          idObjetivo: jugadorObjetivo.id,
        });

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
