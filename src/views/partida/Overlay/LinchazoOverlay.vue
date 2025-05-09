<template>
  <div class="overlay fadeInOut">
    <div class="overlay-content">
      <h1>Linchazo</h1>
      <ul>
        <li
          v-for="(victima, index) in victimas"
          :key="index"
          class="victim-text"
        >
          <div class="victim-info">
            <span class="victim-icon">⚔️👥</span>
            <span class="victim-name">{{ victima.nombre }}</span>
            <span
              class="victim-role"
              :class="victima.rol.toLowerCase().replace(' ', '-')"
            >
              {{ victima.rol }}
              <span v-if="victima.esAlguacil" class="alguacil-badge">👑</span>
            </span>
            <span class="victim-message">ha sido linchado durante el día.</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "LinchazoOverlay",
  props: {
    victimas: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center; /*prittier*/
  align-items: center;
  z-index: 9999;
}

.overlay-content {
  color: white;
  text-align: center;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.victim-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 1.8rem;
}

.victim-icon {
  font-size: 2rem;
}

.victim-name {
  font-weight: bold;
  color: #ff6b6b;
}

.victim-role {
  padding: 0.3rem 0.8rem;
  border-radius: 0.5rem;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1.4rem;
}

.victim-role.hombre-lobo {
  background-color: #c41e3a;
  color: white;
}

.victim-role.vidente {
  background-color: #9370db;
  color: white;
}

.victim-role.bruja {
  background-color: #9b59b6;
  color: white;
}

.victim-role.cazador {
  background-color: #f39c12;
  color: white;
}

.victim-role.alguacil {
  background-color: #3498db;
  color: white;
}

.victim-role.aldeano {
  background-color: #2ecc71;
  color: white;
}

.alguacil-badge {
  margin-left: 0.5rem;
  font-size: 1.2rem;
}

.victim-message {
  color: #ecf0f1;
}

.fadeInOut {
  animation: fadeInOut 5s forwards;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
