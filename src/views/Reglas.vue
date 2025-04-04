<template>
  <Cabecera
    :titulo="'Reglas del Juego: Los Hombres Lobos de Castronegro'"
    :compacto="true"
  />
  <div class="reglas-page">
    <div class="reglas-content">
      <section class="introduccion">
        <h2>Introducción</h2>
        <p>
          Los Hombres Lobos de Castronegro es un juego de cartas y roles en el
          que los jugadores asumen roles secretos, entre ellos hombres lobos,
          aldeanos, y otros personajes con habilidades especiales. El objetivo
          del juego es que los aldeanos descubran quiénes son los hombres lobos
          antes de que estos eliminen a todos los aldeanos.
        </p>
      </section>

      <section class="distribucion-roles">
        <h2>Distribución de Roles</h2>
        <p>
          Se reparten los roles a los jugadores. Cada jugador mira su carta para
          saber cuál es su personaje, información que mantendrá en secreto a
          menos que sea eliminado. El Narrador decide si los aldeanos votarán
          ahora por un Alguacil (función adicional, independiente del personaje)
          por mayoría simple, o si el Alguacil será elegido más tarde en el
          transcurso de la partida. El voto del Alguacil cuenta como dos votos.
        </p>
        <p>
          Para más detalles sobre los roles específicos, puedes consultar la
          página de <router-link to="/roles">Roles</router-link>.
        </p>
      </section>

      <section class="fase-noche">
        <h2>Fase de Noche</h2>
        <p>
          Durante la fase de noche, todos los jugadores tienen los ojos
          cerrados, salvo aquellos que van siendo llamados por el narrador y
          actúan en silencio.
        </p>
        <h3>Orden de actuación durante la noche:</h3>
        <ul>
          <li>
            <strong>Vidente:</strong> Elige un jugador y el narrador le mostrará
            la carta de dicho jugador.
          </li>
          <li>
            <strong>Hombres Lobo:</strong> Los hombres lobos abren los ojos para
            elegir a su próxima víctima. Si no hay unanimidad en la designación
            de la víctima, no hay muerte. El narrador dispone de un tiempo
            limitado para que elijan.
          </li>
          <li>
            <strong>Bruja:</strong> El narrador le señala al jugador a punto de
            morir y la bruja decidirá si lo salva con su Poción de la Vida o lo
            deja morir. La bruja también puede usar su Poción de la Muerte para
            eliminar a otro jugador. Ambas pociones son de un solo uso.
          </li>
        </ul>
        <p>
          En caso de que el Cazador muera, el narrador le informará y el cazador
          podrá eliminar a un jugador de su elección.
        </p>
      </section>

      <section class="fase-dia">
        <h2>Fase de Día</h2>
        <p>
          Durante la fase de día, todos los jugadores tienen los ojos abiertos y
          comienzan a hablar, tratando de encontrar a los hombres lobos. Los
          hombres lobos se hacen pasar por aldeanos.
        </p>
        <p>
          El narrador indicará quién ha muerto durante la noche anterior.
          Durante la fase del día, los jugadores discutirán y votarán a un
          jugador para ser linchado (el jugador con más votos será eliminado de
          la partida y mostrará su carta públicamente).
        </p>
      </section>

      <section class="fin-juego">
        <h2>Final del Juego</h2>
        <p>
          Las fases de noche y día se alternan sucesivamente hasta que
          únicamente queden hombres lobos o aldeanos vivos. El juego terminará
          con la victoria de uno de los dos bandos:
        </p>
        <ul>
          <li>Los aldeanos ganan si eliminan a todos los hombres lobos.</li>
          <li>
            Los hombres lobos ganan si eliminan a todos los aldeanos o si el
            número de lobos es igual al de los aldeanos.
          </li>
        </ul>
      </section>

      <section class="video-explicativo">
        <h2>Vídeo Explicativo</h2>
        <p>
          Puedes ver un vídeo explicativo del juego aquí:
          <a
            href="https://www.youtube.com/watch?v=OkK9zW1BnyY"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/watch?v=OkK9zW1BnyY
          </a>
        </p>
      </section>
    </div>
  </div>
  <Volver />
</template>

<script setup>
// No es necesario agregar código adicional para este componente.
import { useRouter } from "vue-router";
const router = useRouter();
import Volver from "../components/Volver.vue";
import Cabecera from "../components/Cabecera.vue";
</script>

<style scoped>
/* Estilos generales */
.reglas-page {
  background-color: #1e1c1a;
  color: white;
  padding: 20px;
  font-family: "Arial", sans-serif;
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
}

.reglas-content {
  max-width: 800px;
  margin: 0 auto;
}

section {
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #f2b632;
}

h3 {
  font-size: 1.2rem;
  margin-top: 10px;
  color: #f2b632;
}

ul {
  padding-left: 20px;
}

ul li {
  font-size: 1rem;
  color: #b5b5b5;
}

.video-explicativo a {
  color: #f2b632;
  text-decoration: none;
}

.video-explicativo a:hover {
  text-decoration: underline;
}
</style>
