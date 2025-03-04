<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { roles } from '../assets/data/roles.js';
import axios from 'axios'; // Importar axios para poder hacer la petición de login al backend
import Musica from '../components/musica/musica.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
function desplazarAbajoContacto() {
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

// Función para realizar el hash SHA-256
async function generarHashSHA256(contrasena) {
  const encoder = new TextEncoder();
  const data = encoder.encode(contrasena);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Función para manejar el login
async function loginUser() {
  mensajeError.value = ''; // Limpiar el mensaje de error anterior

  if (!correo.value || !contrasena.value) {
    mensajeError.value = 'Todos los campos son obligatorios';
    toast.error(mensajeError.value); // Mostrar alerta de error
    return;
  }

  try {
    // Generar hash SHA-256 en el cliente
    const hashContrasena = await generarHashSHA256(contrasena.value);

    // Enviar los datos de login al backend con axios
    const response = await axios.post('/api/usuario/login', {
      correo: correo.value,
      contrasena: hashContrasena, // Enviar la contraseña encriptada
    });

    if (response.status === 200) {
      // Si el login es exitoso, almacenar el mensaje de éxito
      localStorage.setItem('loginSuccess', 'true');  // Almacenar en localStorage
      router.push('/juego'); // Redirigir al juego
    } else {
      // Si la respuesta no es 200 (exitoso), mostrar error
      mensajeError.value = 'Correo o contraseña incorrectos';
      toast.error(mensajeError.value, { autoClose: 3000 }); // Mostrar alerta de error
    }
  } catch (error) {
    // Si hay un error en la petición, mostrar un mensaje de error general
    mensajeError.value = error.response?.data?.message || 'Error al iniciar sesión';
    toast.error(mensajeError.value, { autoClose: 3000 }); // Mostrar alerta de error
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

</script>

<template>
  <Musica />
  <!-- Referencia para volver al inicio -->
  <div ref="scrollInicio" id="home"></div>

  <!-- Navbar -->
  <nav class="nav">
    <img src="/lobo.png" alt="Logo Lobo" class="logo" />
    <div class="nav-links">
        <a href="#como-jugar" @click.prevent="desplazarAbajo" class="hover:underline">Cómo Jugar</a>
        <a href="#roles" @click.prevent="desplazarAbajoRoles" class="hover:underline">Roles</a>
        <a href="#desarrollo" @click.prevent="desplazarAbajoDesarrollo" class="hover:underline">Desarrollo de la Partida</a>
        <a href="#descargar" @click.prevent="desplazarAbajoDescargar" class="hover:underline">Descargar</a>
        <a href="#contacto" @click.prevent="desplazarAbajoContacto" class="hover:underline">Contacto</a>
    </div>
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

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* Evita el scroll horizontal */
}

main {
  background-color: #1a1917;
}


.nav {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Separa logo e ítems */
  background-color: #1a1917;
  padding: 1rem;
}

.logo {
  width: 50px; /* Ajusta el tamaño del logo */
  height: auto;
}

.nav-links {
  display: flex;
  gap: 5rem; /* Espaciado entre los enlaces */
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 1.6rem;
}

.nav-links a:hover {
  text-decoration: underline;
}

/* Contenedor principal de Home */
.home-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background-image: url('../assets/HomeFoto.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Barra horizontal */
.horizontal-bar {
  width: 95%;             /* Ocupa todo el ancho de la página */
  height: 0.2rem;             /* Altura de la barra */
  background-color: white; /* Color blanco */
  margin: 20px 0;          /* Espaciado vertical para separar de las secciones */
  margin-left: 1.7rem;
  border-radius: 10px;     /* Redondea los extremos de la barra */
}

/* Sección izquierda (Título + Formulario) */
.left-section {
  flex: 0.6;
}

/* Sección derecha (Mockup) */
.right-section {
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column; /* Acomoda los elementos en columna */
  gap: 2  rem;
  margin-right: 20%;
  margin-top: 2%;
}

.title {
  font-family: 'Ghost Shadow', sans-serif;
  font-size: 300%; /* Aumenté el tamaño del texto para hacerlo más impactante */
  color: #fff; /* El texto sigue siendo blanco */
  text-align: center;
  text-shadow: 
    -4px -4px 5px rgba(0, 0, 0, 0.7), /* Sombras más gruesas y difusas */
     4px -4px 5px rgba(0, 0, 0, 0.7), 
    -4px  4px 5px rgba(0, 0, 0, 0.7), 
     4px  4px 5px rgba(0, 0, 0, 0.7), 
    -4px  0px 5px rgba(0, 0, 0, 0.7), 
     4px  0px 5px rgba(0, 0, 0, 0.7), 
     0px -4px 5px rgba(0, 0, 0, 0.7), 
     0px  4px 5px rgba(0, 0, 0, 0.7);   
  margin-top: 5%;
}


/* Texto de Android */
.android-text {
  font-size: 1.2rem;
  font-weight: bold;
  white-space: nowrap; /* Evita que se divida en varias líneas */
  color: white;
}

/* Imagen del mockup */
.right-section img {
  max-width: 100%;
  height: 60vh;
}

/* Contenedor del login */
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh; /* Reducimos la altura */
  max-width: 50vh; /* Limitamos el ancho para que no ocupe toda la pantalla */
  margin: 0 auto; /* Centrado automático en la página */
  background: linear-gradient(135deg, #2b2b2b, #1f1f1f); /* Fondo oscuro con gradiente */
  border-radius: 15px; /* Bordes redondeados */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); /* Sombra más prominente */
  padding: 30px; /* Espaciado interno */
  border: 2px solid #500043; /* Borde color verde */
}

/* Resto del formulario y contenido */
.login-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 100%;
  backdrop-filter: blur(5px);
}


/* Título del login */
.login-title {
  font-size: 2rem;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
  color: #fff;
  margin-bottom: 20px;
  letter-spacing: 2px;
}

/* Formulario del login */
.login-form {
  display: flex;
  flex-direction: column;
  color: #fff;
}

/* Etiquetas del formulario */
.login-form label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Campos de texto */
.login-form input {
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 2px solid #444;
  border-radius: 8px;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.login-form input:focus {
  border-color: #a7a728; /* Color verde cuando el campo está enfocado */
}

/* Enlace de registro */
.register-link {
  font-size: 1rem;
  margin-top: 10px;
}

.register-link a {
  color: #a7a728;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.register-link a:hover {
  color: #500043;
}

/* Botón de login */
.login-button {
  background-color: #500043;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
}

.login-button:hover {
  background-color: #790063;
  transform: translateY(3px);
}

.login-button:active {
  transform: translateY(1px);
}

/* Sección de login con Google */
.google-login {
  margin-top: 20px;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #db4437; /* Rojo característico de Google */
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.google-button:hover {
  background-color: #c1351d;
  transform: translateY(-3px);
}

.google-button:active {
  transform: translateY(1px);
}

.google-button img {
  width: 20px;
  margin-right: 12px;
}


/* Estilos para la sección de contenido sobre el juego */
.game-intro {
  padding: 50px 20px;
  text-align: center;
  color: white;
  margin-top: 0px;
}

.game-intro h3 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.game-intro p {
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

/* Estilos generales */
.roles-info {
  padding: 30px 15px; /* Reducir el padding */
  text-align: center;
  color: white;
  background-color: #262522;
  margin-top: -1.2rem;
  border-radius: 8px; /* Reducir los bordes */
  position: relative;
  z-index: 1;
}

/* Título de la sección */
.roles-info h3 {
  font-size: 2rem;  /* Reducir el tamaño */
  margin-bottom: 15px; /* Reducir el margen */
  font-weight: bold;
  text-transform: uppercase;
}

/* Carrusel */
.carousel-container {
  position: relative;
  max-width: 250px;  /* Reducir el tamaño del carrusel */
  margin: 30px auto;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1F1E1C;
  border-radius: 8px;
  padding: 15px; /* Reducir padding */
}

.carousel-slide {
  width: 100%;
  text-align: center;
  position: relative;
}

.carousel-slide img {
  width: 100%;
  height: 100%;  /* Hacer la imagen cuadrada */
  object-fit: cover;  /* Mantener la imagen dentro del cuadrado */
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.carousel-slide img:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Nombre del rol */
.role-name {
  font-size: 1.5rem;  /* Reducir tamaño */
  color: #ffffff;
  margin-top: 0px;  /* Reducir margen */
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5); /* Reducir sombra */
}

/* Flechas del carrusel */
.carousel-button {
  background: transparent;
  border: none;
  font-size: 4rem;
  color: #fff;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  padding: 0 15px;
  transition: color 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  pointer-events: auto; /* Permitir la interacción por defecto */
}
.carousel-button.left {
  left: 300px;
}
.carousel-button.right {
  right: 300px;
}
.carousel-button:hover {
  color: #f5a623;
  transform: translateY(-50%) scale(1.1);
}

/* Indicadores del carrusel */
.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 15px;  /* Reducir margen */
}

.carousel-indicators span {
  height: 12px; /* Reducir el tamaño */
  width: 12px;  /* Reducir el tamaño */
  margin: 0 6px;  /* Reducir el espacio */
  border-radius: 50%;
  background-color: #bbb;
  cursor: pointer;
  transition: background-color 0.3s;
}

.carousel-indicators span.active-indicator {
  background-color: #f5a623;
}

/* Barra de progreso */
.progress-bar {
  height: 8px;  /* Reducir el tamaño */
  background: #ddd;
  border-radius: 5px;
  margin-top: 15px;
  overflow: hidden;
  max-width: 350px;  /* Reducir el tamaño */
  margin-left: auto;
  margin-right: auto;
}

.progress-fill {
  height: 100%;
  background: #f5a623;
  width: 0%;
  transition: width 0.05s linear;
}

/* Botón Mostrar Todos */
.show-all-button {
  margin-top: 20px;  /* Reducir margen */
}

.show-all-button button {
  padding: 10px 25px;  /* Reducir padding */
  font-size: 0.9rem;  /* Reducir tamaño */
  background-color: #f5a623;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.show-all-button button:hover {
  background-color: #d68719;
}

/* Estilos del pop-up */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro con transparencia */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.popup-content {
  background: black; /* Fondo negro para el contenido */
  color: white; /* Texto blanco */
  padding: 20px;
  border-radius: 10px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto; /* Si el contenido del pop-up es largo, se puede desplazar dentro del pop-up */
  position: relative;
  z-index: 2001; /* Pop-up debe estar por encima de la capa de fondo */
}

/* Botón de cierre */
.close-button {
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 1.2rem;
  cursor: pointer;
  position: fixed; /* Esto hace que el botón quede fijo en la pantalla */
  top: 20px;  /* Distancia desde la parte superior */
  right: 20px; /* Distancia desde la parte derecha */
  z-index: 2100; /* Asegurarse de que esté por encima de otros elementos */
}

/* Lista de roles */
.roles-list {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espacio entre los roles */
}

/* Cada rol */
.role-item {
  display: flex;
  align-items: center;
  gap: 20px; /* Espacio entre la imagen y el texto */
  background: #333; /* Fondo oscuro para cada sección de rol */
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Sombra para separar cada rol */
  transition: background 0.3s ease; /* Efecto suave al pasar el mouse */
}

.role-item:hover {
  background: #444; /* Fondo más claro al pasar el mouse */
}

/* Imagen del rol cuadrada */
.role-popup-image {
  width: 80px;
  height: 80px;
  object-fit: cover; /* Hace que la imagen se recorte para ajustarse al cuadrado */
  border-radius: 8px; /* Bordes redondeados */
}

/* Información del rol */
.role-info {
  flex: 1;
}

.role-name-popup {
  font-size: 1.3rem;
  font-weight: bold;
  color: #f1c40f; /* Color dorado para el nombre */
  margin-top: 10px;
  text-transform: uppercase;
}

.role-description {
  font-size: 1rem;
  color: #f4f4f4;
  line-height: 1.5;
  margin-top: 5px;
}


/* Estilos para la nueva sección "game-obj" */
.game-obj {
  padding: 40px 20px;
  text-align: center;
}

.game-obj h3 {
  font-size: 2rem;
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 20px;
}

.game-obj ul {
  list-style-type: none;
  padding: 0;
}

.game-obj ul li {
  font-size: 1.2rem;
  margin-bottom: 10px;
  line-height: 1.6;
  color: #ffffff;
}

.game-obj ul li strong {
  font-weight: bold;
  color: #ffffff;
}

.game-obj ul li:first-child {
  margin-top: 20px; /* Un pequeño margen arriba para el primer item */
}

.game-obj ul li:last-child {
  margin-bottom: 0; /* Elimina el margen de abajo en el último elemento */
}

/***********************************************
 * SECCIÓN "¿LISTO PARA EMPEZAR?" 
 ***********************************************/
 .ready-section {
  background-color: #1F1E1C; /* Fondo oscuro */
  color: #fff;           /* Texto claro */
  text-align: center;
  padding: 40px 20px;
  margin-top: 40px;      /* Separación respecto a la sección anterior */
}

.ready-section h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.ready-section p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

/* Contenedor de botones en línea */
.ready-buttons {
  display: inline-flex;
  gap: 20px;
}

/* Botones de la sección */
.btn-download,
.btn-home {
  margin-top: 30px;
  padding: 15px 30px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  color: #fff; /* Texto blanco */
  transition: background-color 0.3s ease;
}

/* Botón DESCARGAR (verde) */
.btn-download {
  background-color: #28a745;
}
.btn-download:hover {
  background-color: #218838;
}

/* Botón VOLVER AL INICIO (azul) */
.btn-home {
  background-color: #007bff;
}
.btn-home:hover {
  background-color: #0069d9;
}

/***********************************************
 * FOOTER
 ***********************************************/
.footer-section {
  background-color: #1F1E1C; /* Fondo oscuro */
  color: #fff;           /* Texto blanco */
  padding: 40px 20px;
  text-align: left;
  margin-top: 40px;      /* Separación respecto a la sección anterior */
}

.footer-content {
  display: flex;
  flex-wrap: wrap;        /* Para ajustarse en pantallas pequeñas */
  justify-content: center;
  gap: 40px;              /* Espacio entre columnas */
  margin-bottom: 20px;
}

.footer-column {
  flex: 1;
  min-width: 200px;       /* Mínimo ancho para columnas */
  max-width: 300px;       /* Máximo ancho para columnas */
}

.footer-column h4 {
  margin-bottom: 10px;
  font-size: 1.2rem;
  text-transform: uppercase;
}

.footer-column p,
.footer-column a {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #fff;            /* Asegura que el texto y los enlaces sean blancos */
  text-decoration: none;
}

.footer-column a:hover {
  text-decoration: underline;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column ul li {
  margin-bottom: 5px;
}

.footer-bottom {
  border-top: 1px solid #555;
  padding-top: 20px;
  font-size: 0.9rem;
}

.social-links a img {
  width: 24px;
  margin-right: 10px;
}


/* Estilos para la scrollbar en navegadores basados en Webkit (Chrome, Edge, Safari) */
::-webkit-scrollbar {
  width: 10px; /* Ancho de la barra */
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3); /* Color oscuro translúcido */
  border-radius: 10px; /* Bordes redondeados */
  backdrop-filter: blur(5px); /* Efecto de desenfoque */
}

::-webkit-scrollbar-track {
  background: rgb(37, 37, 37); /* Hacer que el fondo de la barra sea casi invisible */
}

@font-face {
  font-family: 'Ghost Shadow';
  src: url('../assets/fonts/Ghost Shadow.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.password-container {
  position: relative;
  display: flex;
  align-items: center;
}
.toggle-password {
  position: absolute;
  right: 10px;
  top: 30%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>