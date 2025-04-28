<template>
  <div class="final-overlay fadeIn">
    <div class="confetti-container">
      <!-- 20 divs para confeti, pasamos --i y --r -->
      <div
        v-for="n in 20"
        :key="n"
        class="confetti"
        :style="{
          '--i': n,
          '--r': n * 15 + 'deg',
        }"
      ></div>
    </div>

    <div class="overlay-inner">
      <!-- (tu icono dinámico como antes) -->
      <div class="icon-wrapper">
        <i
          v-if="winnerType === 'aldeanos'"
          class="fas fa-trophy trophy-icon"
        ></i>
        <span v-else-if="winnerType === 'lobos'" class="wolf-icon">🐺</span>
        <span v-else-if="winnerType === 'empate'" class="handshake-icon"
          >🤝</span
        >
      </div>

      <h1 class="final-title" :class="titleClass">
        ¡La partida ha finalizado!
      </h1>
      <p class="final-message" :class="messageClass">{{ Mensaje }}</p>
      <button class="btn-exit" @click="$emit('exit')">Salir al menú</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "FinalPartidaOverlay",
  props: {
    Mensaje: {
      type: String,
      default: "",
    },
    ganador: {
      type: String,
      default: "",
    },
  },
  computed: {
    // Determina el tipo de ganador a partir del texto
    winnerType() {
      const g = this.ganador.toLowerCase();
      if (g.includes("aldeanos")) return "aldeanos";
      if (g.includes("lobos")) return "lobos";
      return "empate";
    },
    // Clases extra para título y mensaje
    titleClass() {
      return {
        "text-lobos": this.winnerType === "lobos",
        "text-empate": this.winnerType === "empate",
      };
    },
    messageClass() {
      return this.titleClass;
    },
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.final-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, #222 0%, #000 90%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 9999;
}

.fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.overlay-inner {
  position: relative;
  text-align: center;
  color: #fff;
  padding: 2.5rem 3rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px); /*prittier*/
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.icon-wrapper {
  margin-bottom: 1rem;
}

/* Trofeo para aldeanos */
.trophy-icon {
  font-size: 4rem;
  color: gold;
  text-shadow: 0 0 1rem rgba(255, 215, 0, 0.8);
  animation: pop 0.8s ease-out infinite alternate;
}
@keyframes pop {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

/* Emoji de lobo para los lobos */
.wolf-icon {
  font-size: 4rem;
  animation: shake 0.8s ease-in-out infinite;
}
@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}

/* Emoji de apretón de manos para empate */
.handshake-icon {
  font-size: 4rem;
  animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.final-title {
  font-size: 2.8rem;
  margin: 0.5rem 0;
  font-family: "Playfair Display", serif;
  letter-spacing: 0.05em;
}

.final-message {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  font-family: "Lato", sans-serif;
}

/* Estilos para texto de lobos */
.text-lobos {
  color: #e63946;
  text-shadow: 0 0 8px #a60f0f;
}

/* Estilos para texto de empate */
.text-empate {
  color: #f4a261;
  text-shadow: 0 0 6px #e9c46a;
}

.btn-exit {
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  color: #222;
  border-radius: 2rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
}
.btn-exit:hover {
  transform: translateY(-3px);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.4);
}

/* Confeti */
.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 100;
}
.confetti {
  position: absolute;
  width: 0.6rem;
  height: 1.5rem;
  background-color: hsl(calc(var(--i) * 18), 75%, 60%);
  top: -2rem;
  left: calc(var(--i) * 5%);
  opacity: 0.8;
  animation: fall calc(3s + var(--i) * 0.2s) linear infinite;
  transform: rotate(var(--r));
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(var(--r));
  }
  100% {
    transform: translateY(120vh) rotate(calc(var(--r) + 360deg));
  }
}

/* Variables --i y --r (1–20) para cada confetti nth-child */
.confetti:nth-child(1) {
  --i: 1;
  --r: 15deg;
}
.confetti:nth-child(2) {
  --i: 2;
  --r: 45deg;
}
/* ... hasta nth-child(20) ... */
.confetti:nth-child(20) {
  --i: 20;
  --r: 240deg;
}
</style>
