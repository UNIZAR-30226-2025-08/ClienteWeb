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
  // Si estamos en el perfil, buscamos en el historial una ruta que contenga "/sala"
  if (route.name === "perfil") {
    // Buscamos a partir del final del historial (la ruta más antigua en la pila) que contenga "/sala"
    const salaRoute = navigationHistory
      .slice()
      .reverse()
      .find((path) => path.includes("/sala"));
    console.log("Perfil");
    if (salaRoute) {
      // Si se encontró una ruta de sala, usamos window.location.href para forzar la recarga
      window.location.href = salaRoute;
      return;
    }
  }
  if (route.name === "amigos") {
    // Si estamos en la página de amigos, buscamos en el historial una ruta que contenga "/sala"
    console.log("Amigos");
    const salaRoute = navigationHistory
      .slice()
      .reverse()
      .find((path) => path.includes("/sala"));
    if (salaRoute) {
      // Si se encontró una ruta de sala, usamos window.location.href para forzar la recarga
      window.location.href = salaRoute;
      return;
    }
  }
  console.log("Volviendo");
  // En cualquier otro caso, usamos la navegación interna del router
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
