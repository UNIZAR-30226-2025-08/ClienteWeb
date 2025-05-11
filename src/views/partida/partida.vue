<template>
  <!-- Contenedor principal: se aplica la clase "modo-noche" si currentPeriod es "NOCHE" -->
  <div
    class="partida-container"
    :class="{ 'modo-noche': currentPeriod === 'NOCHE' && !gameEnded }"
  >
    <FinalPartidaOverlay
      v-if="gameEnded"
      :Mensaje="MensajeGanadoresPartida"
      :ganador="BandoGanador"
      @exit="$router.push('../juego')"
    />
    <MuertoOverlay
      v-if="showDeathOverlay"
      @continue="handleContinueViewing"
      @exit="$router.push('../juego')"
    />
    <template v-else>
      <!-- Modal para mostrar la revelación de la vidente -->
      <div v-if="isModalVisible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h3>Revelación de la Vidente</h3>
          <p>{{ revelationMessage }}</p>
          <button @click="closeModal">Cerrar</button>
        </div>
      </div>

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
          :winnerName="AlguacilWinnerName"
        />
        <AlguacilEmpate v-else-if="currentPhase === 'alguacil_empate'" />
        <!-- SUCESION DE ALGUCIL GESTIONADA POR JUAN (EN PROCESO) -->

        <!-- Overlay de noche -->
        <NocheOverlay v-else-if="currentPhase === 'night'" :visible="true" />

        <!-- Overlays de la vidente -->
        <VidenteOverlay
          v-else-if="currentPhase === 'vidente_awaken'"
          :visible="true"
        />
        <VidenteDormirOverlay
          v-else-if="currentPhase === 'vidente_dormir'"
          @finish="onVidenteDormirFinished"
        />

        <!-- NUEVO -->
        <DespertarBruja v-else-if="currentPhase === 'despertar_bruja'" />

        <PocionMuerteUsadaOverlay
          v-else-if="currentPhase === 'pocion_muerte_usada'"
          :text="pocionMuerteMessage"
        />

        <PocimaVidaUsadaOverlay
          v-else-if="currentPhase === 'pocion_vida_usada'"
          :text="pocionVidaMessage"
        />

        <BrujaDormirOverlay
          v-else-if="currentPhase === 'bruja_dormir'"
          @finish="onBrujaDormirFinished"
        />

        <OjoCerradoOverlay
          v-else-if="currentPhase === 'ojo_cerrado'"
          :visible="true"
        />
        <DespertarHombresLobo
          v-else-if="currentPhase === 'despertar_hombres_lobo'"
        />
        <EstadoDurmiendo v-else-if="currentPhase === 'estado_durmiendo'" />
        <FinTurnoLobos v-else-if="currentPhase === 'fin_turno_lobos'" />

        <MuertesDuranteNocheOverlay
          v-else-if="currentPhase === 'recuento_muertes'"
          :victimas="victimasNombres"
        />
        <LinchazoOverlay
          v-else-if="currentPhase === 'recuento_linchazo'"
          :victimas="victimasNombres"
        />
        <EmpateDiaOverlay v-else-if="currentPhase === 'empate_dia'" />
        <EmpateSegundoDiaOverlay
          v-else-if="currentPhase === 'empate_dia_segundo'"
        />
        <VotacionesDiaOverlay v-else-if="currentPhase === 'votaciones_dia'" />

        <mensajeBrujaOverlay
          v-else-if="currentPhase === 'mensaje_burja'"
          :victimName="wolfVictimName"
        />

        <CazadorOverlay
          v-else-if="
            currentPhase === 'habilidad_cazador' &&
            isCazador() &&
            cazadorActual == MiId
          "
          :players="jugadoresDisponibles"
          @fire="handleCazadorFire"
          @continue="handleContinueViewing"
          @exit="$router.push('/juego')"
        />

        <CazadorAtacadoOverlay
          v-else-if="
            currentPhase === 'habilidad_cazador' && cazadorActual == MiId
          "
        />
        <SucesionAlguacilOverlay
          v-else-if="
            currentPhase === 'esperando_eleccion_sucesor' && !isAlguacil()
          "
        />
        <AlguacilEligeSucesor
          v-else-if="
            currentPhase === 'esperando_eleccion_sucesor' && isAlguacil()
          "
          :players="jugadoresDisponibles"
          @vote="handleVoteForSuccessor"
          @continue="handleContinueViewing"
          @exit="$router.push('/juego')"
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
          :MiPlayerNombre="MiNombre"
          :deadPlayers="deadPlayerIds"
          :selected-player-index="selectedPlayerIndex"
          :avatarMap="avatarMap"
          :defaultAvatar="defaultAvatar"
          :alguacil-id="alguacilId"
          :wolf-victim-id="nextWolfVictimId"
          :alguacil-voting-active="isVotingPhase"
          :reveal-votes="revealVotes"
          :reveal-index="revealIndex"
          @select-player="selectPlayer"
        />

        <!-- Nuevo bloque para la acción de la bruja (fase "habilidad_bruja") -->
        <div
          v-if="
            !isSpectator &&
            currentPhase === 'habilidad_bruja' &&
            isBruja() &&
            gameEnded == false
          "
          class="bruja-buttons"
        >
          <BotonBrujaVida @usar-pocima-vida="manejarPocimaVida" />
          <BotonBrujaMuerte @usar-pocima-muerte="manejarPocimaMuerte" />
          <TurnButton
            :has-passed="hasBrujaPassed"
            @pass="handlePassBrujaTurn"
          />
        </div>
        <div
          v-if="showReconnectOverlay"
          class="reconnect-overlay"
          :style="`
    --overlay-bg: url(${fondoOverlay});
    --wolf-svg: url(${loboSilhouette});
  `"
        >
          <div class="reconnect-content">
            <h2>Reconectando con el pueblo...</h2>
            <div class="reconnect-spinner">
              <img :src="spinnerIcon" alt="spinner" />
              <img :src="spinnerIcon" alt="spinner" />
              <img :src="spinnerIcon" alt="spinner" />
            </div>
            <p>Intento {{ reconnectAttempts + 1 }}</p>
          </div>
        </div>

        <!-- Contador: se muestra en fase "game_voting" y en "vidente_action" -->
        <CountdownTimer
          v-if="!isSpectator && isVotingPhase"
          :time-left="timeLeft"
        />

        <!-- Botón de voto se muestra solo en fase de votación (y para quienes NO son la Vidente) -->
        <VoteButton
          v-if="!isSpectator && isVotingPhase && currentPeriod === 'DÍA'"
          :selected-player-index="selectedPlayerIndex"
          :has-voted="hasVotedAlguacil"
          @vote="voteForPlayer"
        />
        <VoteButton
          v-else-if="!isSpectator && isVotingPhase && currentPeriod === 'NOCHE'"
          :selected-player-index="selectedPlayerIndex"
          :has-voted="LoboHavotado"
          @vote="voteForPlayer"
        />

        <!-- Nuevo bloque para la acción de la Vidente (fase "vidente_action") -->
        <div
          v-if="
            !isSpectator && currentPhase === 'vidente_action' && isVidente()
          "
          class="vidente-buttons"
        >
          <DiscoverRoleButton
            :has-discovered="hasVidenteActed"
            @discover="handleDiscoverRole"
          />
        </div>

        <!-- Mensaje cuando ya has votado -->
        <div
          v-if="
            (hasVotedAlguacil || LoboHavotado) && isVotingPhase && !isSpectator
          "
          class="vote-message"
        >
          Has votado a <strong>{{ votedPlayerName }}</strong>
        </div>

        <Chat
          v-if="!(currentPeriod === 'NOCHE' && (isVidente() || isBruja()))"
          :messages="chatMessages"
          @new-message="addMessage"
          :disabled="isSpectator"
          :isLobo="isLobo() && currentPhase === 'game_voting' && VotacionLobos"
        />
      </template>
    </template>
  </div>
</template>

<script>
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
import AlguacilEmpate from "../../views/partida/Overlay/AlguacilEmpate.vue";
import SucesionAlguacilOverlay from "../../views/partida/Overlay/SucesionAlguacilOverlay.vue";
import AlguacilEligeSucesor from "./Componentes/AlguacilEligeSucesor.vue";

import NocheOverlay from "../../views/partida/Overlay/InicioNocheOverlay.vue";
import VidenteOverlay from "../../views/partida/Overlay/VidenteOverlay.vue";
import VidenteDormirOverlay from "../../views/partida/Overlay/VidenteDormirOverlay.vue";
import OjoCerradoOverlay from "../../views/partida/Overlay/OjoCerradoOverlay.vue";

import TurnButton from "../../views/partida/Componentes/TurnButton.vue";
import DiscoverRoleButton from "../../views/partida/Componentes/DiscoverRoleButton.vue";

import Chat from "../../views/partida/Componentes/Chat.vue";

import DespertarBruja from "../../views/partida/Overlay/DespertarBruja.vue"; //NUEVO
//import BotonesBruja from "../../views/partida/Componentes/botonesBruja.vue";  // NUEVO

import BotonBrujaVida from "./Componentes/botonBrujaVida.vue";
import BotonBrujaMuerte from "./Componentes/botonBrujaMuerte.vue";
import PocionMuerteUsadaOverlay from "./Overlay/PocionMuerteUsada.vue";
import PocimaVidaUsadaOverlay from "./Overlay/PocimaVidaUsada.vue";
import BrujaDormirOverlay from "../../views/partida/Overlay/DormirBrujaOverlay.vue";

// Nuevos overlays para el turno de hombres lobo
import DespertarHombresLobo from "../../views/partida/Overlay/DespertarHombresLobo.vue";
import FinTurnoLobos from "../../views/partida/Overlay/FinTurnoLobos.vue";
import EstadoDurmiendo from "./Overlay/EstadoDurmiendo.vue";

import MuertesDuranteNocheOverlay from "./Overlay/MuertesDuranteNocheOverlay.vue";
import VotacionesDiaOverlay from "../../views/partida/Overlay/VotacionesDiaOverlay.vue";
import LinchazoOverlay from "./Overlay/LinchazoOverlay.vue";
import EmpateDiaOverlay from "../../views/partida/Overlay/EmpateDiaOverlay.vue";
import EmpateSegundoDiaOverlay from "../../views/partida/Overlay/EmpateSegundoDiaOverlay.vue";
import MuertoOverlay from "../../views/partida/Overlay/MuertoOverlay.vue";
import FinalPartidaOverlay from "../../views/partida/Overlay/FinalPartidaOverlay.vue";

import mensajeBrujaOverlay from "./Overlay/mensajeBrujaOverlay.vue";
import CazadorOverlay from "./Overlay/CazadorOverlay.vue";
import CazadorAtacadoOverlay from "./Overlay/CazadorAtacadoOverlay.vue";

import avatar1 from "../../assets/avatares/imagenPerfil.webp";
import avatar2 from "../../assets/avatares/imagenPerfil2.webp";
import avatar3 from "../../assets/avatares/imagenPerfil3.webp";
import avatar4 from "../../assets/avatares/imagenPerfil4.webp";
import avatar5 from "../../assets/avatares/imagenPerfil5.webp";
import avatar6 from "../../assets/avatares/imagenPerfil6.webp";
import avatar7 from "../../assets/avatares/imagenPerfil7.webp";
import avatar8 from "../../assets/avatares/imagenPerfil8.webp";
import defaultAvatar from "../../assets/profile_icon.jpg"; // Imagen por defecto
import fondoOverlay from "../../assets/fondo.png";
import loboSilhouette from "../../assets/peligro_lobo.png";
import spinnerIcon from "../../assets/CabezaLobo.webp";

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
    AlguacilEmpate,
    SucesionAlguacilOverlay,
    NocheOverlay,
    VidenteOverlay,
    VidenteDormirOverlay,
    BrujaDormirOverlay,
    OjoCerradoOverlay,
    TurnButton,
    DiscoverRoleButton,
    AlguacilEligeSucesor,
    DespertarHombresLobo,
    FinTurnoLobos,
    EstadoDurmiendo,
    DespertarBruja,
    BotonBrujaVida,
    BotonBrujaMuerte,
    PocionMuerteUsadaOverlay,
    PocimaVidaUsadaOverlay,
    MuertesDuranteNocheOverlay,
    VotacionesDiaOverlay,
    LinchazoOverlay,
    EmpateDiaOverlay,
    EmpateSegundoDiaOverlay,
    MuertoOverlay,
    mensajeBrujaOverlay,
    CazadorOverlay,
    CazadorAtacadoOverlay,
    FinalPartidaOverlay,
  },
  data() {
    return {
      // Fases posibles:
      // 'intro', 'role', 'start', 'alguacil_announce', 'game_voting', 'alguacil_result', 'alguacil_empate',
      // 'night', 'vidente_awaken', 'vidente_action', 'ojo_cerrado', 'game'
      pendingWolfData: null,
      currentPhase: "intro",
      isGameActive: false,
      isVotingPhase: false,
      isLynchPhase: false,
      LoboHavotado: false,
      isSpectator: false,
      hasFired: false,
      MiId: null,
      showDeathOverlay: false,
      showCazadorOverlay: false,
      showSucesionOverlay: false,
      showReconnectOverlay: false,
      reconnectAttempts: 0,
      // Variables del temporizador
      timeLeft: 60,
      countdownInterval: null,

      // Jugadores y votación
      players: [],

      avatarMap: {
        avatar1: avatar1,
        avatar2: avatar2,
        avatar3: avatar3,
        avatar4: avatar4,
        avatar5: avatar5,
        avatar6: avatar6,
        avatar7: avatar7,
        avatar8: avatar8,
      },
      defaultAvatar: defaultAvatar,
      selectedPlayerIndex: null,
      // Variable para el voto del alguacil
      hasVotedAlguacil: false,
      // Nueva variable de control para la acción de la vidente
      hasVidenteActed: false,
      hasAlguacilActed: false,
      revealVotes: false,
      revealIndex: 0,

      // Chat
      chatMessages: [],

      // Datos de rol y estado del juego
      cazadorActual: null,
      chosenRole: {},
      alguacilWinnerIndex: null,
      AlguacilWinnerName: null,
      MensajeSucesionAlguacil: "",
      idAlguacilMuerto: null,
      aliveVillagers: 5,
      totalVillagers: 6,
      aliveWolves: 2,
      totalWolves: 2,
      currentDay: 1,
      currentPeriod: "DÍA",

      // Nuevas propiedades para la acción de la Vidente
      hasPassedTurn: false,

      idPartida: null, // NUEVO: Propiedad para almacenar el ID de la partida

      // Propiedades para la cola de eventos
      eventQueue: [],
      isProcessing: false,

      //*****MODAL VIDENTE */
      messageInput: "",
      isModalVisible: false,
      revelationMessage: "",
      //**********************//

      pocionMuerteMessage: "",
      pocionMuerteUsada: false,

      pocionVidaMessage: "",
      pocionVidaUsada: false,

      hasBrujaPassed: false,

      alguacilId: null,
      nextWolfVictimId: null,

      victimas: [],
      victimasNombres: [],
      VotacionLobos: false,

      wolfVictimName: "",
      MensajeGanadoresPartida: "",
      gameEnded: false,
      BandoGanador: "",
      reconnectAttempts: 0,
      reconnectInterval: null,
      fondoOverlay,
      spinnerIcon,
      loboSilhouette,
      jugadoresDisponibles: [],
    };
  },
  watch: {
    // Arranca/parar el incremento cada 7 s según se muestre u oculte el overlay
    showReconnectOverlay(active) {
      if (active) {
        this.reconnectInterval = setInterval(() => {
          this.reconnectAttempts++;
        }, 7000);
      } else {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
        this.reconnectAttempts = 0; // opcional: reinicia contador al cerrar
      }
    },
  },
  computed: {
    /**
     * Se tratan como overlay las siguientes fases.
     * No se incluyen "game_voting" ni "vidente_action" para que se muestre el contenido principal.
     */
    isOverlayActive() {
      return (
        [
          "intro",
          "role",
          "start",
          "alguacil_announce",
          "alguacil_empate",
          "alguacil_result",
          "night",
          "vidente_awaken",
          "ojo_cerrado",
          "despertar_hombres_lobo",
          "despertar_bruja", //NUEVO
          "estado_durmiendo",
          "fin_turno_lobos",
          "pocion_muerte_usada",
          "pocion_vida_usada",
          "recuento_muertes",
          "recuento_linchazo",
          "empate_dia",
          "empate_dia_segundo",
          "votaciones_dia",
          "habilidad_cazador",
          "mensaje_burja",
          "esperando_eleccion_sucesor",
          "elegir_sucesor",
          "death",
          "game_over",
          "vidente_dormir",
          "bruja_dormir",
        ].includes(this.currentPhase) && !this.hasFired
      );
    },

    MiNombre() {
      return this.findPlayerNameById(this.MiId);
    },
    votedPlayerName() {
      const p = this.players.find((p) => p.id === this.selectedPlayerIndex);
      return p ? p.nombre : "—";
    },

    // NUEVO: IDs de jugadores muertos
    deadPlayerIds() {
      return this.players
        .filter((player) => player.estaVivo === false)
        .map((player) => player.id);
    },
  },
  mounted() {
    this.MiId = this.getMyId();
    this.idPartida = JSON.parse(localStorage.getItem("partidaID"));

    // Obtener el ID de la partida del localStorage
    const partidaGuardada = localStorage.getItem("partidaID");

    if (!partidaGuardada) {
      console.error("No se encontró la información de la partida");
      this.$router.push("/juego");
      return;
    }
    this.idPartida = JSON.parse(partidaGuardada);
    // 1. Registro el listener ANTES de emitir
    socket.on("estadoPartida", this.handleEstadoPartida);

    // 2. Asegurarme de que el socket está conectado
    if (!socket.connected) {
      socket.connect();
    }
    const joinKey = `joinedGame_${this.idPartida}`;
    const isFirstJoin = !sessionStorage.getItem(joinKey);

    socket.emit("actualizarSocketId", {
      idPartida: String(this.idPartida),
      idJugador: String(this.MiId),
      socketId: socket.id,
    });
    if (isFirstJoin) {
      // He metido en el sessionStorage una clave valor para saber si es la primera vez que entramos
      sessionStorage.setItem(joinKey, "true");
    } else {
      // recargas, vuelves atrás y entras de nuevo, caídas de red, etc.
      socket.emit("reconectarPartida", {
        idPartida: String(this.idPartida),
        idUsuario: String(this.MiId),
      });
    }

    // Añadir log para debug
    console.log("Socket ID actual:", socket.id);
    console.log("Socket ID anterior:", localStorage.getItem("miSocketId"));
    console.log("ID Partida:", this.idPartida);

    //Todos los sockets de escucha para eventos del backend
    //Los he dejado numerados en el orden que seguiran más omenos, luego se repetiran los eventos
    //this.startGameFlow();
    // 1. Evento de espera inicial para comenzar la partida
    socket.on("esperaInicial", (data) => {
      console.log("Esperando para iniciar la partida:", data.mensaje);
      this.currentPeriod = "DÍA"; // Inicialmente es de día
      this.timeLeft = data.tiempo || 30; // Tiempo que nos envia el backend sino pongo el tiempo que de momento se ha estimado en backend (revisar partida.js o partidaws)
      this.startGameFlow();
    });

    //2. Evento para iniciar la votación del alguacil
    socket.on("iniciarVotacionAlguacil", (data) => {
      console.log("Votación del alguacil iniciada", data);
      this.flujoVotacionAlguacil();
      this.timeLeft = 24; // Tiempo que nos envia el backend sino pongo el tiempo que de momento se ha estimado en backend (revisar partida.js o partidaws)
      this.isVotingPhase = true;
    });
    //3. Evento que notifica en caso de empate en la votación del alguacil
    socket.on("empateVotacionAlguacil", (data) => {
      console.log("Empate en la votación del alguacil:", data.mensaje);
      this.timeLeft = data.tiempo - 5 || 29; //Cuadrar los tiempos con
      this.flujoVotacionAlguacilEmpate();
      this.timeLeft = data.tiempo || 30;
      this.resetVotingState(); // Reseteamos el estado para permitir votar de nuevo
      this.isVotingPhase = true;
    });

    // 4. Evento: resultado de votación del alguacil
    socket.on("alguacilElegido", (data) => {
      console.log("Recibo el alguacil elegido");
      this.addEventToQueue({ type: "alguacilElegido", data });
    });

    // 5. Evento: comienzo de la noche
    socket.on("nocheComienza", (data) => {
      this.addEventToQueue({ type: "nocheComienza", data });
    });

    // 6. Evento: habilidad de la vidente
    socket.on("habilidadVidente", (data) => {
      console.log("Habilidad de la vidente activada:", data);
      this.addEventToQueue({ type: "habilidadVidente", data });
    });

    // Evento que recibes para saber rol del jugador antes de los lobos
    // Listener para el resultado de la acción de la vidente (revelación)
    socket.on("visionJugador", (data) => {
      console.log("Resultado de la revelación de la vidente:", data);
      // Mostrar el modal con la información recibida y esperar antes de cerrar
      this.showRevelationModal(`${data.mensaje}`);
    });

    // 7. Evento: turno de los hombres lobo
    socket.on("turnoHombresLobos", (data) => {
      console.log("Turno de los hombres lobo:", data);
      // espera los 5s que quieras antes de encolar
      setTimeout(() => {
        this.addEventToQueue({ type: "turnoHombresLobos", data });
      }, 5000);
    });

    //8. Evento que envía el resultado de los votos de la noche a cada jugador que corresponda
    socket.on("resultadoVotosNoche", (data) => {
      this.resetVotingState(); //si quitais esto consultar JUAN, SINO SE QUEDA PRESELECCIONADO LA VOTACION EN EL CASO DE LOS LOBOS
      console.log(data);
      // 1) Cancelamos la fase de votación
      this.isVotingPhase = false;
      // 2) Mostramos al instante el overlay de "fin_turno_lobos"
      this.changePhase("fin_turno_lobos");
      // 3) Tras la duración del overlay (6s), pasamos a la fase de bruja (si existe) o al juego
      setTimeout(() => {
        if (this.isBruja()) {
          // si eres bruja, despertamos su overlay
          this.changePhase("despertar_bruja");
        } else {
          // si no, volvemos al juego
          this.changePhase("game");
        }
      }, 6000);
    });

    //9. Evento que notifica a la bruja con el mensaje y la víctima elegida por los lobos (Si la bruja existe)
    socket.on("mensajeBruja", (data) => {
      console.log("Mensaje para la bruja:", data);
      this.addEventToQueue({ type: "loboAttack", data });
    });

    //10. Evento para activar la habilidad de la bruja
    socket.on("habilidadBruja", (data) => {
      this.addEventToQueue({ type: "habilidadBruja", data });
      //console.log("Habilidad de la bruja activada:", data.mensaje);
    });

    socket.on("habilidadCazador", (data) => {
      console.log("Habilidad de cazador activada:", data.mensaje);
      this.addEventToQueue({ type: "habilidadCazador", data });
      this.cazadorActual = data.cazadorActual; // Actualiza la lista de cazadores muertos
      console.log(
        "Jugadores disponibles para el cazador:",
        data.jugadoresDisponibles
      );
    });

    //11. Escuchar evento para pasar al día
    socket.on("diaComienza", (data) => {
      // Eliminar icono de próxima víctima al inicio del día
      this.nextWolfVictimId = null;
      this.showCazadorOverlay = false;
      this.showSucesionOverlay = false;
      console.log("El día ha comenzado", data);

      //this.changePhase("intro");

      // Actualizar la lista de víctimas con la información completa
      this.victimas = data.victimas || [];
      this.victimasNombres = this.victimas.map((victima) => ({
        id: victima.id,
        nombre: victima.nombre,
        rol: victima.rol,
        esAlguacil: victima.esAlguacil,
      }));

      // Extraer los IDs de las víctimas
      const victimasIds = this.victimas.map((victima) => victima.id);

      // Actualizar el estado de los jugadores
      this.victimas.forEach((victima) => {
        const p = this.players.find((pl) => pl.id == victima.id);
        if (p) {
          p.estaVivo = false;
          this.aliveVillagers--;
          if (p.rol === "Hombre lobo") this.aliveWolves--;
        }
      });

      // Si tú has muerto, pasas a espectador y sales al overlay de muerte
      if (victimasIds.includes(this.MiId)) {
        return this.markDead();
      }
      
      this.changePhase("recuento_muertes");

      setTimeout(() => {
        // 1) Overlay de recuento de muertes
        this.showDeathOverlay = false;
        this.changePhase("intro");

        // 2) Tras 8 s arrancas el día (charla libre)
        setTimeout(() => {
          this.changePhase("game");
          this.currentPeriod = "DÍA";
          this.timeLeft = data.tiempo || 60;

          // 3) Espera 30 s de charla libre…
          setTimeout(() => {
            // 4) Muestras overlay de votaciones de día
            this.changePhase("votaciones_dia");
            if (this.countdownInterval) {
              clearInterval(this.countdownInterval);
            }
            // 5) Tras unos segundos (o instantáneo), habilita la votación
            setTimeout(() => {
              this.isVotingPhase = true;
              this.isLynchPhase = true; // activamos linchamiento
              this.hasVotedAlguacil = false; // reseteamos para usarlo como "hasVotedLynch"
              this.timeLeft = 46;
              this.changePhase("game");
              this.countdownInterval = setInterval(() => {
                if (this.timeLeft > 0) {
                  this.timeLeft--;
                } else {
                  clearInterval(this.countdownInterval);
                }
              }, 1000);
            }, 5000);
          }, 3000); // 3 s y vamos a las votaciones
        }, 8000); // 8 s de recuento de muertes
      }, 8000);
    });

    //12. Evento que notifica un empate en la votación del día y reinicia la votación
    socket.on("empateVotacionDia", (data) => {
      console.log("Empate en la votación del día:", data.mensaje);
      this.addEventToQueue({ type: "empateDia", data });
    });

    //13. Evento que notifica el segundo empate en la votación del día (ningún jugador es eliminado)
    socket.on("segundoEmpateVotacionDia", (data) => {
      console.log("Segundo empate en la votación del día:", data.mensaje);
      this.addEventToQueue({ type: "empateSegundoDia", data });
    });

    //14. Evento que envía el resultado de la votación del día (quién será eliminado)
    socket.on("resultadoVotosDia", (data) => {
      console.log(
        "Resultado votación de día:",
        data.mensaje,
        "Víctima:",
        data.jugadorAEliminar,
        "Rol:",
        data.rolJugadorAEliminar
      );
      this.addEventToQueue({ type: "resultadoVotosDia", data });
    });

    // Escuchar la finalización de la partida
    socket.on("partidaFinalizada", (resultado) => {
      //Juan: Vacio la cola al finalizar partida para que no me cambie de fase y no pierda el overlay del final de la partida
      this.showDeathOverlay = false;
      this.showCazadorOverlay = false;
      this.showSucesionOverlay = false;
      this.isVotingPhase = false;
      this.gameEnded = true;
      this.eventQueue = [];
      this.isProcessing = false;
      console.log("Partida finalizada", resultado);
      this.BandoGanador = resultado.ganador;
      this.MensajeGanadoresPartida = resultado.mensaje;
      const key = `joinedGame_${this.idPartida}`;
      sessionStorage.removeItem(key);
      this.changePhase("game_over");
      //Limpio también cuentas atras que pudiesen haber pendientes
      clearInterval(this.countdownInterval);
      this.currentPeriod = "FIN";
      //En desarrollo
      sessionStorage.removeItem("gameFlowStarted"); // Limpiar el flag al terminar
    });
    const salaGuardada = localStorage.getItem("salaActual");
    if (!salaGuardada) {
      console.error("No se encontró info de la sala");
      this.$router.push("/juego");
      return;
    }
    const sala = JSON.parse(salaGuardada);
    const maxJugadores = sala.maxJugadores ?? sala.jugadores.length;

    this.players = sala.jugadores || [];
    this.aliveVillagers = maxJugadores;
    this.totalVillagers = maxJugadores;
    this.aliveWolves = sala.maxRoles?.["Hombre lobo"] ?? 0;
    this.totalWolves = sala.maxRoles?.["Hombre lobo"] ?? 0;

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
    socket.on("mensajeChat", ({ nombre, mensaje, timestamp }) => {
      this.chatMessages.push({
        username: nombre,
        content: mensaje,
        time: timestamp,
      });
    });

    socket.on("mensajePrivado", ({ nombre, mensaje, timestamp }) => {
      // si quieres diferenciar el chat de lobos
      console.log("Mensaje privado recibido:", { nombre, mensaje, timestamp });
      this.chatMessages.push({
        username: `${nombre} (lobo)`,
        content: mensaje,
        time: timestamp,
      });
    });

    socket.on("habilidadAlguacil", (data) => {
      console.log("Habilidad de alguacil activada:", data.mensaje);
      console.log("ID del alguacil muerto:", data.idAlguacil);
      this.idAlguacilMuerto = data.idAlguacil;
      this.addEventToQueue({ type: "eleccion_sucesor", data });
    });

    socket.on("pasarTurnoBruja", (data) => {
      console.log("Turno de la bruja pasado:", data.mensaje);
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
    socket.off("habilidadAlguacil");
    socket.off("votoRegistrado");
    socket.off("connect");
    sessionStorage.removeItem("gameFlowStarted");
    clearInterval(this.countdownInterval);
    clearInterval(this.reconnectInterval); // limpia el interval si aún está activo
  },
  methods: {
    handleEstadoPartida(data) {
      this.showReconnectOverlay = true;
      // 1) Rehidrato todo
      this.currentDay = data.numJornada;
      this.currentPhase = data.faseActual;
      this.currentPeriod = data.turno; // "DÍA" o "NOCHE"
      this.timeLeft = data.tiempoRestante;
      this.players = data.listaJugadores;
      this.totalVillagers = data.totalAldeanos;
      this.aliveVillagers = data.aldeanosVivos;
      this.totalWolves = data.totalLobos;
      this.aliveWolves = data.lobosVivos;
      if (this.players.some((p) => p.id === this.MiId && !p.estaVivo)) {
        this.markDead(); // Forzar overlay de muerte si está muerto
      }
      // 2) Arranco o paro el contador según fase actual  NO SE SI HACE FALTA
      if (this._isPhaseConTemporizador(data.faseActual)) {
        this.isVotingPhase = true;
        this.startCountdown();
      } else {
        this.isVotingPhase = false;
        clearInterval(this.countdownInterval);
      }

      // 3) Limpio la cola de eventos pendientes (por si venían de antes)
      this.eventQueue = [];
      this.isProcessing = false;
    },
    // Helper para saber si esa fase lleva countdown…     PUEDE QUE NO SIRVA DE NADA
    // pero lo dejo por si acaso
    _isPhaseConTemporizador(phase) {
      return [
        "game_voting",
        "vidente_action",
        "habilidad_bruja",
        "alguacil_announce",
        // etc. las fases que usan timeLeft
      ].includes(phase);
    },
    changePhase(newPhase) {
      //console.log(`showDeathOverlay es: ${this.showDeathOverlay}`);
      //console.log(`showCazadorOverlay es: ${this.showCazadorOverlay}`);
      //console.log(`showSucesionOverlay es: ${this.showCazadorOverlay}`);
      //this.showReconnectOverlay = false; // Ocultar overlay de reconexión al cambiar de fase
      this.currentPhase = newPhase;
      console.log("Cambio de fase:", newPhase);
    },
    isCazador() {
      return this.chosenRole && this.chosenRole.nombre === "Cazador";
    },
    isAlguacil() {
      return this.MiId == this.idAlguacilMuerto;
    },
    markDead() {
      this.isSpectator = true; // El jugador se convierte en espectador

      // Verificar si el jugador que murió es el cazador o el alguacil
      if (this.isCazador()) {
        //this.showCazadorOverlay = true;
      } else if (this.isAlguacil()) {
        this.showSucesionOverlay = true;
      } else {
        this.changePhase("death");
        this.showDeathOverlay = true;
      }
    },
    // Función auxiliar: pausa la ejecución
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    findPlayerNameById(id) {
      const p = this.players.find((player) => player.id == id);
      return p ? p.nombre : "Desconocido";
    },

    IsPlayerDead(id) {
      const player = this.players.find((p) => p.id == id);
      return player ? !player.estaVivo : false;
    },

    // Agrega un evento a la cola y, si no se está procesando, comienza a procesarla
    addEventToQueue(event) {
      this.eventQueue.push(event);
      if (!this.isProcessing) {
        this.processQueue();
      }
    },

    // Procesa cada evento en cola con una espera de 5 segundos entre cada uno
    async processQueue() {
      this.isProcessing = true;
      while (this.eventQueue.length > 0) {
        if (this.currentPhase === "game_over") break; // Si la partida ha terminado, no procesamos más eventos
        const event = this.eventQueue.shift();
        this.processSocketEvent(event);
        await this.sleep(5000); // Espera 5 segundos
      }
      this.isProcessing = false;
    },

    // Procesa el evento en base a su tipo
    async processSocketEvent(event) {
      switch (event.type) {
        case "alguacilElegido":
          console.log("Procesando en cola: alguacilElegido", event.data);
          this.alguacilWinnerIndex = Number(event.data.alguacil);
          this.alguacilId = Number(event.data.alguacil);
          this.AlguacilWinnerName = this.findPlayerNameById(
            this.alguacilWinnerIndex
          );
          this.endVotingPhase();
          this.resetVotingState();
          this.hasVotedAlguacil = true;
          break;
        case "nocheComienza":
          this.hasVotedAlguacil = false;
          this.showCazadorOverlay = false;
          this.showSucesionOverlay = false;
          console.log("Procesando en cola: nocheComienza", event.data);
          this.changePhase("night");
          this.currentPeriod = "NOCHE";
          break;
        case "habilidadVidente":
          this.endVotingPhase();
          console.log("Procesando en cola: habilidadVidente", event.data);
          this.handleHabilidadVidente();
          this.currentPeriod = "NOCHE";
          this.timeLeft = event.data.tiempo || 15;
          this.resetVotingState();
          break;
        case "turnoHombresLobos":
          this.pendingWolfData = event.data;
          // Comprobamos si hay algún vidente vivo
          const hayVidentesVivos = this.players.some(function (jugador) {
            return jugador.rol === "Vidente" && jugador.estaVivo;
          });

          // Si hay videntes vivos, cambiamos la fase a "vidente_dormir"
          if (hayVidentesVivos) {
            this.changePhase("vidente_dormir");
          } else {
            // Si no quedan videntes vivos, puedes cambiar a otra fase o hacer alguna otra acción
            console.log("No quedan videntes vivos. No se cambia a la fase 'vidente_dormir'.");
            // 2) pasamos ya al despertar de lobos
            this.changePhase("despertar_hombres_lobo");
            this.currentPeriod = "NOCHE";

            // 3) lanzamos la lógica de turno de lobos con los datos guardados
            if (this.pendingWolfData) {
              this.handleTurnoHombresLobo(this.pendingWolfData);
              this.resetVotingState();
              this.pendingWolfData = null;
            }
          }
          break;
        case "habilidadBruja":
          this.changePhase("despertar_bruja");
          setTimeout(() => {
            if (this.currentPeriod === "DÍA") return; // Se debería de quitar pero es necesario la funcionalidad de no recibir sockets de roles que no existan en la partida
            if (this.isBruja()) {
              this.changePhase("habilidad_bruja");
              this.timeLeft = event.data.tiempo || 30; // Tiempo que nos envia el backend sino pongo el tiempo que de momento se ha estimado en backend (revisar partida.js o partidaws)
            } else {
              this.currentPhase = "estado_durmiendo"; // Cambia a la fase correspondiente para los demás jugadores
            }
          }, 3000);
          this.timeLeft = event.data.tiempo || 30;
          this.resetVotingState();
          this.hasBrujaPassed = false;
          break;
        case "resultadoVotosDia":
          // 1) Actualizar víctimas
          // Actualizar la información de la víctima con su rol
          const jugadorAEliminar = this.players.find(
            (p) => p.id == event.data.jugadorAEliminar
          );
          if (jugadorAEliminar) {
            this.victimas = [
              {
                id: jugadorAEliminar.id,
                nombre: jugadorAEliminar.nombre,
                rol: event.data.rolJugadorAEliminar,
                esAlguacil: jugadorAEliminar.esAlguacil,
              },
            ];
            this.victimasNombres = this.victimas;
          }
          // 2) Mostrar overlay de muertes (reutilizamos el de noche)
          this.changePhase("recuento_linchazo");
          // 3) Marcar al jugador como muerto en tu estado
          const eliminadoId = event.data.jugadorAEliminar;
          this.players = this.players.map((pl) =>
            pl.id == eliminadoId ? { ...pl, estaVivo: false } : pl
          );
          this.aliveVillagers--;

          if (eliminadoId == this.MiId) {
            this.markDead(); // Aquí es donde llamas al método markDead
          }

          // 4) Tras X segundos, volver al ciclo normal (día->noche)
          setTimeout(() => {
            this.changePhase("game");
            this.currentPeriod = "NOCHE";
            // reinicia banderas si hace falta
            this.resetVotingState();
          }, 5000);
          break;
        case "empateDia":
          this.resetVotingState();
          this.changePhase("empate_dia");

          // esperar que termine la animación
          await this.sleep(5000);
          // reiniciar votación de día
          this.changePhase("game");

          this.isVotingPhase = true;
          this.isLynchPhase = true;
          if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
          }
          this.timeLeft = 25;
          this.countdownInterval = setInterval(() => {
            if (this.timeLeft > 0) {
              this.timeLeft--;
            } else {
              clearInterval(this.countdownInterval);
              //TODO: he quitado lo de pasar al endingvoting phase porque lo hago cuando llega el socket de que ha acabado la votacion
            }
          }, 1000);
          break;
        case "empateSegundoDia":
          this.resetVotingState();
          this.changePhase("empate_dia_segundo");
          await this.sleep(5000);
          // ya no repetimos voto
          this.changePhase("game");
          this.isVotingPhase = false;
          this.isLynchPhase = false;
          break;

        case "loboAttack":
          // obtenemos el nombre de la víctima
          const victimId = Number(event.data.victima);
          this.nextWolfVictimId = victimId;
          this.wolfVictimName = this.findPlayerNameById(victimId);
          this.changePhase("mensaje_burja");
          // tras 6s pasamos a la fase de habilidad de la bruja (si la hay)
          setTimeout(() => {
            if (this.isBruja()) {
              this.changePhase("despertar_bruja");
            } else {
              this.changePhase("game");
            }
          }, 6000);
          break;
        case "habilidadCazador":
          this.changePhase("habilidad_cazador");
          this.showCazadorOverlay = true;
          this.timeLeft = event.data.tiempo || 30;
          this.jugadoresDisponibles = event.data.jugadoresDisponibles || [];
          break;
        case "eleccion_sucesor":
          this.changePhase("esperando_eleccion_sucesor");
          this.showSucesionOverlay = true;
          this.timeLeft = event.data.tiempo || 30;
          this.jugadoresDisponibles = event.data.jugadoresDisponibles || [];
          break;
        default:
          console.warn("Evento desconocido en cola", event);
      }
    },

    handleContinueViewing() {
      // quita overlay, pero mantiene isSpectator = true
      this.showDeathOverlay = false;
      this.showCazadorOverlay = false;
      this.showSucesionOverlay = false;
      this.changePhase("game");
    },
    addMessage(message) {
      if (this.isSpectator) return; // No envíes mensajes si eres espectador

      // Envía al servidor - el backend se encarga de determinar si es mensaje privado de lobos o no
      socket.emit("enviarMensaje", {
        idPartida: this.idPartida,
        idJugador: this.getMyId(),
        mensaje: message.content,
      });
      // No empujes aquí: lo recibirás de vuelta por socket.on('mensajeChat') o socket.on('mensajePrivado')
    },
    EnviarSucesorAlguacil() {
      const idSucesor = this.selectedPlayerIndex.toString();
      // Enviar el ID del sucesor al servidor
      socket.emit("elegirSucesor", {
        idPartida: this.idPartida,
        idJugador: this.getMyId(),
        idSucesor: idSucesor,
      });
      // Cambiar la fase a "game" y ocultar el overlay de elección de sucesor
      this.changePhase("game");
      this.showDeathOverlay = false;
    },

    getMyId() {
      const user = localStorage.getItem("usuario");
      return user ? JSON.parse(user).id : null;
    },

    // Retorna true si el jugador actual es la Vidente
    isVidente() {
      return this.chosenRole && this.chosenRole.nombre === "Vidente";
    },
    //NUEVO
    isBruja() {
      return this.chosenRole && this.chosenRole.nombre === "Bruja";
    },

    // Devuelve true si el jugador es un Hombre Lobo
    isLobo() {
      return (
        this.chosenRole &&
        this.chosenRole.nombre &&
        this.chosenRole.nombre.toLowerCase() === "hombre lobo"
      );
    },

    startGameFlow() {
      setTimeout(() => {
        this.changePhase("role");
        setTimeout(() => {
          this.changePhase("start");
          setTimeout(() => {
            this.changePhase("game");
          }, 3000);
        }, 6000);
      }, 6000);
    },

    flujoVotacionAlguacil() {
      this.changePhase("alguacil_announce");
      setTimeout(() => {
        this.changePhase("game_voting");
        this.isVotingPhase = true;
        this.timeLeft = 50;
        this.countdownInterval = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          } else {
            clearInterval(this.countdownInterval);
            //TODO: he quitado lo de pasar al endingvoting phase porque lo hago cuando llega el socket de que ha acabado la votacion
          }
        }, 1000);
      }, 6000);
    },

    flujoVotacionAlguacilEmpate() {
      this.changePhase("alguacil_empate");
      this.hasVotedAlguacil = false; // Reseteamos el voto para permitir votar de nuevo
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
      setTimeout(() => {
        this.changePhase("game_voting");
        this.isVotingPhase = true;
        this.timeLeft = 50;
        this.countdownInterval = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          } else {
            clearInterval(this.countdownInterval);
            //TODO: he quitado lo de pasar al endingvoting phase porque lo hago cuando llega el socket de que ha acabado la votacion
          }
        }, 1000);
      }, 6000);
    },

    // Al finalizar la votación, se calcula el ganador y se inicia el proceso nocturno
    endVotingPhase() {
      this.isVotingPhase = false;
      this.revealVotes = true;
      this.showVotesProgressively();
      this.changePhase("alguacil_result");
    },

    /**
     * Inicia un contador (setInterval) que decrementa timeLeft cada segundo.
     * Al llegar a 0, se ejecuta endCallback.
     */
    startCountdown(endCb) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(this.countdownInterval);
          endCb && endCb();
        }
      }, 1000);
    },

    handleHabilidadVidente() {
      this.changePhase("vidente_awaken");

      setTimeout(() => {
        if (this.isVidente()) {
          // Resetea la variable de control para la vidente al entrar en esta fase
          this.hasVidenteActed = false;
          this.changePhase("vidente_action");
          this.timeLeft = 30;
        } else {
          this.changePhase("ojo_cerrado");
        }
      }, 6000);
    },
    handleHabilidadAlguacil() {
      if (this.MiId === this.idAlguacilMuerto) {
        this.changePhase("elegir_sucesor");
        this.hasAlguacilActed = false;
        this.timeLeft = 30;
      } else {
        this.changePhase("esperando_eleccion_sucesor");
      }
    },
    onVidenteDormirFinished() {
      // 2) pasamos ya al despertar de lobos
      this.changePhase("despertar_hombres_lobo");
      this.currentPeriod = "NOCHE";

      // 3) lanzamos la lógica de turno de lobos con los datos guardados
      if (this.pendingWolfData) {
        this.handleTurnoHombresLobo(this.pendingWolfData);
        this.resetVotingState();
        this.pendingWolfData = null;
      }
    },
    onBrujaDormirFinished() {},

    finishVidenteAction() {
      this.isVotingPhase = false;
      this.resetVotingState();
      this.changePhase("game");
    },

    handleTurnoHombresLobo(data) {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
      console.log("Turno de hombres lobos:", data.mensaje);
      // 1) Mostrar despertar
      this.changePhase("despertar_hombres_lobo");
      this.currentPeriod = "NOCHE";

      setTimeout(() => {
        // 2) Abrir votación si eres lobo o "durmiendo" si no lo eres
        if (this.isLobo()) {
          this.LoboHavotado = false;
          this.VotacionLobos = true;
          this.changePhase("game_voting");
          this.isVotingPhase = true;
        } else {
          this.changePhase("estado_durmiendo");
        }
        this.timeLeft = 50;
        this.countdownInterval = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          } else {
            clearInterval(this.countdownInterval);
            //TODO: he quitado lo de pasar al endingvoting phase porque lo hago cuando llega el socket de que ha acabado la votacion
          }
        }, 1000);
        // **Ya no esperes N segundos** ni programes aquí el fin de turno:
        // el socket.on('resultadoVotosNoche') lo manejará en cuanto llegue.
      }, 6000);
    },

    handlePassTurn() {
      if (!this.hasVidenteActed) {
        this.hasVidenteActed = true;
        this.finishVidenteAction();
      }
    },

    manejarPocimaVida() {
      // Verifica si existe una víctima de los lobos
      if (!this.wolfVictimName) {
        alert("No hay ninguna víctima de los lobos en este momento.");
        return;
      }

      // Busca al jugador víctima en el array de jugadores
      const jugadorSeleccionado = this.players.find(
        (player) => player.nombre === this.wolfVictimName
      );
      if (!jugadorSeleccionado) {
        alert("El jugador seleccionado no existe.");
        return;
      }

      // Emite el evento "usaPocionBruja" con tipo "curar"
      socket.emit("usaPocionBruja", {
        idPartida: this.idPartida, // ID de la partida actual
        idJugador: String(this.getMyId()), // ID de la bruja
        tipo: "curar", // Tipo de acción: curar (poción de vida)
        idObjetivo: String(jugadorSeleccionado.id), // ID del jugador seleccionado
      });

      console.log("Se ha enviado la solicitud para usar la Poción de Vida.");

      if (this.pocionVidaUsada === false) {
        // Asigna el mensaje a mostrar en el overlay
        this.pocionVidaMessage = `Has decidido usar la pócima de vida con el jugador ${this.wolfVictimName}`;
        // Cambia la fase para mostrar el overlay correspondiente
        this.changePhase("pocion_vida_usada");

        this.pocionVidaUsada = true;
        // Limpia la selección
        this.selectedPlayerIndex = null;
        // Después de 3 segundos se regresa a la fase de habilidad de bruja
        setTimeout(() => {
          this.changePhase("habilidad_bruja");
        }, 3000);
      } else {
        alert("La pócima de vida ya ha sido usada");
      }
    },

    manejarPocimaMuerte() {
      // Verifica que se haya seleccionado un jugador objetivo
      if (!this.selectedPlayerIndex) {
        alert(
          "Por favor, selecciona un jugador objetivo para usar la Poción de Muerte."
        );
        return;
      }

      // Emite el evento "usaPocionBruja" al backend con los datos necesarios
      socket.emit("usaPocionBruja", {
        idPartida: this.idPartida, // ID de la partida actual
        idJugador: this.getMyId(), // ID del jugador actual (la bruja)
        tipo: "matar", // Indica que se usa la opción "matar" (poción de muerte)
        idObjetivo: this.selectedPlayerIndex, // ID del jugador objetivo seleccionado
      });

      console.log("Se ha enviado la solicitud para usar la Poción de Muerte.");

      if (this.pocionMuerteUsada == false) {
        this.pocionMuerteMessage = `Has decidido usar la poción de muerte con el jugador ${this.selectedPlayerIndex}`;
        this.changePhase("pocion_muerte_usada");
        this.pocionMuerteUsada = true;
        this.selectedPlayerIndex = null;
        setTimeout(() => {
          this.changePhase("habilidad_bruja");
        }, 3000);
      } else {
        alert("Esta poción ya ha sido usada");
      }
    },
    handleCazadorFire(targetId) {
      socket.emit("cazadorDispara", {
        idPartida: this.idPartida,
        idJugador: this.getMyId(),
        idObjetivo: targetId,
      });
      this.showCazadorOverlay = false;
    },

    handleVoteForSuccessor(targetId) {
      socket.emit("elegirSucesor", {
        idPartida: this.idPartida,
        idJugador: this.getMyId(),
        idObjetivo: targetId,
      });
      this.showSucesionOverlay = false;
    },
    handleDiscoverRole() {
      if (!this.hasVidenteActed) {
        if (this.selectedPlayerIndex) {
          socket.emit("videnteRevela", {
            idPartida: this.idPartida,
            idJugador: this.getMyId(),
            idObjetivo: this.selectedPlayerIndex,
          });
          this.hasVidenteActed = true;
          this.selectedPlayerIndex = null;
          // Se espera respuesta del backend para continuar
        } else {
          alert("Por favor, selecciona un jugador para descubrir su rol.");
        }
      }
    },

    // Muestra el modal de la revelación de la vidente
    showRevelationModal(message) {
      this.revelationMessage = message;
      this.isModalVisible = true;
      setTimeout(() => {
        this.closeModal();
        if (this.currentPhase === "vidente_action") {
          this.finishVidenteAction(); // Cambia a la fase de juego después de mostrar el mensaje
        }
      }, 5000);
    },

    closeModal() {
      this.isModalVisible = false;
      this.revelationMessage = "";
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

    // Permite la selección de un jugador. Se utiliza una variable de control separada según la fase.
    selectPlayer(playerId) {
      if (this.isSpectator) return; // No permite seleccionar si eres espectador
      // Si no estamos en fase de votación o en la fase de vidente, no se permite seleccionar

      // Si el jugador está intentando votarse a sí mismo en la fase diurna, no se permite la selección
      if (this.currentPeriod === "DÍA" && playerId === this.MiId) {
        return;
      }

      /*Si el jugador que queremos votar está muerto, no se le puede seleccionar, convendría enseñar un popup de este jugador ya está muerto */
      if (this.IsPlayerDead(playerId)) return; // No permite seleccionar si el jugador está muerto

      if (
        !this.isVotingPhase &&
        this.currentPhase !== "vidente_action" &&
        this.currentPhase !== "habilidad_bruja"
      ) {
        return;
      }
      if (
        this.currentPhase === "game_voting" &&
        !this.isLynchPhase && // es la votación de alguacil, no linchamiento
        playerId === this.MiId
      ) {
        return;
      }
      // En la fase de votación del alguacil, verifica si ya se ha votado
      if (this.currentPhase === "game_voting" && this.hasVotedAlguacil) {
        return;
      }
      // En la fase de acción de la vidente, verifica si ya se ha actuado
      if (this.currentPhase === "vidente_action" && this.hasVidenteActed) {
        return;
      }

      if (
        this.currentPhase === "vidente_action" &&
        playerId === this.getMyId()
      ) {
        return;
      }
      if (
        this.currentPhase === "game_voting" &&
        this.VotacionLobos == true &&
        playerId === this.getMyId()
      ) {
        return;
      }

      // Alterna la selección del jugador
      this.selectedPlayerIndex =
        this.selectedPlayerIndex === playerId ? null : playerId;
    },

    //Método modificado para emitir la votación al servidor
    voteForPlayer() {
      if (this.isSpectator) return; // No permite votar si eres espectador
      if (!this.selectedPlayerIndex) return;

      const objetivo = this.selectedPlayerIndex.toString();

      // — VOTO DE HOMBRES LOBO (noche) —
      if (this.currentPeriod === "NOCHE") {
        if (this.LoboHavotado) return;
        socket.emit("votar", {
          idPartida: this.idPartida,
          idJugador: this.getMyId(),
          idObjetivo: objetivo,
        });
        this.LoboHavotado = true;
        this.VotacionLobos = false;
        return;
      }

      // — VOTO DE DÍA —
      if (this.hasVotedAlguacil) return;

      if (this.isLynchPhase) {
        // linchamiento usa el mismo canal 'votar'
        socket.emit("votar", {
          idPartida: this.idPartida,
          idJugador: this.getMyId(),
          idObjetivo: objetivo,
        });
        this.isLynchPhase = false; // lo consumimos
      } else {
        // primera votación: alguacil
        socket.emit("votarAlguacil", {
          idPartida: this.idPartida,
          idJugador: this.getMyId(),
          idObjetivo: objetivo,
        });
      }
      this.hasVotedAlguacil = true; // deshabilita el botón en DÍA
    },

    resetVotingState() {
      this.selectedPlayerIndex = null;
      this.hasVotedAlguacil = false;
      this.hasVidenteActed = false;
      //Meter reseteo de si ha participado la bruja
      this.revealVotes = false;
      this.revealIndex = 0;
      this.hasPassedTurn = false;
      this.players.forEach((p) => (p.votes = 0));
    },

    getRandomRole() {
      const validRoles = roles.filter(
        (role) => role.nombre.toLowerCase() !== "alguacil"
      );
      return validRoles[Math.floor(Math.random() * validRoles.length)];
    },

    handlePassBrujaTurn() {
      if (!this.hasBrujaPassed) {
        socket.emit("pasarTurnoBruja", {
          idPartida: this.idPartida,
          idJugador: this.getMyId(),
        });
        this.hasBrujaPassed = true;
      }
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

/* Overlay para fondo en modo noche */
.partida-container.modo-noche {
  /* mantiene posición relativa */
}
.partida-container.modo-noche::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

/* En vote-message convertimos:
   - 1.25rem ≈ 20px → ≈2vh (si usamos la altura: 20/1080×100 ≈1.85vh, redondeamos a 2vh)
   - 2.5rem ≈ 40px → ≈2vw (40/1920×100 ≈2.08vw)
   - 0.625rem ≈ 10px → ≈0.5vw
   - 1.5rem ≈ 24px → ≈1.3vw
   - 1.25rem de box-shadow ≈ 20px → ≈1vw */
.vote-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #262522;
  color: white;
  padding: 2vh 2vw;
  border-radius: 0.5vw;
  font-size: 1.3vw;
  z-index: 1000;
  box-shadow: 0 0 1vw rgba(0, 0, 0, 0.5);
}

/* Para .vidente-buttons:
   - 42rem ≈ 42*16 = 672px → 672/1080×100 ≈ 62vh
   - 5rem ≈ 80px → 80/1920×100 ≈ 4vw (aproximadamente)
   - gap: 1rem ≈ 16px → ≈1vw */
.vidente-buttons {
  position: absolute;
  top: 62vh;
  left: 4vw;
  display: flex;
  flex-direction: row;
  gap: 1vw;
  z-index: 9999;
}

.bruja-buttons {
  position: absolute;
  top: 62vh;
  left: 4vw;
  display: flex;
  flex-direction: row;
  gap: 1vw;
  z-index: 9999;
}

/* Estilos para el modal de Vidente revelación */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #fff;
  color: #333;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 80%;
}
/* Reconexión: fondo temático */
.reconnect-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/forest_night.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  /* capa semitransparente para contrastar */
}
.reconnect-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
}

/* Contenido centrado con lobo aullando de fondo */
.reconnect-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 3rem 4rem;
  border-radius: 1rem;
  backdrop-filter: blur(8px);
  background: rgba(20, 20, 30, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}
/* Silueta de lobo en background */
.reconnect-content::after {
  content: "";
  position: absolute;
  bottom: -20%;
  right: -10%;
  width: 200%;
  height: 200%;
  background: url("@/assets/wolf_silhouette.svg") no-repeat bottom right;
  background-size: contain;
  opacity: 0.15;
  pointer-events: none;
}

/* Título y texto */
.reconnect-content p {
  color: #f0f0f0;
  font-family: "Cinzel", serif;
  font-size: 1.2rem;
  margin-top: 2rem;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  animation: textPulse 1.5s ease-in-out infinite;
}

/* Huellas animadas en lugar de spinner */
.reconnect-spinner {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
.reconnect-spinner img {
  width: 110px;
  height: 110px;
  opacity: 0.8;
  animation: pawBounce 0.8s ease-in-out infinite alternate;
}
.reconnect-spinner img:nth-child(2) {
  animation-delay: 0.4s;
}

/* Animaciones */
@keyframes pawBounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px) scale(1.1);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
    border-width: 4px;
  }
  50% {
    border-width: 8px;
  }
  100% {
    transform: rotate(360deg);
    border-width: 4px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes textPulse {
  0%,
  100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}
</style>
