<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { h } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Cabecera from "../components/Cabecera.vue";
import socket from "../utils/socket"; // Usa la ruta real según tu estructura
import axios from "axios";

const router = useRouter();
const loginSuccess = localStorage.getItem("loginSuccess"); // Verificar si ya hubo un login exitoso

const esAdmin = ref(false); // Variable para controlar si es administrador
// Variable para controlar el pop-up de confirmación de salida
const showExitConfirm = ref(false);

const partidas = ref([]); // Lista de partidas
const partidaSeleccionada = ref(null); // Partida seleccionada para mostrar detalles
const mostrarDetalles = ref(false); // Controla la visibilidad del modal de detalles

// Variables para la paginación
const paginaActual = ref(1);
const partidasPorPagina = 6;

// Variables para estadísticas
const estadisticas = ref({
  partidasGanadas: 0,
  partidasTotales: 0,
  porcentajeVictorias: 0,
});

// Función para obtener el ID del usuario logueado desde localStorage
const getUserId = () => {
  return JSON.parse(localStorage.getItem("usuario")).id;
};

// Función para obtener el historial de partidas
const obtenerHistorialPartidas = async () => {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.id) {
      toast.error("No se encontró información del usuario.");
      return;
    }

    const response = await axios.get(`/api/juega/usuario/${usuario.id}`);
    partidas.value = response.data.map((partida) => {
      let resultado;
      if (partida.ganadores === "empate") {
        resultado = "Empate";
      } else if (
        (partida.rolJugado === "lobo" && partida.ganadores === "lobos") ||
        (partida.rolJugado !== "lobo" && partida.ganadores === "aldeanos")
      ) {
        resultado = "Ganada";
      } else {
        resultado = "Perdida";
      }
      return { ...partida, resultado };
    });
  } catch (error) {
    console.error("Error al obtener el historial de partidas:", error);
    toast.error("No se pudo cargar el historial de partidas.");
  }
};

// Función para obtener estadísticas del usuario
const obtenerEstadisticas = async () => {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.id) {
      toast.error("No se encontró información del usuario.");
      return;
    }

    const response = await axios.get(`/api/estadisticas/obtener/${usuario.id}`);
    if (response.data?.stats) {
      estadisticas.value = response.data.stats;
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    toast.error("No se pudieron cargar las estadísticas.");
  }
};

// Función para seleccionar una partida y mostrar detalles
const seleccionarPartida = (partida) => {
  partidaSeleccionada.value = partida;
  mostrarDetalles.value = true;
};

// Cerrar el modal de detalles
const cerrarDetalles = () => {
  mostrarDetalles.value = false;
};

// Verificar si el usuario es administrador
const verificarAdministrador = async () => {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario?.id) {
      const response = await axios.post("/api/admin/esAdministrador", {
        idUsuario: usuario.id,
      });
      esAdmin.value = response.data.esAdministrador; // Si es administrador, lo asignamos a true
    }
  } catch (error) {
    console.error("Error al verificar administrador:", error);
  }
};

// Función para obtener las partidas de la página actual
const partidasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * partidasPorPagina;
  const fin = inicio + partidasPorPagina;
  return partidas.value.slice(inicio, fin);
});

// Función para cambiar de página
const cambiarPagina = (direccion) => {
  if (direccion === "anterior" && paginaActual.value > 1) {
    paginaActual.value--;
  } else if (
    direccion === "siguiente" &&
    paginaActual.value < Math.ceil(partidas.value.length / partidasPorPagina)
  ) {
    paginaActual.value++;
  }
};

