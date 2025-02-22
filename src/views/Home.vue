<script setup>
import './Home.css';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Control de visibilidad de la contraseña
const showPassword = ref(false);

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}
/* ----------------------------
   Referencias para el scroll
---------------------------- */
const scrollInicio = ref(null);
const scrollSeccionJuego = ref(null);
const scrollSeccionRoles = ref(null);
const scrollSeccionDesarrollo = ref(null);
const scrollSeccionDescargar = ref(null);
const scrollSeccionContacto = ref(null);

// Funciones de scroll suave
function desplazarAbajo() {
  scrollSeccionJuego.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function desplazarAbajoRoles() {
  scrollSeccionRoles.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function desplazarAbajoDesarrollo() {
  scrollSeccionDesarrollo.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function desplazarAbajoDescargar() {
  scrollSeccionDescargar.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function desplazarArriba() {
  scrollInicio.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ----------------------------
       Carrusel de Roles
---------------------------- */
const roles = ref([
  {
    src: new URL('../assets/roles/aldeano.jpeg', import.meta.url).href,
    nombre: 'Aldeano',
    descripcion: 'No posee ningún poder especial, aparte de su intuición y su sentido común',
    equipo: 'Bando del pueblo'
  },
  {
    src: new URL('../assets/roles/bruja.jpeg', import.meta.url).href,
    nombre: 'Bruja',
    descripcion: 'Posee dos pociones que puede usar por la noche, tras el turno de los hombres lobo: la Poción de la Vida salvará a un personaje del ataque de los Hombres Lobo (también puede reservársela para ella misma) y la Poción de la Muerte matará a otro personaje de su elección. Puede usar una, ninguna o las dos pociones durante el mismo turno si así lo desea, pero una vez ha utilizado una de las pociones, la pierde para el resto de la partida y no podrá volver a servirse de ella.',
    equipo: 'Bando del pueblo'
  },
  {
    src: new URL('../assets/roles/cazador.jpeg', import.meta.url).href,
    nombre: 'Cazador',
    descripcion: 'Cuando muera, puede elegir a otro jugador a quien matar. La decisión es únicamente suya y no se debe tomar por consenso ni consejo.',
    equipo: 'Bando del pueblo'
  },
  {
    src: new URL('../assets/roles/hombre_lobo.jpeg', import.meta.url).href,
    nombre: 'Hombre Lobo',
    descripcion: 'Por la noche, designarán una víctima que será devorada. Debe haber unanimidad en la designación de la víctima o, en caso contrario, no habrá víctima esa noche.',
    equipo: 'Bando de los lobos'
  },
  {
    src: new URL('../assets/roles/vidente.jpeg', import.meta.url).href,
    nombre: 'Vidente',
    descripcion: 'Todas las noches elige un jugador para que el Narrador le revele la carta de personaje correspondiente. El Narrador le muestra a la Vidente, en silencio y en secreto, la carta de dicho jugador.',
    equipo: 'Bando del pueblo'
  },
  {
    src: new URL('../assets/roles/elaguacil.png', import.meta.url).href,
    nombre: 'Aguacil',
    descripcion: 'El Alguacil se elige democráticamente por el pueblo en un momento dado de la partida, a discreción del Narrador. Es un cargo o función, no un personaje. No supone ningún bando, y quien reciba el cargo de Alguacil gana la habilidad de que su voto para linchar valdrá por dos y, en caso de empate en la votación, él decidirá a qué jugador entre los empatados se lincha. Si el Alguacil muere en el transcurso de la partida, él mismo designa un sucesor para recibir el cargo de Alguacil, con su último aliento.',
    equipo: 'No supone ningún bando'
  }
]);

// Índice del slide actual
const indiceSlide = ref(0);

// Parámetros de la barra de progreso y auto-slide
const tiempoTotal = 3000;        // Duración total de cada slide (ms)
const tiempoIntervalo = 50;       // Intervalo de actualización de la barra (ms)
const incremento = 100 / (tiempoTotal / tiempoIntervalo);
const progreso = ref(0);

// Funciones para cambiar de slide
function slideAnterior() {
  indiceSlide.value = (indiceSlide.value - 1 + roles.value.length) % roles.value.length;
  progreso.value = 0;
}
function slideSiguiente() {
  indiceSlide.value = (indiceSlide.value + 1) % roles.value.length;
  progreso.value = 0;
}

onMounted(() => {
  setInterval(() => {
    progreso.value += incremento;
    if (progreso.value >= 100) {
      slideSiguiente();
    }
  }, tiempoIntervalo);
});

/* ----------------------------
   Botón "Mostrar Todos"
---------------------------- */
const mostrarPopup = ref(false);
function mostrarTodosLosRoles() {
  mostrarPopup.value = true;
}
function cerrarPopup() {
  mostrarPopup.value = false;
}

// Función para redirigir a la página de registro
function irARegistro() {
  router.push('/register')
}
</script>

<template>
  <!-- Referencia para volver al inicio -->
  <div ref="scrollInicio" id="home"></div>

  <!-- Navbar -->
  <nav class="nav">
    <a href="#como-jugar" @click.prevent="desplazarAbajo" class="hover:underline">Cómo Jugar</a>
    <a href="#roles" @click.prevent="desplazarAbajoRoles" class="hover:underline">Roles</a>
    <a href="#desarrollo" @click.prevent="desplazarAbajoDesarrollo" class="hover:underline">Desarrollo de la Partida</a>
    <a href="#descargar" @click.prevent="desplazarAbajoDescargar" class="hover:underline">Descargar</a>
    <a href="#contacto" @click.prevent="desplazarAbajoContacto" class="hover:underline">Contacto</a>
  </nav>

  <main>
    <!-- Sección principal (login + mockup) -->
    <div class="home-container">
      <div class="left-section">
        <h2 class="title">LOS HOMBRES LOBO <br> DE CASTONEGRO</h2>
        <div class="login-container">
          <div class="login-box">
            <h2 class="login-title">Inicia Sesión</h2>
            <form class="login-form">
              <label for="email">Correo electrónico</label>
              <input id="email" type="email" placeholder="Ingresa tu correo" />

              <label for="password">Contraseña</label>
              <div class="password-container">
                <input 
                  id="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="********"
                />
                <button type="button" class="toggle-password" @click="togglePasswordVisibility">
                  {{ showPassword ? '👁️' : '🙈' }}
                </button>
              </div>

              <div class="register-link">
                <span>
                  <strong>¿No tienes cuenta?</strong>
                  <a href="#" @click.prevent="irARegistro"> Regístrate</a>
                </span>
              </div>

              <button type="submit" class="login-button">ENTRAR</button>

              <div class="google-login">
                <button class="google-button">
                  <img src="../assets/google-icon.png" alt="Google Logo" />
                  Continuar con Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="right-section">
        <p class="android-text">Ya Disponible en Android</p>
        <img src="../assets/mockup.png" alt="Mockup del juego" class="mockup-image" />
        <a href="/path/to/apk" class="btn-download">Descargar el APK</a>
      </div>
    </div>

    <!-- Sección "Cómo jugar" -->
    <div ref="scrollSeccionJuego" class="game-intro" id="como-jugar">
      <h3>¿Cómo jugar a Los Hombres Lobos de Casonegro?</h3>
      <p>
        Los Hombres Lobos de Casonegro es un juego de roles ocultos y deducción social en el que los jugadores asumen diferentes papeles dentro de una aldea. El objetivo varía según el rol: los aldeanos intentan descubrir y eliminar a los hombres lobo, mientras que los hombres lobo intentan eliminar a los aldeanos sin ser descubiertos.
      </p>
    </div>

    <!-- Barra horizontal -->
    <div class="horizontal-bar"></div>

    <!-- Sección "Roles" -->
    <div ref="scrollSeccionRoles" class="roles-info" id="roles">
      <h3>Roles En El Juego</h3>
      <button class="carousel-button left" @click="slideAnterior">&#9664;</button>
      <div class="carousel-container">
        <div class="carousel-slide">
          <img :src="roles[indiceSlide].src" alt="Imagen del rol" class="role-image" />
          <p class="role-name">{{ roles[indiceSlide].nombre }}</p>
          <p class="role-team">{{ roles[indiceSlide].equipo }}</p>
        </div>
      </div>
      <button class="carousel-button right" @click="slideSiguiente">&#9654;</button>
      <div class="carousel-indicators">
        <span
          v-for="(role, index) in roles"
          :key="index"
          :class="{ 'active-indicator': index === indiceSlide }"
          @click="indiceSlide = index; progreso = 0;"
        ></span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progreso + '%' }"></div>
      </div>
      <div class="show-all-button">
        <button @click="mostrarTodosLosRoles">Mostrar más</button>
      </div>
    </div>

    <!-- Pop-up de roles -->
    <div v-if="mostrarPopup" class="popup-overlay" @click.self="cerrarPopup">
      <div class="popup-content">
        <button class="close-button" @click="cerrarPopup">✖</button>
        <h3>Lista de Roles</h3>
        <div class="roles-list">
          <div v-for="role in roles" :key="role.nombre" class="role-item">
            <img :src="role.src" alt="Imagen del rol" class="role-popup-image" />
            <div class="role-info">
              <p class="role-name-popup">{{ role.nombre }}</p>
              <p class="role-description">{{ role.descripcion }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra horizontal -->
    <div class="horizontal-bar"></div>

    <!-- Sección "Desarrollo de la partida" -->
    <div ref="scrollSeccionDesarrollo" class="game-intro" id="desarrollo">
      <h3>Desarrollo de la partida</h3>
      <p>
        <strong>Fase Nocturna</strong><br />
        Todos los jugadores cierran los ojos.<br />
        El narrador llama a los roles en orden (vidente, hombres lobo, bruja, etc.).<br />
        Los hombres lobo eligen a su víctima en secreto.<br />
        Los personajes con habilidades especiales actúan según sus poderes.
      </p>
      <p>
        <strong>Fase Diurna</strong><br />
        El narrador anuncia quién ha sido eliminado.<br />
        Se abre un debate entre los jugadores.<br />
        Se realiza una votación para linchar a un posible lobo.<br />
        El jugador con más votos es eliminado y revela su identidad.
      </p>
      <p>
        El ciclo se repite hasta que un equipo logra su objetivo.
      </p>
    </div>

    <!-- Barra horizontal -->
    <div class="horizontal-bar"></div>

    <!-- Sección "Objetivo del Juego" -->
    <div class="game-obj" id="objetivo">
      <h3>Objetivo del Juego</h3>
      <ul>
        <li><strong>Los Aldeanos</strong> ganan si eliminan a todos los hombres lobo.</li>
        <li><strong>Los Hombres Lobo</strong> ganan si igualan o superan en número a los aldeanos.</li>
      </ul>
    </div>

    <!-- Barra horizontal -->
    <div class="horizontal-bar"></div>

    <!-- Sección "¿Listo Para Empezar?" -->
    <section ref="scrollSeccionDescargar" class="ready-section" id="descargar">
      <h2>¿Listo Para Empezar?</h2>
      <p>Descarga Ya La App O Quédate En La Web</p>
      <div class="ready-buttons">
        <a href="/path/to/apk" class="btn-download">DESCARGAR</a>
        <a href="#" @click.prevent="desplazarArriba" class="btn-home">Volver al inicio</a>
      </div>
    </section>

    <!-- Footer (Pie de página) -->
    <footer ref="scrollSeccionContacto" class="footer-section" id="contacto">
      <div class="footer-content">
        <div class="footer-column">
          <h4>Contacto</h4>
          <p>Email: <strong>casonegro@gmail.com</strong></p>
          <div class="social-links">
            <a href="#"><img src="../assets/facebook-icon.jpg" alt="Facebook" /></a>
            <a href="#"><img src="../assets/instagram.webp" alt="Instagram" /></a>
            <a href="#"><img src="../assets/twitter.avif" alt="Twitter" /></a>
          </div>
        </div>
        <div class="footer-column">
          <h4>Políticas y legal</h4>
          <ul>
            <li><a href="#">Términos y Condiciones</a></li>
            <li><a href="#">Política de Privacidad</a></li>
            <li><a href="#">Aviso Legal</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Créditos</h4>
          <p>Desarrollo Web: [Tu Nombre/Estudio]</p>
          <p>Ilustraciones: [Nombre del artista]</p>
          <p>Basado en el juego original</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 Castonegro. Todos los derechos reservados</p>
      </div>
    </footer>
  </main>
</template>
