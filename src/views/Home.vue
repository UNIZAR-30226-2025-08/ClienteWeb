<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { roles } from "../assets/data/roles.js";
import axios from "axios"; // Importar axios para poder hacer la petición de login al backend
import Musica from "../components/musica/musica.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const router = useRouter();

const correo = ref("");
const contrasena = ref("");
const mensajeError = ref("");

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
  scrollSeccionJuego.value.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
function desplazarAbajoRoles() {
  scrollSeccionRoles.value.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
function desplazarAbajoDesarrollo() {
  scrollSeccionDesarrollo.value.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
function desplazarAbajoDescargar() {
  scrollSeccionDescargar.value.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
function desplazarAbajoContacto() {
  scrollSeccionDescargar.value.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
function desplazarArriba() {
  scrollInicio.value.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Función para realizar el hash SHA-256
async function generarHashSHA256(contrasena) {
  const encoder = new TextEncoder();
  const data = encoder.encode(contrasena);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// Función para manejar el login
async function loginUser() {
  mensajeError.value = ""; // Limpiar el mensaje de error anterior

  if (!correo.value || !contrasena.value) {
    mensajeError.value = "Todos los campos son obligatorios";
    toast.error(mensajeError.value); // Mostrar alerta de error
    return;
  }

  try {
    // Generar hash SHA-256 en el cliente
    const hashContrasena = await generarHashSHA256(contrasena.value);

    // Enviar los datos de login al backend con axios
    const response = await axios.post("/api/usuario/login", {
      correo: correo.value,
      contrasena: hashContrasena, // Enviar la contraseña encriptada
    });

    if (response.status === 200 && response.data.usuario) {
      //Extraemos los datos del Backend que nos pasa el usuario
      const usuario = {
        id: response.data.usuario.idUsuario,
        nombre: response.data.usuario.nombre,
        fechaCreacion: response.data.usuario.fechaCreacion,
        avatar: response.data.usuario.avatar,
        rolFavorito: response.data.usuario.rolFavorito || "Sin rol favorito", // Agregar el rol del usuario
      };
      // Guardar el objeto usuario en Local Storage
      localStorage.setItem("usuario", JSON.stringify(usuario));
      // Si el login es exitoso, almacenar el mensaje de éxito
      localStorage.setItem("loginSuccess", "true"); // Almacenar en localStorage
      router.push("/juego"); // Redirigir al juego
    } else {
      // Si la respuesta no es 200 (exitoso), mostrar error
      mensajeError.value = "Correo o contraseña incorrectos";
      toast.error(mensajeError.value, { autoClose: 3000 }); // Mostrar alerta de error
    }
  } catch (error) {
    // Si hay un error en la petición, mostrar un mensaje de error general
    mensajeError.value = error.response?.data?.error;
    toast.error(mensajeError.value, { autoClose: 3000 }); // Mostrar alerta de error
  }
}

// Índice del slide actual
const indiceSlide = ref(0);

// Parámetros de la barra de progreso y auto-slide
const tiempoTotal = 3000; // Duración total de cada slide (ms)
const tiempoIntervalo = 50; // Intervalo de actualización de la barra (ms)
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
  router.push("/register");
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
      <a
        href="#como-jugar"
        @click.prevent="desplazarAbajo"
        class="hover:underline"
        >Cómo Jugar</a
      >
      <a
        href="#roles"
        @click.prevent="desplazarAbajoRoles"
        class="hover:underline"
        >Roles</a
      >
      <a
        href="#desarrollo"
        @click.prevent="desplazarAbajoDesarrollo"
        class="hover:underline"
        >Desarrollo de la Partida</a
      >
      <a
        href="#descargar"
        @click.prevent="desplazarAbajoDescargar"
        class="hover:underline"
        >Descargar</a
      >
      <a
        href="#contacto"
        @click.prevent="desplazarAbajoContacto"
        class="hover:underline"
        >Contacto</a
      >
    </div>
  </nav>

  <main>
    <!-- Sección principal (login + mockup) -->
    <div class="home-container">
      <div class="left-section">
        <h2 class="title">
          LOS HOMBRES LOBO <br />
          DE CASTRONEGRO
        </h2>
        <div class="login-container">
          <div class="login-box">
            <h2 class="login-title">Inicia Sesión</h2>
            <form class="login-form" @submit.prevent="loginUser">
              <label for="correo">Correo electrónico</label>
              <input
                id="correo"
                v-model="correo"
                type="email"
                placeholder="Ingresa tu correo"
                required
              />

              <label for="contrasena">Contraseña</label>
              <div class="password-container">
                <input
                  id="contrasena"
                  v-model="contrasena"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="togglePasswordVisibility"
                >
                  {{ showPassword ? "👁️" : "🙈" }}
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
        <img
          src="../assets/mockup.png"
          alt="Mockup del juego"
          class="mockup-image"
        />
        <a href="/path/to/apk" class="btn-download">Descargar el APK</a>
      </div>
    </div>

    <!-- Sección "Cómo jugar" -->
    <div ref="scrollSeccionJuego" class="game-intro" id="como-jugar">
      <h3>¿Cómo jugar a Los Hombres Lobos de Castronegro?</h3>
      <p>
        Los Hombres Lobos de Castronegro es un juego de roles ocultos y
        deducción social en el que los jugadores asumen diferentes papeles
        dentro de una aldea. El objetivo varía según el bando: los aldeanos
        intentan descubrir y eliminar a los hombres lobo, mientras que los
        hombres lobo intentan eliminar a los aldeanos sin ser descubiertos.
      </p>
    </div>

    <!-- Barra horizontal -->
    <div class="horizontal-bar"></div>

    <!-- Sección "Roles" -->
    <div ref="scrollSeccionRoles" class="roles-info" id="roles">
      <h3>Roles y Cargos En El Juego</h3>

      <!-- Botón izquierdo con imagen -->
      <button class="carousel-button left" @click="slideAnterior">
        <img src="../assets/flecha-izquierda.png" alt="Flecha izquierda" />
      </button>

      <div class="carousel-container">
        <div class="carousel-slide">
          <img
            :src="roles[indiceSlide].src"
            alt="Imagen del rol"
            class="role-image"
          />
          <p class="role-name">{{ roles[indiceSlide].nombre }}</p>
          <p class="role-team">{{ roles[indiceSlide].equipo }}</p>
        </div>
      </div>

      <!-- Botón derecho con imagen -->
      <button class="carousel-button right" @click="slideSiguiente">
        <img src="../assets/flecha-correcta.png" alt="Flecha derecha" />
      </button>

      <div class="carousel-indicators">
        <span
          v-for="(role, index) in roles"
          :key="index"
          :class="{ 'active-indicator': index === indiceSlide }"
          @click="
            indiceSlide = index;
            progreso = 0;
          "
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
            <img
              :src="role.src"
              alt="Imagen del rol"
              class="role-popup-image"
            />
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
    <div ref="scrollSeccionDesarrollo" class="game-run" id="desarrollo">
      <h3>Desarrollo de la partida</h3>
      <p>
        <strong><u>Fase Nocturna</u></strong
        ><br /><br />
        Todos los jugadores cierran los ojos.<br />
        Se llama a los roles en el siguiente orden:
        <u style="color: #f1c40f"
          >la vidente, los hombres lobo y por último la bruja.</u
        ><br />
        La vidente elige a un jugador para conocer su rol.<br />
        Los hombres lobo eligen a su víctima en secreto.<br />
        La bruja puede emplear sus pociones para salvar a una víctima o eliminar
        a otro jugador.<br />
      </p>
      <p>
        <br /><strong><u>Fase Diurna</u></strong
        ><br /><br />
        Se anuncia qué jugador ha sido eliminado en la última noche.<br />
        Se abre un debate entre todos los jugadores.<br />
        Se realiza una votación para linchar a un posible hombre lobo.<br />
        El jugador con más votos es eliminado y se revela su identidad.
      </p>
      <p>
        <br /><strong style="color: #f1c40f"
          >El ciclo se repite hasta que un bando logra su objetivo.</strong
        >
      </p>
    </div>

    <!-- Barra horizontal -->
    <div class="horizontal-bar"></div>

    <!-- Sección "Objetivo del Juego" -->
    <div class="game-obj" id="objetivo">
      <h3>Objetivo del Juego</h3>
      <ul>
        <li>
          <strong><u style="color: #f1c40f">Los Aldeanos</u></strong> ganan si
          eliminan a todos los hombres lobo.
        </li>
        <li>
          <strong><u style="color: #f1c40f">Los Hombres Lobo</u></strong> ganan
          si eliminan a todos los aldeanos.
        </li>
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
        <a href="#" @click.prevent="desplazarArriba" class="btn-home"
          >Volver al inicio</a
        >
      </div>
    </section>

    <!-- Footer (Pie de página) -->
    <footer ref="scrollSeccionContacto" class="footer-section" id="contacto">
      <div class="footer-content">
        <div class="footer-column">
          <h4>Contacto</h4>
          <p>Email: <strong>castronegro@gmail.com</strong></p>
          <div class="social-links">
            <a href="#"
              ><img src="../assets/facebook-icon.jpg" alt="Facebook"
            /></a>
            <a href="#"
              ><img src="../assets/instagram.webp" alt="Instagram"
            /></a>
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
        <p>
          © 2025 Los Hombres Lobos de Castronegro. Todos los derechos reservados
        </p>
      </div>
    </footer>
  </main>
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* Evita el scroll horizontal */
}

main {
  background-color: #1a1917;
  font-family: "MedievalSharp", cursive;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Separa logo e ítems */
  background-color: rgb(14, 13, 13);
  padding: 1rem;
  font-family: "MedievalSharp", cursive;
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
  background-image: url("../assets/HomeFoto.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-wrap: wrap; /* Permite que los elementos pasen a otra línea si es necesario */
}
/* Barra horizontal */
.horizontal-bar {
  width: 75%; /* Ocupa todo el ancho de la página */
  height: 0.1rem; /* Altura de la barra */
  background-color: white; /* Color blanco */
  margin-left: 13rem;
  border-radius: 10px; /* Redondea los extremos de la barra */
}

/* Sección izquierda (Título + Formulario) */
.left-section {
  flex: 0.8;
}

/* Sección derecha (Mockup) */
.right-section {
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column; /* Acomoda los elementos en columna */
  margin-right: 20%;
  margin-top: 2%;
}

/* Hacer que los elementos sean verticales en pantallas pequeñas */
@media (max-width: 768px) {
  .home-container {
    flex-direction: column; /* Cambia la disposición a vertical */
    align-items: center; /* Centra los elementos */
    text-align: center;
  }

  .left-section,
  .right-section {
    width: 100%; /* Ocupan todo el ancho */
    margin-right: 0;
  }
}
.title {
  font-family: "Ghost Shadow", sans-serif;
  font-size: 300%; /* Aumenté el tamaño del texto para hacerlo más impactante */
  color: #fff; /* El texto sigue siendo blanco */
  text-align: center;
  text-shadow: -4px -4px 5px rgba(0, 0, 0, 0.7),
    /* Sombras más gruesas y difusas */ 4px -4px 5px rgba(0, 0, 0, 0.7),
    -4px 4px 5px rgba(0, 0, 0, 0.7), 4px 4px 5px rgba(0, 0, 0, 0.7),
    -4px 0px 5px rgba(0, 0, 0, 0.7), 4px 0px 5px rgba(0, 0, 0, 0.7),
    0px -4px 5px rgba(0, 0, 0, 0.7), 0px 4px 5px rgba(0, 0, 0, 0.7);
  margin-top: 5%;
}

/* Texto de Android */
.android-text {
  font-size: 1.6rem;
  font-weight: bold;
  white-space: nowrap; /* Evita que se divida en varias líneas */
  color: white;
}

/* Imagen del mockup */
.right-section img {
  max-width: 100%;
  height: 65vh;
}

/* Contenedor del login */
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55vh; /* Reducimos la altura */
  max-width: 50vh; /* Limitamos el ancho para que no ocupe toda la pantalla */
  margin: 0 auto; /* Centrado automático en la página */
  background: linear-gradient(
    135deg,
    #2b2b2b,
    #1f1f1f
  ); /* Fondo oscuro con gradie nte */
  border-radius: 1rem; /* Bordes redondeados */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); /* Sombra más prominente */
  padding: 30px; /* Espaciado interno */
  border: 2px solid #00000056;
  margin-bottom: 1rem;
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

/* Nuevo título del login estilo medieval rústico */
.login-title {
  font-size: 2.5rem;
  font-weight: bold;
  font-family: "MedievalSharp", cursive;
  color: #fff;
  letter-spacing: 3px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  text-transform: uppercase;
}

/* Formulario del login */
.login-form {
  display: flex;
  flex-direction: column;
  color: #cfcfcf;
}

/* Etiquetas del fo rmulario */
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
  width: 91%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 0.2rem solid #444;
  border-radius: 0.7rem;
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
}

.register-link a {
  color: #a7a728;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.register-link a:hover {
  text-decoration: underline;
}

/* Botón de login */
.login-button {
  margin-top: 1rem;
  background-color: #500043;
  color: white;
  padding: 0.9rem;
  border: 2px solid #00000056;
  border-radius: 0.7rem;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
  font-family: "MedievalSharp", cursive;
}

.login-button:hover {
  background-color: #790063;
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
  border: 2px solid #00000056;
  border-radius: 8px;
  background: #8b2b22; /* Rojo característico de Google */
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-family: "MedievalSharp", cursive;
  color: white;
}

.google-button:hover {
  background-color: #c1351d;
}

.google-button img {
  width: 1.5rem;
  margin-right: 1rem;
}

/* Estilos para la sección de contenido sobre el juego */
.game-intro {
  padding: 3rem 1rem;
  text-align: center;
  color: white;
  margin-top: 0px;
}

.game-intro h3 {
  font-size: 3rem;
  color: #f1c40f; /* Amarillo dorado */
  margin-bottom: 2rem;
  text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7),
    /* Sombra oscura principal */ 0px 0px 10px rgba(0, 0, 0, 0.8),
    /* Efecto de brillo dorado */ 2px 2px 5px rgba(0, 0, 0, 0.5); /* Sombra adicional para más realismo */
}

.game-intro p {
  font-size: 1.5rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

/* Estilos generales */
.roles-info {
  padding: 30px 15px; /* Reducir el padding */
  text-align: center;
  color: white;
  position: relative;
  z-index: 1;
}

/* Título de la sección */
.roles-info h3 {
  font-size: 3rem;
  color: #f1c40f; /* Amarillo dorado */
  margin-bottom: 2rem;
  text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7),
    /* Sombra oscura principal */ 0px 0px 10px rgba(0, 0, 0, 0.8),
    /* Efecto de brillo dorado */ 2px 2px 5px rgba(0, 0, 0, 0.5); /* Sombra adicional para más realismo */
}

/* Carrusel */
.carousel-container {
  position: relative;
  max-width: 23rem; /* Reducir el tamaño del carrusel */
  margin: 30px auto;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1f1e1c;
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
  height: 100%; /* Hacer la imagen cuadrada */
  object-fit: cover; /* Mantener la imagen dentro del cuadrado */
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.carousel-slide img:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Nombre del rol */
.role-name {
  font-size: 1.5rem; /* Reducir tamaño */
  color: #ffffff;
  margin-top: 0px; /* Reducir margen */
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5); /* Reducir sombra */
}

/* Estilos generales del botón */
.carousel-button {
  background: transparent;
  border: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  padding: 0; /* Elimina cualquier relleno */
}

/* Tamaño y estilo de las imágenes dentro de los botones */
.carousel-button img {
  width: 8rem; /* Ajusta el tamaño según tu preferencia */
  height: auto;
  opacity: 0.9; /* Suaviza un poco la imagen */
  transition: opacity 0.3s ease, transform 0.2s ease-in-out;
}

/* Efectos al pasar el mouse */
.carousel-button:hover img {
  opacity: 0.7;
  transform: scale(1.1);
}

/* Botón izquierdo */
.carousel-button.left {
  left: 35rem; /* Ajusta la distancia desde el centro */
}

/* Botón derecho */
.carousel-button.right {
  right: 35rem; /* Ajusta la distancia desde el centro */
}

/* Indicadores del carrusel */
.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.carousel-indicators span {
  height: 1rem;
  width: 1rem;
  margin: 0 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s, transform 0.3s ease-in-out;
}

/* Indicador activo con efecto de brillo */
.carousel-indicators span.active-indicator {
  background: #f5a623;
  box-shadow: 0 0 10px rgba(255, 165, 0, 0.8);
  transform: scale(1.2);
}

/* Barra de progreso */
.progress-bar {
  height: 8px; /* Reducir el tamaño */
  background: #ddd;
  border-radius: 5px;
  margin-top: 15px;
  overflow: hidden;
  max-width: 350px; /* Reducir el tamaño */
  margin-left: auto;
  margin-right: auto;
}

.progress-fill {
  height: 100%;
  width: 0%;
  transition: width 0.05s linear;
  background: #f5a623;
}

/* Botón Mostrar Todos */
.show-all-button {
  margin-top: 25px; /* Espaciado superior aumentado para separarlo mejor */
  text-align: center; /* Centrar el botón */
}

.show-all-button button {
  padding: 12px 30px; /* Aumentar un poco el padding para hacerlo más atractivo */
  font-size: 1rem; /* Tamaño de fuente moderado */
  background-color: #f5a623;
  color: white;
  border: none;
  border-radius: 30px; /* Bordes más redondeados para un look más suave */
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s ease-in-out;
  font-weight: bold;
}

.show-all-button button:hover {
  background-color: #d68719;
  transform: translateY(-2px); /* Le da un pequeño efecto de elevación */
}

.show-all-button button:active {
  transform: translateY(0px); /* Restaurar la posición cuando se haga clic */
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
  top: 20px; /* Distancia desde la parte superior */
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

/* Estilos para la sección de contenido sobre el juego en ejecución */
.game-run {
  padding: 3rem 1rem;
  text-align: center;
  color: white;
  margin-top: 0px;
}

.game-run h3 {
  font-size: 3rem;
  color: #f1c40f; /* Amarillo dorado */
  margin-bottom: 2rem;
  text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7),
    /* Sombra oscura principal */ 0px 0px 10px rgba(0, 0, 0, 0.8),
    /* Efecto de brillo */ 2px 2px 5px rgba(0, 0, 0, 0.5); /* Sombra adicional para más realismo */
}

.game-run p {
  font-size: 1.5rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

/* Estilos para la nueva sección "game-obj" */
.game-obj {
  padding: 3rem 1rem;
  text-align: center;
  color: white;
}

.game-obj h3 {
  font-size: 3rem;
  color: #f1c40f; /* Amarillo dorado */
  margin-bottom: 2rem;
  text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7),
    /* Sombra oscura principal */ 0px 0px 10px rgba(0, 0, 0, 0.8),
    /* Efecto de brillo */ 2px 2px 5px rgba(0, 0, 0, 0.5); /* Sombra adicional para más realismo */
}

.game-obj ul {
  list-style-type: none;
  padding: 0;
}

.game-obj ul li {
  line-height: 1.6;
  color: #ffffff;
  font-size: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.game-obj ul li strong {
  font-weight: bold;
  color: #ffffff;
}

.game-obj ul li:first-child {
  margin-top: 1rem; /* Un pequeño margen arriba para el primer item */
}

.game-obj ul li:last-child {
  margin-bottom: 0; /* Elimina el margen de abajo en el último elemento */
}

/***********************************************
 * SECCIÓN "¿LISTO PARA EMPEZAR?" 
 ***********************************************/
.ready-section {
  padding: 3rem 1rem;
  text-align: center;
}

.ready-section h2 {
  font-size: 3rem;
  color: #f1c40f; /* Amarillo dorado */
  margin-bottom: 2rem;
  text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.7),
    /* Sombra oscura principal */ 0px 0px 10px rgba(0, 0, 0, 0.8),
    /* Efecto de brillo */ 2px 2px 5px rgba(0, 0, 0, 0.5); /* Sombra adicional para más realismo */
}

.ready-section p {
  font-size: 1.5rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

/* Contenedor de botones en línea */
.ready-buttons {
  display: inline-flex;
  gap: 2rem;
}

/* Botones de la sección */
.btn-download,
.btn-home {
  margin-top: 1.5rem;
  padding: 15px 30px;
  border-radius: 5px;
  border: 2px solid #00000056;
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
  background-color: rgb(14, 13, 13); /* Fondo oscuro */
  color: #fff; /* Texto blanco */
  padding: 3rem 2rem;
  text-align: left;
  margin-top: 3rem; /* Separación respecto a la sección anterior */
}

.footer-content {
  display: flex;
  flex-wrap: wrap; /* Para ajustarse en pantallas pequeñas */
  justify-content: center;
  gap: 20rem; /* Espacio entre columnas */
  margin-bottom: 1rem;
}

.footer-column {
  flex: 1;
  min-width: 10rem; /* Mínimo ancho para columnas */
  max-width: 15rem; /* Máximo ancho para columnas */
}

.footer-column h4 {
  margin-bottom: 10px;
  font-size: 1.5rem;
  text-transform: uppercase;
}

.footer-column p,
.footer-column a {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #fff; /* Asegura que el texto y los enlaces sean blancos */
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
  font-size: 1rem;
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
  background: rgb(
    37,
    37,
    37
  ); /* Hacer que el fondo de la barra sea casi invisible */
}

@font-face {
  font-family: "Ghost Shadow";
  src: url("../assets/fonts/Ghost Shadow.ttf") format("truetype");
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