onMounted(() => {
  if (!socket.connected) {
    socket.connect();
  }
  if (loginSuccess === "true") {
    toast.success("Conexión exitosa, bienvenido!", { autoClose: 3000 });
    localStorage.removeItem("loginSuccess");
  }
  const idUsuario = getUserId();
  socket.emit("registrarUsuario", { idUsuario });
  verificarAdministrador(); // Llamamos a la función de verificación al montar el componente

  // 1) Detectar si el usuario ya tiene una partida en curso
  socket.emit("buscarPartidaUsuario", { idUsuario });

  // 2) Manejar la respuesta
  socket.on(
    "partidaEncontrada",
    ({
      idPartida,
      idSala,
      rol,
      idUsuario,
      nombreUsuario,
      jugadores,
      lider,
    }) => {
      const handleAccept = (closeToast) => {
        // guardamos el ID de la partida y navegamos
        localStorage.setItem("partidaID", JSON.stringify(idPartida));
        localStorage.setItem(
          "salaActual",
          JSON.stringify({
            id: idSala,
            jugadores: jugadores,
            lider: lider,
          })
        );
        window.location.href = `/partida/${idSala}`;
        closeToast(); // cerramos el toast
      };
      const handleCancel = (closeToast) => {
        closeToast(); // simplemente cerramos el toast
      };
      toast(
        ({ closeToast }) =>
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "1rem" } },
            [
              h("span", "Tienes una partida en curso. ¿Retomar?"),
              h(
                "button",
                {
                  onClick: () => handleAccept(closeToast),
                  style: {
                    background: "green",
                    border: "none",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  },
                },
                "✔"
              ),
              h(
                "button",
                {
                  onClick: () => handleCancel(closeToast),
                  style: {
                    background: "red",
                    border: "none",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  },
                },
                "✖"
              ),
            ]
          ),
        {
          autoClose: false,
          closeOnClick: false,
          pauseOnHover: true,
        }
      );
    }
  );
  socket.on("partidaNoEncontrada", () => {
    // No hay nada que hacer si no está en ninguna partida
  });
  obtenerHistorialPartidas(); // Cargar el historial de partidas al montar el componente
  obtenerEstadisticas(); // Agregamos la llamada para obtener estadísticas

  // Manejo de errores
  socket.on("error", (mensaje) => {
    toast.error(mensaje);
  });
});

onUnmounted(() => {
  // Limpiar eventos al desmontar el componente
  socket.off("error");
  socket.off("salaActualizada");
  socket.off("partidaEncontrada");
  socket.off("partidaNoEncontrada");
});

// Funciones de navegación (como las que ya tenías)
function irAHome() {
  router.push("/");
}
function irACrearSala() {
  router.push("/crear-sala");
}
function irARoles() {
  router.push("/roles");
}
function irAReglas() {
  router.push("/reglas");
}
function irARanking() {
  router.push("/ranking");
}
function irASugerencias() {
  router.push("/sugerencias");
}
function irABuscarSalas() {
  router.push("/servidores");
}
function irASugerenciasAdmin() {
  router.push("/SugerenciasAdmin"); // Redirige a la página de sugerencias para administradores
}
// Funciones para el pop-up de confirmación de salida
function openExitConfirm() {
  showExitConfirm.value = true;
}
function confirmExit() {
  showExitConfirm.value = false;

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario?.id) {
    // Avisamos manualmente al backend antes de cerrar el socket
    socket.emit("desconectarUsuario", { idUsuario: usuario.id });
  }

  socket.disconnect(); // Luego sí cerramos el socket
  irAHome();
}

function cancelExit() {
  showExitConfirm.value = false;
}

// Función para unirse a una sala rápidamente
const unirseRapido = () => {
  const usuarioGuardado = localStorage.getItem("usuario");
  if (!usuarioGuardado) {
    toast.error("Debes iniciar sesión para unirte a una sala");
    return;
  }

  const userData = JSON.parse(usuarioGuardado);

  // Emitir evento para unirse a una sala rápidamente
  socket.emit("unirseRapido", {
    usuario: userData,
  });

  // Escuchar la confirmación para evitar duplicados
  const salaActualizadaHandler = (salaActualizada) => {
    localStorage.setItem("salaActual", JSON.stringify(salaActualizada));

    // 🔹 En lugar de router.push, recargamos la página completamente
    window.location.href = `/sala/${salaActualizada.id}`;

    // Limpiar el escuchador
    socket.off("salaActualizada", salaActualizadaHandler);
  };

  socket.on("salaActualizada", salaActualizadaHandler);
};
</script>

