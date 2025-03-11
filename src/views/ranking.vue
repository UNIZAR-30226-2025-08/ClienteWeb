<script setup>
import { useRouter } from 'vue-router';
import Cabecera from "../components/Cabecera.vue";

const router = useRouter();
</script>

<template>
  <!-- Cabecera: Se utiliza el componente Cabecera -->
  <Cabecera :titulo="'Mi Juego'" :compacto="false" />

  <div class="ranking-container">
    <h1 class="ranking-title">
      <i class="bi bi-award-fill title-icon"></i> Ranking de Jugadores
    </h1>
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
/* Recuerda incluir Bootstrap Icons en tu index.html:
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
*/

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

/* Título con tipografía Bebas Neue, efecto de sombra e icono */
.ranking-title {
  font-family: 'Bebas Neue', sans-serif;
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
  color: #FFD700;
}

/* Estilo de la tabla */
.ranking-table {
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(255,255,255,0.05);
}

.ranking-table th, 
.ranking-table td {
  padding: 1.2rem;
  border: 1px solid #302E2B;
}

.ranking-table th {

  background-color: rgba(0,0,0,0.4);
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  color: #ffffff;
  text-transform: uppercase;
  border-bottom: 2px solid rgba(255,255,255,0.2);
}


.ranking-table td {
  padding: 1rem;
  font-family: 'MedievalSharp', cursive;
  font-size: 1.7rem;
  font-weight: bold;
  color: #ffffff;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  text-shadow: 5px 3px 3px rgba(0, 0, 0, 0.7);
}

.ranking-table tbody tr:hover {
  background-color: rgba(255,255,255,0.1);
}

thead {
  text-shadow: 5px 1px 2px rgba(0, 0, 0, 0.7);
}

.rank-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

 .bi-trophy-fill{
  color: #FFD700;
}

.bi-person-fill{
  color: #af9b9b;
}

.bi-list-ol{
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
</style>
