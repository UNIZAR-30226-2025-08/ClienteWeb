<script setup>
import '../assets/styles/Home.css';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { roles } from '../assets/data/roles.js';
import axios from 'axios'; // Importar axios para poder hacer la petición de login al backend

const router = useRouter();

const correo = ref('');
const contrasena = ref('');
const mensajeError = ref('');

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

// Índice del slide actual
const indiceSlide = ref(0);

// Parámetros de la barra de progreso y auto-slide
const tiempoTotal = 3000;        // Duración total de cada slide (ms)
const tiempoIntervalo = 50;       // Intervalo de actualización de la barra (ms)
const incremento = 100 / (tiempoTotal / tiempoIntervalo);
const progreso = ref(0);

// Funciones para cambiar de slide
function slideAnterior() {
  indiceSlide.value = (indiceSlide.value - 1 + roles.length) % roles.length;
  progreso.value = 0;
}
function slideSiguiente() {
  indiceSlide.value = (indiceSlide.value + 1) % roles.length;
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

// Función para manejar el login
async function loginUser() {
  mensajeError.value = '';

  if (!correo.value || !contrasena.value) {
    mensajeError.value = 'Todos los campos son obligatorios';
    return;
  }

  try {
    // Enviar los datos de login al backend con axios
    const response = await axios.post('/api/usuario/login', {
      correo: correo.value,
      contrasena: contrasena.value,
    });

    if (response.status === 200) {
      // Si el login es exitoso, redirigir al usuario
      router.push('/juego'); // !!! Cambiar la ruta si fuera necesario !!!
    } else {
      mensajeError.value = 'Correo o contraseña incorrectos';
    }
  } catch (error) {
    mensajeError.value = error.response?.data?.message || 'Error al iniciar sesión';
  }
}

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

// Función para manejar el login y redirigir al juego
function handleLogin(event) {
  event.preventDefault(); // Evita que el formulario recargue la página
  router.push('/juego'); // Redirige a la vista "Juego"
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
        <h2 class="title">LOS HOMBRES LOBO <br> DE CASTRONEGRO</h2>
        <div class="login-container">
          <div class="login-box">
            <h2 class="login-title">Inicia Sesión</h2>
            <form class="login-form" @submit.prevent="loginUser">
              <label for="correo">Correo electrónico</label>
              <input id="correo" v-model="correo" type="email" placeholder="Ingresa tu correo" required />

              <label for="contrasena">Contraseña</label>
              <div class="password-container">
                <input 
                  id="contrasena"
                  v-model="contrasena"
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="********"
                  required
                />
                <button type="button" class="toggle-password" @click="togglePasswordVisibility">
                  {{ showPassword ? '👁️' : '🙈' }}
                </button>
              </div>

              <div class="register-link">
                <span>
                  <strong>¿No tienes cuenta?</strong>
                  <a href="#" @click.prevent="irARegistro"> Regístrate ya</a>
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
      <h3>¿Cómo jugar a Los Hombres Lobos de Castonegro?</h3>
      <p>
        Los Hombres Lobos de Castonegro es un juego de roles ocultos y deducción social en el que 
        los jugadores asumen diferentes papeles dentro de una aldea.
        El objetivo varía según el bando: los aldeanos intentan descubrir y eliminar a los hombres lobo,
        mientras que los hombres lobo intentan eliminar a los aldeanos sin ser descubiertos.
      </p>
    </div>

    <!-- Barra horizontal -->
    <div class="horizontal-bar"></div>

    <!-- Sección "Roles" -->
    <div ref="scrollSeccionRoles" class="roles-info" id="roles">
      <h3>Roles y Cargos En El Juego</h3>
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
        <strong><u>Fase Nocturna</u></strong><br/>
        Todos los jugadores cierran los ojos.<br/>
        Se llama a los roles en el siguiente orden: primero la vidente, luego los hombres lobo y por último la bruja.<br/>
        La vidente elige a un jugador para conocer su rol.<br/>
        Los hombres lobo eligen a su víctima en secreto.<br/>
        La bruja puede emplear sus pociones para salvar a una víctima o eliminar a otro jugador.<br/>
      </p>
      <p>
        <br/><strong><u>Fase Diurna</u></strong><br/>
        Se anuncia qué jugador ha sido eliminado en la última noche.<br/>
        Se abre un debate entre todos los jugadores.<br/>
        Se realiza una votación para linchar a un posible hombre lobo.<br/>
        El jugador con más votos es eliminado y se revela su identidad.
      </p>
      <p>
        <br/>El ciclo se repite hasta que un bando logra su objetivo.
      </p>
    </div>

    <!-- Barra horizontal -->
    <div class="horizontal-bar"></div>

    <!-- Sección "Objetivo del Juego" -->
    <div class="game-obj" id="objetivo">
      <h3>Objetivo del Juego</h3>
      <ul>
        <li><strong><u>Los Aldeanos</u></strong> ganan si eliminan a todos los hombres lobo.</li>
        <li><strong><u>Los Hombres Lobo</u></strong> ganan si eliminan a todos los aldeanos.</li>
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
          <p>Email: <strong>castonegro@gmail.com</strong></p>
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
          <p>Equipo 08 - Roberta Williams</p>
          <p>Curso 2024/2025 - Proyecto Software</p>
          <p>Basado en el juego original</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Los Hombres Lobos de Castonegro. Todos los derechos reservados</p>
      </div>
    </footer>
  </main>
</template>
