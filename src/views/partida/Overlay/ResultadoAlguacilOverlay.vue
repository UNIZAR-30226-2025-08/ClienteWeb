<template>
  <div class="result-overlay fadeInOut">
    <img
      src="../../../assets/alguacil.png"
      alt="Alguacil"
      class="alguacil-img"
    />
    <h1 class="result-text">{{ winnerName }} ES EL ALGUACIL</h1>
  </div>
</template>

<script>
export default {
  props: {
    winnerName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.result-overlay {
  position: fixed;
  top: 0;
  left: 0; /*prittier*/
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.result-text {
  color: #8b0000;
  font-size: 4rem;
  font-family: "MedievalSharp", serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.fadeInOut {
  animation: fadeInOut 6s forwards;
}

.alguacil-img {
  width: 10vw;
  margin-bottom: 2vh;
}
</style>
