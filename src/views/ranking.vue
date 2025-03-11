<script setup>
import { useRouter } from 'vue-router';
import Cabecera from "../components/Cabecera.vue";

const router = useRouter();
</script>

<template>
  <!-- Cabecera: Se utiliza el componente Cabecera -->
  <Cabecera :titulo="'Mi Juego'" :compacto="false" />

  <div class="ranking-container">
    <h1 class="ranking-title">Ranking de Jugadores</h1>
    <table class="ranking-table">
      <thead>
  <tr>
    <th>
      <i class="bi bi-list-ol"></i> Posición
    </th>
    <th>
      <i class="bi bi-person-fill"></i> Jugador
    </th>
    <th>
      <i class="bi bi-trophy-fill"></i> Victorias
    </th>
  </tr>
</thead>

      <tbody>
        <tr v-for="(player, index) in sortedPlayers" :key="index">
          <td class="rank-cell">
            <!-- Iconos para el top 3 -->
            <span v-if="index === 0" class="icon trophy" title="Primer lugar">🏆</span>
            <span v-else-if="index === 1" class="icon medal" title="Segundo lugar">🥈</span>
            <span v-else-if="index === 2" class="icon medal" title="Tercer lugar">🥉</span>
            <span v-else>{{ index + 1 }}</span>
          </td>
          <td class="player-name">{{ player.name }}</td>
          <td class="victories">{{ player.victories }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rankedPlayers: [
        { name: 'Juan', victories: 125 },
        { name: 'Maria', victories: 102 },
        { name: 'Carlos', victories: 98 },
        { name: 'Lucia', victories: 87 },
        { name: 'Pedro', victories: 75 },
        { name: 'Sofia', victories: 63 },
        { name: 'David', victories: 52 },
        { name: 'Ana', victories: 45 },
        { name: 'Victor', victories: 34 },
        { name: 'Elena', victories: 22 }
      ]
    };
  },
  computed: {
    sortedPlayers() {
      return [...this.rankedPlayers].sort((a, b) => b.victories - a.victories);
    }
  }
};
</script>

<style scoped>
/* Contenedor con fondo degradado */
.ranking-container {
  padding: 2rem;
  background: linear-gradient(135deg, #2b2b2b, #191919);
  border-radius: 15px;
  width: 93%;
  margin: 2rem auto;
  box-shadow: 0 6px 15px rgba(0,0,0,0.7);
  text-align: center;
}

/* Título con tipografía Bebas Neue y efecto de sombra */
.ranking-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 4rem;
  margin-bottom: 1rem;
  margin-top: 0;
  color: #FFD700;
  text-shadow: 8px 3px 3px rgba(0, 0, 0, 0.7);
}

/* Estilo de la tabla */
.ranking-table {
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(255,255,255,0.05);
}

/* Estilos para cabecera de la tabla */
.ranking-table th {
  padding: 1.2rem;
  background-color: rgba(0,0,0,0.4);
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  color: #FFD700;
  text-transform: uppercase;
  border-bottom: 2px solid rgba(255,255,255,0.2);
}

/* Estilos para las celdas de la tabla */
.ranking-table td {
  padding: 1rem;
  font-family: 'MedievalSharp', cursive;
  font-size: 1.7rem;
  font-weight: bold;
  color: #eee;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

/* Efecto hover en las filas */
.ranking-table tbody tr:hover {
  background-color: rgba(255,255,255,0.1);
}

thead {
  text-shadow: 5px 1px 2px rgba(0, 0, 0, 0.7);
}

/* Centrado de la celda de posición */
.rank-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Iconos: tamaño y color */
.icon {
  margin-right: 0.5rem;
  color: #FFD700;
}

/* Icono para el primer puesto (copa dorada) */
.trophy {
  font-size: 3.2rem;
}

/* Iconos para el segundo y tercer puesto */
.medal {
  font-size: 2.8rem;
}
</style>