<template>
  <div class="Principalcontent">
    <div class="juego-container">
      <!-- Barra lateral -->
      <div class="sidebar">
        <button class="action-button-sidebar" @click="irARanking">
          Ranking
        </button>
        <button class="action-button-sidebar" @click="irARoles">Roles</button>
        <button class="action-button-sidebar" @click="irAReglas">Reglas</button>
        <button class="action-button-sidebar" @click="irASugerencias">
          Sugerencias
        </button>
        <!-- Mostrar solo si es administrador -->
        <button
          v-if="esAdmin"
          class="action-button-sidebar"
          @click="irASugerenciasAdmin"
        >
          Ver Sugerencias Admin
        </button>
        <!-- En vez de ir directamente a Home, se abre el pop-up de confirmación -->
        <button class="action-button salir-button" @click="openExitConfirm">
          Salir
        </button>
      </div>

      <!-- Contenido principal -->
      <div class="main-content">
        <!-- Cabecera: Se utiliza el componente Cabecera -->
        <Cabecera :titulo="'Bienvenido'" :esAdmin="esAdmin" />

        <!-- Contenido principal: Tabla -->
        <div class="content">
          <!-- Sección de estadísticas -->
          <div class="stats-section">
            <h3>Estadísticas</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Partidas Ganadas</span>
                <span class="stat-value">{{
                  estadisticas.partidasGanadas
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Partidas Totales</span>
                <span class="stat-value">{{
                  estadisticas.partidasTotales
                }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Porcentaje de Victorias</span>
                <span class="stat-value"
                  >{{ estadisticas.porcentajeVictorias.toFixed(2) }}%</span
                >
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="actions">
            <button class="action-button" @click="irACrearSala">
              Crear Sala
            </button>
            <button class="action-button" @click="unirseRapido">
              Unirse a Sala rápidamente
            </button>
            <button class="action-button" @click="irABuscarSalas">
              Buscar Salas
            </button>
          </div>

          <div class="history">
            <table class="history-table">
              <thead>
                <tr>
                  <th colspan="3" class="main-title">Historial de Partidas</th>
                </tr>

                <tr class="dark-row">
                  <td>Fecha</td>
                  <td>Modo</td>
                  <td>Resultado</td>
                </tr>
              </thead>
            </table>
            <div class="history-table-container">
              <table class="history-table">
                <tbody>
                  <tr
                    v-for="partida in partidasPaginadas"
                    :key="partida.idPartida"
                    class="light-row"
                    @click="seleccionarPartida(partida)"
                    style="cursor: pointer"
                  >
                    <td>{{ new Date(partida.fecha).toLocaleDateString() }}</td>
                    <td>
                      {{
                        partida.tipo.charAt(0).toUpperCase() +
                        partida.tipo.slice(1)
                      }}
                    </td>
                    <td>{{ partida.resultado }}</td>
                  </tr>
                </tbody>
              </table>
              <!-- Controles de paginación -->
              <div class="pagination-controls">
                <button
                  class="pagination-button"
                  @click="cambiarPagina('anterior')"
                  :disabled="paginaActual === 1"
                >
                  ← Anterior
                </button>
                <span class="pagination-info">
                  Página {{ paginaActual }} de
                  {{ Math.ceil(partidas.length / partidasPorPagina) }}
                </span>
                <button
                  class="pagination-button"
                  @click="cambiarPagina('siguiente')"
                  :disabled="
                    paginaActual >=
                    Math.ceil(partidas.length / partidasPorPagina)
                  "
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles de la partida -->
    <div v-if="mostrarDetalles" class="exit-modal-overlay">
      <div class="exit-modal">
        <h3>Detalles de la Partida</h3>
        <p>
          <strong>Fecha completa:</strong>
          {{ new Date(partidaSeleccionada.fecha).toLocaleString() }}
        </p>

        <p>
          <strong>Modo:</strong>
          {{
            partidaSeleccionada.tipo.charAt(0).toUpperCase() +
            partidaSeleccionada.tipo.slice(1)
          }}
        </p>

        <p>
          <strong>Estado:</strong>
          {{
            partidaSeleccionada.estado === "en_curso" ? "En curso" : "Terminada"
          }}
        </p>

        <p>
          <strong>Ganadores:</strong>
          {{
            partidaSeleccionada.ganadores
              ? partidaSeleccionada.ganadores.charAt(0).toUpperCase() +
                partidaSeleccionada.ganadores.slice(1)
              : "Sin determinar"
          }}
        </p>

        <p>
          <strong>Rol Jugado:</strong>
          {{
            partidaSeleccionada.rolJugado.charAt(0).toUpperCase() +
            partidaSeleccionada.rolJugado.slice(1)
          }}
        </p>

        <button class="cancel-button" @click="cerrarDetalles">Cerrar</button>
      </div>
    </div>
  </div>

  <!-- Pop-up de confirmación de salida -->
  <div v-if="showExitConfirm" class="exit-modal-overlay">
    <div class="exit-modal">
      <p>¿Estás seguro de que deseas salir?</p>
      <div class="exit-buttons">
        <button class="confirm-button" @click="confirmExit">Sí</button>
        <button class="cancel-button" @click="cancelExit">No</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Aplica la fuente "MedievalSharp" a todo el contenido del componente */
.juego-container,
.juego-container * {
  font-family: "MedievalSharp", cursive;
}

/* Contenedor principal */
.juego-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #302e2b;
  color: #fff;
  margin: 0;
}

/* Barra lateral */
.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #1f1e1c, #2a2a27);
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 4%;
}
.action-button-sidebar:hover {
  transform: translateY(-2px);
  color: #ccc;
}
.action-button-sidebar {
  width: 100%;
  padding: 12px 16px;
  background-color: rgba(
    14,
    13,
    12,
    0.7
  ); /* Fondo semitransparente para que se note el difuminado */
  backdrop-filter: blur(6px); /* Efecto de difuminado en el fondo */
  border: none;
  color: #fff;
  text-align: center;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Contenido principal */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #302e2b;
  padding: 20px;
  position: relative;
}

/* Header: Perfil + Notificaciones */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Perfil de usuario */
.user-profile {
  display: flex;
  align-items: center;
}

/* Ícono cuadrado con esquinas redondeadas */
.user-icon {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

/* Barra de nivel y experiencia */
.level-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level {
  font-size: 0.9rem;
}

.xp-bar {
  width: 250px;
  height: 14px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 5px;
}

.xp-bar::-webkit-progress-bar {
  background-color: #333;
  border-radius: 5px;
}

.xp-bar::-webkit-progress-value {
  background-color: #999;
  border-radius: 5px;
}

/* Notificaciones */
.notifications {
  position: relative;
}

.notification-button {
  background-color: #262522;
  border: none;
  border-radius: 8px;
  padding: 10px;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-button:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}

.notification-icon {
  width: 40px;
  height: 40px;
}

.badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 3px 6px;
  font-size: 0.7rem;
}

/* Contenido principal */
.content {
  flex: 1;
}

/* --------------------- */
/* TABLA PERSONALIZADA   */
/* --------------------- */
.history-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  /*border-radius: 8px;*/
  overflow: hidden;
  color: #fff;
  margin-bottom: 20px;
  table-layout: fixed; /* Asegura que las columnas tengan un ancho consistente */
  margin: 0; /* Márgenes entre tablas */
}

