<script setup>
import { useRouter } from 'vue-router';
import Cabecera from "../components/Cabecera.vue";
import Volver from '../components/Volver.vue';
const router = useRouter();
</script>
<template>
   <!-- Cabecera: Se utiliza el componente Cabecera -->
   <Cabecera :titulo="'Mi Juego'" :compacto="false" />
    <div class="ranking-container">
      <h1 class="ranking-title">Ranking de Jugadores</h1>
      <div class="ranking-list">
        <div v-for="(player, index) in rankedPlayers" :key="index" class="ranking-item">
          <span class="rank-number">{{ index + 1 }}</span>
          <span class="player-name">{{ player.name }}</span>
          <span class="victories">{{ player.victories }} victorias</span>
        </div>
      </div>
    </div>
    <Volver />
  </template>
  
  <script>
  export default {
    data() {
      return {
        // Datos estáticos de jugadores con sus victorias
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
      // Ordenar a los jugadores de mayor a menor por victorias
      sortedPlayers() {
        return this.rankedPlayers.sort((a, b) => b.victories - a.victories);
      }
    }
  };
  </script>
  
  <style scoped>
  .ranking-container {
    color:  #302b2b;
    padding: 2rem;
    background-color: #1f1f1f;
    color: white;
    text-align: center;
    font-family: 'Roboto', sans-serif;
    border-radius: 10px;
    width: 80%;
    margin: 0 auto;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  }
  
  .ranking-title {
    font-size: 2.5rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 2rem;
    color: #f1c40f; /* Amarillo dorado */
  }
  
  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .ranking-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    background-color: #333;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  
  .rank-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: #f1c40f;
  }
  
  .player-name {
    font-size: 1.2rem;
    flex-grow: 1;
    text-align: center;
  }
  
  .victories {
    font-size: 1.2rem;
    font-weight: bold;
    color: #27ae60;
  }
  </style>
  