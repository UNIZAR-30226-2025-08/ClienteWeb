<template>
  <div class="game-status">
    <div class="section">
      <img
        src="../../../assets/aldeanosVivos.png"
        alt="Aldeanos"
        class="icon"
      />
      <div class="status-text">
        <strong>PUEBLO</strong>
        <span>{{ aliveVillagers }}/{{ totalVillagers }} Vivos</span>
      </div>
    </div>

    <div class="section center">
      <strong>JORNADA {{ currentDay }}</strong>
      <span>{{ timePeriod }}</span>
    </div>

    <div class="section">
      <img src="../../../assets/lobosVivos.png" alt="Lobos" class="icon" />
      <div class="status-text">
        <strong>LOBOS</strong>
        <span>{{ aliveWolves }}/{{ totalWolves }} Vivos</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    aliveVillagers: {
      type: Number,
      default: 5,
    },
    totalVillagers: {
      type: Number,
      default: 6,
    },
    aliveWolves: {
      type: Number,
      default: 2,
    },
    totalWolves: {
      type: Number,
      default: 2,
    },
    currentDay: {
      type: Number,
      default: 1,
    },
    timePeriod: {
      type: String,
      default: "DÍA",
    },
  },
};
</script>

<style scoped>
.game-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
}

.section {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #262522;
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  min-width: 180px;
  max-width: 30%;
  flex-shrink: 0;
}

.center {
  flex-direction: column;
  text-align: center;
  flex-grow: 1;
}

.icon {
  width: 40px;
  height: 40px;
}

.status-text {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  white-space: nowrap;
  font-weight: bold;
  text-align: center;
}
</style>
