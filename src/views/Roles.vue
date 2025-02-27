<script setup>
import { ref, onMounted } from "vue";
import { roles } from "../assets/data/roles.js";
import Cabecera from "../components/Cabecera.vue";
import Volver from "../components/Volver.vue";

const rolesList = ref([]);

onMounted(() => {
  rolesList.value = roles;
});
</script>

<template>
  <div class="roles-page">
    <!-- Cabecera -->
    <Cabecera titulo="Roles" :compacto="true" />

    <!-- Contenedor de roles con scroll si es necesario -->
    <div class="roles-container">
      <div class="roles-list">
        <div v-for="(rol, index) in rolesList" :key="index" class="rol-item">
          <img :src="rol.src" :alt="rol.nombre" class="rol-img" />
          <div class="rol-info">
            <h3>{{ rol.nombre }}</h3>
            <p class="equipo">{{ rol.equipo }}</p>
            <p class="descripcion">{{ rol.descripcion }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón de volver -->
    <Volver />
  </div>
</template>

<style scoped>
/* Estilos generales */
.roles-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1e1c1a;
  color: white;
}

/* Contenedor de los roles */
.roles-container {
  flex: 1;
  width: 100%;
  max-width: 70rem;
  margin: 20px auto;
  background-color: #2a2724;
  padding: 15px;
  border-radius: 8px;
  overflow-y: auto; /* Scroll vertical si es necesario */
}

/* Lista de roles */
.roles-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Cada rol */
.rol-item {
  display: flex;
  align-items: center;
  background-color: #191716;
  padding: 12px;
  border-radius: 5px;
}

/* Imagen del rol */
.rol-img {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  margin-right: 15px;
}

/* Información del rol */
.rol-info {
  flex: 1;
}

.rol-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #f2b632; /* Cambié el color al actual color del nombre del equipo */
}

.equipo {
  font-size: 0.9rem;
  font-weight: bold;
  color: white; /* Cambié el color a blanco */
}

.descripcion {
  margin-top: 5px;
  font-size: 0.9rem;
  color: #b5b5b5;
}

/* Scrollbar personalizada */
.roles-container::-webkit-scrollbar {
  width: 8px;
}

.roles-container::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 4px;
}

.roles-container::-webkit-scrollbar-track {
  background-color: #2a2724;
}
</style>

