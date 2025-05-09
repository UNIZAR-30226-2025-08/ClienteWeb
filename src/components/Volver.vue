<template>
  <div class="volver-fixed" @click="goBack">
    <span class="arrow">←</span>
    <span class="text">Volver</span>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { navigationHistory } from "../router";

const router = useRouter();
const route = useRoute();

const goBack = () => {
  const currentIndex = navigationHistory.indexOf(route.fullPath);

  // Si no hay historial previo, ir al home
  if (currentIndex === -1 || currentIndex === 0) {
    return router.push("/");
  }

  const previousRoutes = navigationHistory.slice(0, currentIndex);
  const reversedHistory = [...previousRoutes].reverse();

  // Buscar la última ruta válida que NO sea partida
  const lastValidPath = reversedHistory.find(
    (path) => !path.startsWith("/partida/")
  );

  // Caso especial para perfil/amigos: priorizar salas
  if (["perfil", "amigos"].includes(route.name)) {
    const lastSalaPath = reversedHistory.find((path) =>
      path.startsWith("/sala/")
    );

    if (lastSalaPath) {
      window.location.href = lastSalaPath;
      return;
    }
  }

  // Navegación normal evitando partidas
  if (lastValidPath) {
    router.push(lastValidPath);
  } else {
    router.push("/");
  }
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