/* Fila principal del thead */
.main-title {
  background-color: #262522;
  text-align: left;
  font-size: 1rem;
  padding: 12px;
  border-bottom: 1px solid #302e2b; /* línea negra */
}

/* Fila oscura (Fecha/Modo/Resultado) */
.dark-row {
  background-color: #1e1c1a;
  border-radius: 0;
  padding: 0;
  margin-left: 20px;
}

.dark-row td {
  padding-left: 10px; /* Ajusta el valor a la cantidad de espacio que necesites */
}

/* Fila clara (ejemplo --) */
.light-row {
  background-color: #262522;
}

/* Quitar la línea inferior de la última fila si lo deseas */
.history-table tbody tr:last-child {
  border-bottom: none;
  border-radius: 10px;
  box-sizing: border-box;
}

/* Titulo de la tabla */
.history-table thead th {
  position: sticky; /* Fija el encabezado */
  top: 0; /* Posición superior */
  background-color: #262522; /* Fondo del encabezado */
  z-index: 1; /* Asegura que el encabezado esté por encima del contenido */
  text-align: left;
  padding: 12px;
  height: 20px; /* Altura consistente con las filas del cuerpo */
  border-bottom: 1px solid #302e2b; /* Línea negra */
  font-size: 0.95rem;
  box-sizing: border-box;
  border-radius: 0;
}

