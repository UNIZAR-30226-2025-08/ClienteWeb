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
  /* 10px ≈ 0.5vw, 20px ≈ 1vw (usando la anchura) */
  padding: 0.5vw 1vw;
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
}

.section {
  display: flex;
  align-items: center;
  gap: 0.5vw;
  background-color: #262522;
  color: white;
  /* 15px y 30px aprox.: */
  padding: 0.8vw 1.6vw;
  border-radius: 0.5vw;
  /* 180px ≈ 9.4vw */
  min-width: 9.5vw;
  max-width: 30%;
  flex-shrink: 0;
}

.center {
  flex-direction: column;
  text-align: center;
  flex-grow: 1;
}

.icon {
  /* 40px ≈ 2.1vw */
  width: 2.1vw;
  height: 2.1vw;
}

.status-text {
  display: flex;
  flex-direction: column;
  font-size: 0.9vw;  /* ~16px */
  white-space: nowrap;
  font-weight: bold;
  text-align: center;
}
</style>

