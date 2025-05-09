<template>
  <div class="volver-fixed" @click="goBack">
    <span class="arrow">←</span>
    <span class="text">Volver</span>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { navigationHistory } from "../router"; // Ajusta la ruta si es necesario

const router = useRouter();
const route = useRoute();

// Componente Volver

const goBack = () => {
  const history = navigationHistory;

  // Buscar la última ruta de Sala en el historial
  let salaRoute = null;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i]?.includes("/sala")) {
      salaRoute = history[i];
      break;
    }
  }

  // Si estamos en Perfil/Amigos y existe una Sala previa
  if ((route.name === "perfil" || route.name === "amigos") && salaRoute) {
    window.location.href = salaRoute;
    return;
  }

  // En otros casos, navegar normalmente hacia atrás
  router.back();
};
</script>

<style scoped>
.volver-fixed {
  position: fixed;
  bottom: 30px;
  left: 20px;
  z-index: 1000;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  background: linear-gradient(45deg, #3b3b3b, #1a1a1a);
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border: 2px solid #f1f1f19c;
}

.volver-fixed:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #505050, #2a2a2a);
}

.arrow {
  font-size: 1.6rem;
  margin-right: 0.8rem;
}

.text {
  font-size: 1.1rem;
}
</style>
