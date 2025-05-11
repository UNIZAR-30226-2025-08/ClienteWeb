<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Volver from "../components/Volver.vue";
import Cabecera from "../components/Cabecera.vue";

// Importación de avatares
import avatar1 from "../assets/avatares/imagenPerfil.webp";
import avatar2 from "../assets/avatares/imagenPerfil2.webp";
import avatar3 from "../assets/avatares/imagenPerfil3.webp";
import avatar4 from "../assets/avatares/imagenPerfil4.webp";
import avatar5 from "../assets/avatares/imagenPerfil5.webp";
import avatar6 from "../assets/avatares/imagenPerfil6.webp";
import avatar7 from "../assets/avatares/imagenPerfil7.webp";
import avatar8 from "../assets/avatares/imagenPerfil8.webp";

const avatarMap = {
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
};
const router = useRouter();

// Datos y estado
const rankedPlayers = ref([]);
const loading = ref(true);
const error = ref(null);
const searchName = ref("");
const paginaActual = ref(1);
const jugadoresPorPag = 10;

// Reiniciar página al cambiar búsqueda para que los resultados aparezcan en la primera página
watch(searchName, () => {
  paginaActual.value = 1;
});

// Carga del ranking
const fetchRanking = async () => {
  try {
    const { data } = await axios.get("/api/ranking/ranking");
    rankedPlayers.value = data.ranking.map((p) => ({
      id: p.idUsuario || p.id,
      name: p.nombre,
      victories: p.victorias,
      avatar: p.avatar,
    }));
  } catch {
    error.value = "Error al obtener el ranking global";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRanking);

// Orden y filtro de todos los jugadores
const sortedPlayers = computed(() =>
  [...rankedPlayers.value].sort((a, b) => b.victories - a.victorias)
);
const filteredPlayers = computed(() => {
  const term = searchName.value.trim().toLowerCase();
  return term
    ? sortedPlayers.value.filter((p) => p.name.toLowerCase().includes(term))
    : sortedPlayers.value;
});

// Posición global y paginación de los filtrados
const jugadoresConPosicion = computed(() =>
  filteredPlayers.value.map((p) => ({
    ...p,
    globalRank: sortedPlayers.value.findIndex((sp) => sp.id === p.id) + 1,
  }))
);
const jugadoresPaginados = computed(() => {
  const start = (paginaActual.value - 1) * jugadoresPorPag;
  return jugadoresConPosicion.value.slice(start, start + jugadoresPorPag);
});
const totalPaginas = computed(() =>
  Math.ceil(jugadoresConPosicion.value.length / jugadoresPorPag)
);

function paginaSiguiente() {
  if (paginaActual.value < totalPaginas.value) paginaActual.value++;
}
function paginaAnterior() {
  if (paginaActual.value > 1) paginaActual.value--;
}

function getAvatar(name) {
  return avatarMap[name] || avatar1;
}
</script>

<template>
  <Cabecera
    :titulo="'Ranking de Jugadores'"
    :compacto="false"
    class="cabecera-medieval"
  />
  <div class="ranking-container medieval-font">
    <div v-if="loading" class="loading medieval-font">Cargando ranking…</div>
    <div v-else-if="error" class="error medieval-font">{{ error }}</div>

    <table v-else class="ranking-table medieval-font">
      <thead>
        <tr>
          <th><i class="bi bi-list-ol"></i> POSICIÓN</th>
          <th><i class="bi bi-person-fill"></i> JUGADOR</th>
          <th><i class="bi bi-trophy-fill"></i> VICTORIAS</th>
        </tr>
        <tr class="filter-row">
          <th colspan="3" class="filter-header-cell">
            <input
              v-model="searchName"
              type="text"
              placeholder="Buscar jugador..."
              class="buscador-medieval medieval-font"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in jugadoresPaginados" :key="player.id">
          <td class="rank-cell medieval-font">
            <span v-if="player.globalRank === 1">🏆</span>
            <span v-else-if="player.globalRank === 2">🥈</span>
            <span v-else-if="player.globalRank === 3">🥉</span>
            <span v-else>{{ player.globalRank }}</span>
          </td>
          <td
            class="player-cell medieval-font"
            @click="router.push(`/perfil/${player.id}`)"
          >
            <div class="player-info">
              <img
                :src="getAvatar(player.avatar)"
                :alt="player.name"
                class="player-avatar"
              />
              <span class="player-name medieval-font">{{ player.name }}</span>
            </div>
          </td>
          <td class="victories medieval-font">{{ player.victories }}</td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="totalPaginas > 1"
      class="pagination-controls-ranking medieval-font"
    >
      <button
        @click="paginaAnterior"
        :disabled="paginaActual === 1"
        class="btn-medieval"
      >
        ← Anterior
      </button>
      <span class="medieval-font"
        >Página {{ paginaActual }} de {{ totalPaginas }}</span
      >
      <button
        @click="paginaSiguiente"
        :disabled="paginaActual === totalPaginas"
        class="btn-medieval"
      >
        Siguiente →
      </button>
    </div>

    <Volver />
  </div>
</template>

<style scoped>
.medieval-font {
  font-family: "MedievalSharp", cursive !important;
}

/* Contenedor */
.ranking-container {
  padding: 2rem;
  background: linear-gradient(135deg, #2b2b2b, #191919);
  border-radius: 15px;
  width: 93%;
  margin: 2rem auto;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.7);
  text-align: center;
}

/* Tabla y filtros */
.ranking-table {
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(255, 255, 255, 0.05);
  table-layout: fixed;
}
.ranking-table th,
.ranking-table td {
  padding: 1.2rem;
  border: 1px solid #302e2b;
  height: 60px;
  vertical-align: middle !important;
  line-height: 1;
}
.ranking-table th i {
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
}
.ranking-table th {
  background-color: rgba(0, 0, 0, 0.4);
  font-size: 2rem;
  color: #fff;
  text-transform: uppercase;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}
.ranking-table td {
  padding: 1rem;
  font-size: 1.7rem;
  font-weight: bold;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-shadow: 5px 3px 3px rgba(0, 0, 0, 0.7);
}
.ranking-table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Fila filtro */
.filter-row {
  background: rgba(255, 255, 255, 0.1);
}
.filter-header-cell {
  padding: 0.5rem 1rem;
  border: none;
}
.buscador-medieval {
  width: 100%;
  max-width: 400px;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 1.6rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* Celdas contenido */
.player-cell {
  text-align: left;
  cursor: pointer;
}
.player-cell:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.player-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 60px;
}
.player-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #fbdc2e;
  object-fit: cover;
}
.player-name {
  font-size: 1.7rem;
  color: #fff;
  text-shadow: 5px 3px 3px rgba(0, 0, 0, 0.7);
}
.rank-cell,
.victories {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Paginación */
.pagination-controls-ranking {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.btn-medieval {
  font-family: "MedievalSharp", cursive !important;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
}
.btn-medieval:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mensajes */
.loading {
  font-size: 1.8rem;
  color: #fff;
}
.error {
  color: #ff4d4f;
  font-weight: bold;
  margin: 1rem 0;
}
</style>
