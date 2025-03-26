<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Cabecera from "../components/Cabecera.vue";

const router = useRouter();

// Variables reactivas para los datos, estado de carga y errores
const rankedPlayers = ref([]);
const loading = ref(true);
const error = ref(null);

// Función para obtener el ranking desde el endpoint del backend
const fetchRanking = async () => {
  try {
    const response = await axios.get("/api/ranking/ranking");
    // Se asume que la respuesta tiene la forma { mensaje: "Ranking global obtenido", ranking: [...] }
    // Mapeamos los datos para que tengan las propiedades que usamos en el template
    rankedPlayers.value = response.data.ranking.map((item) => ({
      name: item.nombre,
      victories: item.victorias,
      avatar: item.avatar,
    }));
  } catch (err) {
    console.error("Error al obtener el ranking:", err);
    error.value = "Error al obtener el ranking global";
  } finally {
    loading.value = false;
  }
};

// Ejecuta la función cuando el componente se monta
onMounted(() => {
  fetchRanking();
});

// Computed para ordenar los jugadores según sus victorias (descendente)
const sortedPlayers = computed(() => {
  return [...rankedPlayers.value].sort((a, b) => b.victories - a.victories);
});
</script>

<template>
  <!-- Cabecera: Se utiliza el componente Cabecera -->
  <Cabecera :titulo="'Mi Juego'" :compacto="false" />

  <div class="ranking-container">
    <h1 class="ranking-title">
      <i class="bi bi-award-fill title-icon"></i> Ranking de Jugadores
    </h1>

    <!-- Mensajes de carga y error -->
    <div v-if="loading">Cargando ranking...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- Tabla del ranking -->
    <table v-else class="ranking-table">
      <thead>
        <tr>
          <th><i class="bi bi-list-ol"></i> Posición</th>
          <th><i class="bi bi-person-fill"></i> Jugador</th>
          <th><i class="bi bi-trophy-fill"></i> Victorias</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in sortedPlayers" :key="index">
          <td class="rank-cell">
            <!-- Iconos para el top 3 -->
            <span v-if="index === 0" class="icon trophy" title="Primer lugar"
              >🏆</span
            >
            <span
              v-else-if="index === 1"
              class="icon medal"
              title="Segundo lugar"
              >🥈</span
            >
            <span
              v-else-if="index === 2"
              class="icon medal"
              title="Tercer lugar"
              >🥉</span
            >
            <span v-else>{{ index + 1 }}</span>
          </td>

          <td class="player-name">{{ player.name }}</td>
          <td class="victories">{{ player.victories }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/*
*FALTA INCLUIR EL AVATAR CUANDO LOS TENGAMOS YA IMPLEMENTADOS
*/

/* Contenedor con fondo degradado */
.ranking-container {
  padding: 2rem;
  background: linear-gradient(135deg, #2b2b2b, #191919);
  border-radius: 15px;
  width: 93%;
  margin: 2rem auto;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.7);
  text-align: center;
}

/* Título con tipografía Bebas Neue, efecto de sombra e icono */
.ranking-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: 4rem;
  margin-bottom: 1rem;
  margin-top: 0;
  color: #fbdc2e;
  text-shadow: 8px 3px 3px rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-icon {
  font-size: 4.5rem;
  margin-right: 1rem;
  color: #ffd700;
}

/* Estilo de la tabla */
.ranking-table {
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(255, 255, 255, 0.05);
}

.ranking-table th,
.ranking-table td {
  padding: 1.2rem;
  border: 1px solid #302e2b;
}

.ranking-table th {
  background-color: rgba(0, 0, 0, 0.4);
  font-family: "Bebas Neue", sans-serif;
  font-size: 2rem;
  color: #ffffff;
  text-transform: uppercase;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.ranking-table td {
  padding: 1rem;
  font-family: "MedievalSharp", cursive;
  font-size: 1.7rem;
  font-weight: bold;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-shadow: 5px 3px 3px rgba(0, 0, 0, 0.7);
}

.ranking-table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

thead {
  text-shadow: 5px 1px 2px rgba(0, 0, 0, 0.7);
}

.rank-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.bi-trophy-fill {
  color: #ffd700;
}

.bi-person-fill {
  color: #af9b9b;
}

.bi-list-ol {
  color: #f0ec00;
}

.icon {
  margin-right: 0.5rem;
  color: #f4f4f4;
}

.trophy {
  font-size: 3.2rem;
}

.medal {
  font-size: 2.8rem;
}

.error {
  color: red;
  font-weight: bold;
  margin: 1rem 0;
}
</style>
