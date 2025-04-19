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
      <!-- Avatar + overlay de calavera -->
      <div class="avatar-wrapper">
        <img
          :src="avatarMap[player.avatar] || defaultAvatar"
          alt="Avatar Jugador"
          class="player-image"
        />
        <div v-if="deadPlayers.includes(player.id)" class="skull-overlay">
          💀
        </div>
      </div>

      <!-- Nombre del jugador -->
      <span class="player-label">{{ player.nombre }}</span>

      <!-- Palitos de voto -->
      <div class="votes-bar">
        <div v-for="n in player.votes" :key="n" class="vote-stick"></div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from "../../../assets/profile_icon.jpg";

export default {
  name: "PlayersCircle",
  props: {
    players: {
      type: Array,
      required: true,
    },
    deadPlayers: {
      type: Array,
      default: () => [],
    },
    selectedPlayerIndex: {
      type: Number,
      default: null,
    },
    avatarMap: {
      type: Object,
      required: true,
    },
    defaultAvatar: {
      type: String,
      required: true,
    },
  },
  methods: {
    onPlayerClick(playerId) {
      this.$emit("select-player", playerId);
    },
    getPlayerPositionStyle(index, totalPlayers) {
      const angle = (360 / totalPlayers) * index;
      const radius = 200;
      const rad = (angle * Math.PI) / 180;
      const x = radius * Math.cos(rad);
      const y = radius * Math.sin(rad);
      return {
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
      };
    },
  },
};
</script>

<style scoped>
.players-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%);
}

.player-icon {
  position: absolute;
  width: 64px;
  height: 64px;
  cursor: pointer;
}

.avatar-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.player-image {
  width: 100%;
  height: 100%;
}

.skull-overlay {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 1.5rem;
  pointer-events: none;
}

.player-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 0.9rem;
  white-space: nowrap;
}

.votes-bar {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}

.vote-stick {
  width: 4px;
  height: 12px;
  background: #ffeb3b;
  margin: 0 1px;
}

.selected {
  outline: 2px solid yellow;
  border-radius: 50%;
}
</style>
