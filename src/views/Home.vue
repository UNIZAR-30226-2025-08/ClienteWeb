<script setup>
import './Home.css';
import { ref, onMounted } from 'vue';

/* ----------------------------
   Referencias para el scroll
---------------------------- */
const scrollToTopSection = ref(null);
const scrollToGameSection = ref(null);
const scrollToRolesSection = ref(null);
const scrollToDevelopmentSection = ref(null);
const scrollToDescargarSection = ref(null);
const scrollToContactoSection = ref(null);

// Funciones de scroll suave
function scrollDown() {
  scrollToGameSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function scrollDownRoles() {
  scrollToRolesSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function scrollDownDevelopment() {
  scrollToDevelopmentSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function scrollDownDescargar() {
  scrollToDescargarSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function scrollDownContacto() {
  scrollToContactoSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function scrollToTop() {
  scrollToTopSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ----------------------------
       Carrusel de Roles
---------------------------- */
const roles = ref([
  {
    src: new URL('../assets/roles/aldeano.jpeg', import.meta.url).href,
    name: 'Aldeano',
    description: 'Descripción del Rol 1'
  },
  {
    src: new URL('../assets/roles/bruja.jpeg', import.meta.url).href,
    name: 'Bruja',
    description: 'Descripción del Rol 2'
  },
  {
    src: new URL('../assets/roles/cazador.jpeg', import.meta.url).href,
    name: 'Cazador',
    description: 'Descripción del Rol 3'
  },
  {
    src: new URL('../assets/roles/hombre_lobo.jpeg', import.meta.url).href,
    name: 'Hombre Lobo',
    description: 'Descripción del Rol 4'
  },
  {
    src: new URL('../assets/roles/vidente.jpeg', import.meta.url).href,
    name: 'Vidente',
    description: 'Descripción del Rol 5'
  }
]);

// Índice del slide actual
const currentSlide = ref(0);

// Parámetros de la barra de progreso y auto-slide
const totalTime = 3000;        // Duración total de cada slide (ms)
const intervalTime = 50;       // Intervalo de actualización de la barra (ms)
const increment = 100 / (totalTime / intervalTime);
const progress = ref(0);

// Funciones para cambiar de slide
function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + roles.value.length) % roles.value.length;
  progress.value = 0;
}
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % roles.value.length;
  progress.value = 0;
}

// Iniciar el auto-slide con barra de progreso
onMounted(() => {
  setInterval(() => {
    progress.value += increment;
    if (progress.value >= 100) {
      nextSlide();
    }
  }, intervalTime);
});

/* ----------------------------
   Botón "Mostrar Todos"
---------------------------- */
function showAllRoles() {
  // Aquí puedes implementar la lógica que prefieras,
  // por ejemplo, abrir una sección con todos los roles.
  alert('Aquí podrías mostrar una lista con todos los roles.');
}
</script>

<template>
  <!-- Referencia para volver al inicio -->
  <div ref="scrollToTopSection" id="home"></div>

  <!-- Navbar -->
  <nav class="nav">
    <a href="#como-jugar" @click.prevent="scrollDown" class="hover:underline">Cómo Jugar</a>
    <a href="#roles" @click.prevent="scrollDownRoles" class="hover:underline">Roles</a>
    <a href="#desarrollo" @click.prevent="scrollDownDevelopment" class="hover:underline">Desarrollo de la Partida</a>
    <a href="#descargar" @click.prevent="scrollDownDescargar" class="hover:underline">Descargar</a>
    <a href="#contacto" @click.prevent="scrollDownContacto" class="hover:underline">Contacto</a>
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
              <input id="password" type="password" placeholder="********" />

              <div class="register-link">
                <span><strong>¿No tienes cuenta?</strong> <a href="#">Regístrate</a></span>
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
    <div ref="scrollToGameSection" class="game-intro" id="como-jugar">
      <h3>¿Cómo jugar a Los Hombres Lobos de Casonegro?</h3>
      <p>
        Los Hombres Lobos de Casonegro es un juego de roles ocultos y deducción social en el que los jugadores asumen diferentes papeles dentro de una aldea. El objetivo varía según el rol: los aldeanos intentan descubrir y eliminar a los hombres lobo, mientras que los hombres lobo intentan eliminar a los aldeanos sin ser descubiertos.
      </p>
    </div>

    <!-- Barra horizontal -->
    <div class="horizontal-bar"></div>

    <!-- Sección "Roles" -->
    <div ref="scrollToRolesSection" class="roles-info" id="roles">
      <h3>Roles En El Juego</h3>

      <!-- Carrusel -->
      <button class="carousel-button left" @click="prevSlide">&#9664;</button>
      <div class="carousel-container">
        <div class="carousel-slide">
          <!-- Mostrar imagen del rol -->
          <img :src="roles[currentSlide].src" alt="Imagen del rol" class="role-image" />
          <p class="role-name">{{ roles[currentSlide].name }}</p>
          <p class="role-description">{{ roles[currentSlide].description }}</p>
        </div>
      </div>
      <button class="carousel-button right" @click="nextSlide">&#9654;</button>
      <!-- Indicadores y barra de progreso -->
      <div class="carousel-indicators">
        <span
          v-for="(role, index) in roles"
          :key="index"
          :class="{ 'active-indicator': index === currentSlide }"
          @click="currentSlide = index; progress = 0;"
        ></span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>

      <!-- Botón Mostrar Todos -->
      <div class="show-all-button">
        <button @click="showAllRoles">Mostrar Todos</button>
      </div>
    </div>


    <!-- Barra horizontal -->
    <div class="horizontal-bar"></div>

    <!-- Sección "Desarrollo de la partida" -->
    <div ref="scrollToDevelopmentSection" class="game-intro" id="desarrollo">
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
    <section ref="scrollToDescargarSection" class="ready-section" id="descargar">
      <h2>¿Listo Para Empezar?</h2>
      <p>Descarga Ya La App O Quédate En La Web</p>
      <div class="ready-buttons">
        <a href="/path/to/apk" class="btn-download">DESCARGAR</a>
        <a href="#" @click.prevent="scrollToTop" class="btn-home">Volver al inicio</a>
      </div>
    </section>

    <!-- Footer (Pie de página) -->
    <footer ref="scrollToContactoSection" class="footer-section" id="contacto">
      <div class="footer-content">
        <!-- Contacto -->
        <div class="footer-column">
          <h4>Contacto</h4>
          <p>Email: <strong>casonegro@gmail.com</strong></p>
          <div class="social-links">
            <a href="#"><img src="../assets/facebook-icon.png" alt="Facebook" /></a>
            <a href="#"><img src="../assets/instagram-icon.png" alt="Instagram" /></a>
            <a href="#"><img src="../assets/twitter-icon.png" alt="Twitter" /></a>
          </div>
        </div>
        <!-- Políticas y legal -->
        <div class="footer-column">
          <h4>Políticas y legal</h4>
          <ul>
            <li><a href="#">Términos y Condiciones</a></li>
            <li><a href="#">Política de Privacidad</a></li>
            <li><a href="#">Aviso Legal</a></li>
          </ul>
        </div>
        <!-- Créditos -->
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