/* Encabezado de la tabla */
.history-table thead tr {
  padding: 12px;
  border-bottom: 1px solid #302e2b; /* Línea negra */
  font-size: 0.95rem;
  height: 48px; /* Altura consistente con las filas del cuerpo */
  font-size: 0.95rem;
  box-sizing: border-box;
  border-radius: 0;
}

/* Cuerpo de la tabla */
.history-table tbody td {
  padding: 12px;
  height: 20px; /* Altura consistente con el encabezado */
  border-bottom: 1px solid #302e2b; /* Línea negra */
  font-size: 0.95rem;
}

/* ----------------------- */
/* BOTONES DE ACCIÓN ABAJO */
/* ----------------------- */
.actions {
  display: flex;
  gap: 10%;
  margin-top: 0px; /* para dejar un espacio encima de los botones */
  margin-bottom: 30px;
}

.action-button {
  background-color: #0e0d0c68; /* Fondo sólido */
  border: 2px solid rgba(255, 255, 255, 0.3); /* Borde sutil */
  padding: 14px 28px;
  font-size: 1.1rem;
  color: #fff;
  cursor: pointer;
  border-radius: 10px;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s,
    border-color 0.3s;
  white-space: nowrap;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.6);
}

.action-button:hover {
  background-color: #555;
  transform: translateY(-3px);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.6);
}

/* Botón "Salir" */
.salir-button {
  width: 100%;
  padding: 12px 16px;
  background-color: #d30000;
  color: #fff;
  font-weight: bold;
  border: 2px solid rgb(65, 0, 0);
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, border-color 0.3s;
  margin-top: auto;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.6);
}

.salir-button:hover {
  background-color: darkred;
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.6);
}

/* ------------------------- */
/* POP-UP DE CONFIRMACIÓN DE SALIDA */
/* ------------------------- */
.exit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.exit-modal {
  background-color: #1e1c1a;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
.exit-modal p {
  font-size: 1.1rem;
  margin-bottom: 20px;
}
.exit-buttons {
  display: flex;
  justify-content: space-around;
}
.confirm-button,
.cancel-button {
  background-color: #007bff;
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.confirm-button:hover {
  background-color: #0056b3;
}
.cancel-button {
  background-color: #e74c3c;
}
.cancel-button:hover {
  background-color: #c0392b;
}
.history {
  border: 1px solid #302e2b; /* Opcional: borde para delimitar el área */
  border-radius: 8px; /* Opcional: bordes redondeados */
}
.history-table-container {
  max-height: 450px; /* Altura máxima del contenido de la tabla */
  overflow-y: auto; /* Habilitar desplazamiento vertical */
  position: relative; /* Para posicionar los controles de paginación */
  padding-bottom: 50px; /* Espacio para los controles de paginación */
}
/* Estilos para el modal */
.exit-modal h3 {
  margin-bottom: 15px;
}

/* Estilos para la sección de estadísticas */
.stats-section {
  background-color: #1e1c1a;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.stats-section h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #fff;
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-item {
  background-color: #262522;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  color: #aaa;
  font-size: 0.9rem;
}

.stat-value {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
}

/* Estilos para la paginación */
.pagination-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-top: 1px solid #302e2b;
  z-index: 10;
}

.pagination-button {
  background-color: #262522;
  border: 1px solid #444;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px; /* Ancho mínimo para mantener consistencia */
}

.pagination-button:hover:not(:disabled) {
  background-color: #333;
  border-color: #666;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #fff;
  font-size: 0.9rem;
  min-width: 150px; /* Ancho mínimo para mantener consistencia */
  text-align: center;
}
</style>
