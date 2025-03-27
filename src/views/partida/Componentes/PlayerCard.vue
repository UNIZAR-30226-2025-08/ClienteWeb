<template>
  <div
    class="player-icon"
    :class="{
      selected: selected,
      [`player-${position}`]: true
    }"
    @click="$emit('select')"
  >
    <span class="player-label">JUGADOR {{ playerNumber }}</span>
    <img src="../assets/player.png" :alt="'Jugador ' + playerNumber" />
    <div v-if="showVotes" class="votes-palos">
      <span v-for="(vote, idx) in votes" :key="idx" class="palito"> | </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playerNumber: {
      type: Number,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    position: {
      type: Number,
      required: true
    },
    votes: {
      type: Array,
      default: () => []
    },
    showVotes: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select']
}
</script>

<style scoped>
.player-icon {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  background-color: #262522;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.player-label {
  position: absolute;
  top: -1.2rem;
  color: #000;
  font-size: 0.85rem;
  font-weight: bold;
}

.player-icon img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

.selected {
  box-shadow: 0 0 0 4px #33ff00;
  transition: box-shadow 0.2s;
}

.votes-palos {
  position: absolute;
  bottom: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.palito {
  display: inline-block;
  width: 6px;
  height: 20px;
  margin: 0 3px;
  background-color: black;
  border-radius: 6px;
}
</style>