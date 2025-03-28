<template>
  <div class="partida-container">
    <!-- Overlays -->
    <IntroOverlay v-if="currentPhase === 'intro'" />
    <RoleOverlay 
      v-if="currentPhase === 'role'" 
      :role="chosenRole"
    />
    <EmpiezaOverlay v-if="currentPhase === 'start'" />
    <AlguacilOverlay v-if="currentPhase === 'alguacil_announce'" />
    <AlguacilResultOverlay 
      v-if="currentPhase === 'alguacil_result'"
      :winner-index="alguacilWinnerIndex"
    />

    <!-- Componentes de partida activa -->
    <template v-if="isGameActive">
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

      <CountdownTimer
        v-if="isVotingPhase"
        :time-left="timeLeft"
      />

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
import { roles } from '../../assets/data/roles.js'
import GameStatus from '../../views/partida/Componentes/GameStatus.vue'
import RoleInfoPanel from '../../views/partida/Componentes/DescripcionRol.vue'
import CountdownTimer from '../../views/partida/Componentes/CountdownTimer.vue'
import VoteButton from '../../views/partida/Componentes/VoteButton.vue'
import PlayersCircle from '../../views/partida/Componentes/PlayerCard.vue'
import IntroOverlay from '../../views/partida/Overlay/IntroPartidaOverlay.vue'
import RoleOverlay from '../../views/partida/Overlay/RolOverlay.vue'
import EmpiezaOverlay from '../../views/partida/Overlay/InicioPartidaOverlay.vue'
import AlguacilOverlay from '../../views/partida/Overlay/VotacionAlguacilOverlay.vue'
import AlguacilResultOverlay from '../../views/partida/Overlay/ResultadoAlguacilOverlay.vue'

export default {
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
    AlguacilResultOverlay
  },
  data() {
    return {
      // Flujo del juego
      currentPhase: 'intro',
      isGameActive: false,
      isVotingPhase: false,
      
      // Temporizadores
      timeLeft: 60,
      countdownInterval: null,
      
      // Jugadores y votación
      players: Array(8).fill().map((_, i) => ({ id: i + 1, votes: 0 })),
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
      currentPeriod: 'DÍA'
    }
  },
  mounted() {
    this.startGameFlow()
  },
  beforeUnmount() {
    clearInterval(this.countdownInterval)
  },
  methods: {
    startGameFlow() {
      // Secuencia inicial de overlays
      setTimeout(() => {
        this.currentPhase = 'role'
        this.chosenRole = this.getRandomRole()
        
        setTimeout(() => {
          this.currentPhase = 'start'
          
          setTimeout(() => {
            this.startMainGame()
          }, 6000)
        }, 6000)
      }, 6000)
    },

    startMainGame() {
      this.currentPhase = 'game'
      this.isGameActive = true
      
      // Programar votación del Alguacil después de 30 segundos
      setTimeout(() => {
        this.currentPhase = 'alguacil_announce'
        
        setTimeout(() => {
          this.startAlguacilVoting()
        }, 6000)
      }, 30000)
    },

    startAlguacilVoting() {
      this.currentPhase = 'game_voting'
      this.isVotingPhase = true
      this.timeLeft = 60
      
      this.countdownInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--
        } else {
          clearInterval(this.countdownInterval)
          this.endVotingPhase()
        }
      }, 1000)
    },

    endVotingPhase() {
      this.isVotingPhase = false
      this.revealVotes = true
      this.showVotesProgressively()
      
      // Calcular ganador
      const maxVotes = Math.max(...this.players.map(p => p.votes))
      const winners = this.players.filter(p => p.votes === maxVotes)
      this.alguacilWinnerIndex = winners[0].id
      
      // Mostrar resultado
      this.currentPhase = 'alguacil_result'
      
      setTimeout(() => {
        this.currentPhase = 'game'
        this.resetVotingState()
      }, 6000)
    },

    showVotesProgressively() {
      let i = 0
      const revealInterval = setInterval(() => {
        if (i >= this.players.length) {
          clearInterval(revealInterval)
          return
        }
        this.revealIndex = i + 1
        i++
      }, 500)
    },

    selectPlayer(playerIndex) {
      if (!this.isVotingPhase || this.hasVoted) return
      this.selectedPlayerIndex = 
        this.selectedPlayerIndex === playerIndex ? null : playerIndex
    },

    voteForPlayer() {
      if (this.selectedPlayerIndex && !this.hasVoted) {
        this.players[this.selectedPlayerIndex - 1].votes++
        this.hasVoted = true
      }
    },

    resetVotingState() {
      this.selectedPlayerIndex = null
      this.hasVoted = false
      this.revealVotes = false
      this.revealIndex = 0
      this.players.forEach(p => p.votes = 0)
    },

    getRandomRole() {
      const validRoles = roles.filter(
        role => role.nombre.toLowerCase() !== 'alguacil'
      )
      return validRoles[Math.floor(Math.random() * validRoles.length)]
    }
  }
}
</script>

<style scoped>
.partida-container {
  background-image: url("../../../assets/fondoPartida.jpeg");
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
