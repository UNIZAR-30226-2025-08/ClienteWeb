<script setup>
import { ref, onMounted } from "vue";
import Cabecera from "../components/Cabecera.vue";
import Volver from "../components/Volver.vue";
import axios from "axios";

// Para este ejemplo, asumimos que el ID del usuario logueado es 2.
// En una aplicación real, podrías obtenerlo desde un store o desde la sesión.

const friends = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchFriends = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("usuario")).id;
    // Llamamos al endpoint del backend para obtener la lista de amigos con estadísticas.
    // La ruta definida en el backend es: GET /api/amistad/listarConEstadisticas/:idUsuario
    const response = await axios.get(
      `/api/amistad/listarConEstadisticas/${userId}`
    );
    // Se asume que la respuesta tiene la forma: { amigos: [ { idUsuario, nombre, avatar, estadisticas, ... }, ... ] }
    friends.value = response.data.amigos;
  } catch (err) {
    console.error("Error al obtener la lista de amigos:", err);
    error.value = "Error al obtener la lista de amigos.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchFriends();
});
</script>

<template>
  <div class="amigos-page">
    <!-- Cabecera reutilizable -->
    <Cabecera titulo="Juega Con Amigos" :compacto="true" />

    <!-- Contenedor principal para la lista de amigos -->
    <div class="amigos-container">
      <div v-if="loading">Cargando amigos...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div
          v-for="friend in friends"
          :key="friend.idUsuario"
          class="friend-row"
        >
          <div class="friend-info">
            <!-- Si el friend tiene avatar, se muestra; de lo contrario se muestra una imagen por defecto -->
            <img
              :src="friend.avatar || '../assets/profile_icon.jpg'"
              alt="Icono Amigo"
              class="friend-icon"
            />
            <div class="friend-text">
              <p class="friend-name">{{ friend.nombre }}</p>
              <!-- Ejemplo: si el objeto estadisticas existe, mostramos partidas totales; de lo contrario, mostramos un estado por defecto -->
              <p class="friend-status">
                {{
                  friend.estadisticas
                    ? "En Sala / " +
                      friend.estadisticas.partidasTotales +
                      " Partidas"
                    : "Disponible"
                }}
              </p>
            </div>
          </div>
          <div class="friend-buttons">
            <button class="green-button">Unirse</button>
            <button class="green-button">Invitar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra inferior con botón Volver -->
    <div class="bottom-bar">
      <Volver />
    </div>
  </div>
</template>

<!-- Se asume que los estilos están en Amigos.css -->
<style src="./Amigos.css"></style>
