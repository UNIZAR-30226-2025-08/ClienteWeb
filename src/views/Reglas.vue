<script setup>
import { useRouter } from "vue-router";
import Volver from "../components/Volver.vue";
import Cabecera from "../components/Cabecera.vue";
</script>

<template>
  <div class="reglas-page medieval-font">
    <Cabecera titulo="Reglas del Juego" :compacto="true" />

    <main class="reglas-content">
      <section id="introduccion" class="card">
        <h2>Introducción</h2>
        <p>
          Los <strong>Hombres Lobos de Castronegro</strong> es un juego de
          cartas y roles en el que los jugadores asumen identidades secretas. El
          objetivo varía según el rol: los aldeanos deben descubrir a los
          hombres lobos antes de ser eliminados, mientras que los lobos buscan
          permanecer ocultos y sobrevivir.
        </p>
      </section>

      <section id="distribucion-roles" class="card">
        <h2>Distribución de Roles</h2>
        <p>
          Cada jugador recibe una carta de rol al azar. El narrador explica si
          se elige un Alguacil por votación inmediata. El Alguacil tiene doble
          voto y puede influir en la dinámica del pueblo.
        </p>
        <p>
          Consulta la lista completa en
          <router-link to="/roles">Roles</router-link>.
        </p>
      </section>

      <section id="fase-noche" class="card">
        <h2>Fase de Noche</h2>
        <p>
          Todos cierran los ojos. El narrador llama en orden a los roles con
          acción nocturna:
        </p>
        <ul>
          <li><strong>Vidente:</strong> Revela el rol de un jugador.</li>
          <li>
            <strong>Hombres Lobo:</strong> Eligen silenciosamente a su víctima.
          </li>
          <li>
            <strong>Bruja:</strong> Usa pociones de vida o muerte para salvar o
            eliminar.
          </li>
        </ul>
        <p>
          Si muere el Cazador, puede disparar de despedida antes de revelar su
          carta.
        </p>
      </section>

      <section id="fase-dia" class="card">
        <h2>Fase de Día</h2>
        <p>
          Tras la noche, se anuncian las bajas. Los jugadores discuten y votan a
          un sospechoso para linchar; el más votado muestra su rol al morir.
        </p>
      </section>

      <section id="fin-juego" class="card">
        <h2>Final del Juego</h2>
        <p>Alternan noche y día hasta que:</p>
        <ul>
          <li>Los aldeanos ganan eliminando a todos los lobos.</li>
          <li>
            Los lobos ganan alcanzando o superando en número a los aldeanos.
          </li>
        </ul>
      </section>

      <section id="video-explicativo" class="card video-card">
        <h2>Vídeo Explicativo</h2>
        <iframe
          src="https://www.youtube.com/embed/OkK9zW1BnyY"
          title="Vídeo Explicativo"
          allowfullscreen
        ></iframe>
      </section>
    </main>

    <Volver />
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap");
.medieval-font {
  font-family: "MedievalSharp", cursive !important;
}

.reglas-page {
  background-color: #1e1c1a;
  color: #fff;
  padding: 1rem;
}

.reglas-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background-color: #262522;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.card h2 {
  margin-top: 0;
  color: #f2b632;
  font-size: 1.8rem;
}

.card p,
.card ul {
  margin: 0.8rem 0;
  font-size: 1rem;
  line-height: 1.5;
}

.card ul {
  padding-left: 1.4rem;
}

.card ul li {
  margin-bottom: 0.4rem;
}

.video-card iframe {
  width: 100%;
  height: 480px;
  border: none;
  border-radius: 8px;
  margin-top: 0.8rem;
}
</style>
