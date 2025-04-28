<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";
import Volver from "../components/Volver.vue";
import Cabecera from "../components/Cabecera.vue";
import socket from "../utils/socket";

// Importación de avatares
import avatar1 from "../assets/avatares/imagenPerfil.webp";
import avatar2 from "../assets/avatares/imagenPerfil2.webp";
import avatar3 from "../assets/avatares/imagenPerfil3.webp";
import avatar4 from "../assets/avatares/imagenPerfil4.webp";
import avatar5 from "../assets/avatares/imagenPerfil5.webp";
import avatar6 from "../assets/avatares/imagenPerfil6.webp";
import avatar7 from "../assets/avatares/imagenPerfil7.webp";
import avatar8 from "../assets/avatares/imagenPerfil8.webp";
import defaultAvatar from "../assets/profile_icon.jpg";

// Mapeo de avatares
const avatarMap = {
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
};

const route = useRoute();
const router = useRouter();

// Función para obtener el id del usuario logueado (se asume que es un número)
const getMyId = () => JSON.parse(localStorage.getItem("usuario")).id;

// Variables para almacenar la información del perfil
const nombre = ref("");
const avatar = ref("");
const rolFavorito = ref("Sin rol favorito");
const user = ref({});

// Variables para la edición del perfil (solo se usan si es el propio usuario)
const nuevoNombre = ref("");
const nuevoAvatar = ref("");
const nuevoRol = ref("");
const errorMensaje = ref("");
const modalAbierto = ref(false);

// Variables para el historial de partidas
const partidas = ref([]); // Lista de partidas
const partidaSeleccionada = ref(null); // Partida seleccionada para mostrar detalles
const mostrarDetalles = ref(false); // Controla la visibilidad del modal de detalles

// Variables para estadísticas
const estadisticas = ref({
  partidasGanadas: 0,
  partidasTotales: 0,
  porcentajeVictorias: 0,
});
const initUser = () => {
  const storedUser = localStorage.getItem("usuario");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    if (!user.value.avatar) {
      user.value.avatar = "avatar1";
    }
  } else {
    user.value = {
      nombre: "NombreCuenta",
      avatar: "avatar1",
      rolFavorito: "Sin rol favorito",
    };
  }
};

// Función para actualizar el perfil (solo para el perfil propio)
const actualizarPerfil = async () => {
  errorMensaje.value = "";
  if (
    nuevoNombre.value === nombre.value &&
    nuevoAvatar.value === avatar.value &&
    nuevoRol.value === rolFavorito.value
  ) {
    errorMensaje.value = "No se han realizado cambios";
    toast.error(errorMensaje.value);
    return;
  }

  const datosActualizados = {
    idUsuario: getMyId(),
    nombre: nuevoNombre.value,
    avatar: nuevoAvatar.value,
    rolFavorito: nuevoRol.value === "Sin rol favorito" ? null : nuevoRol.value,
  };

  try {
    const response = await axios.put(
      "/api/usuario/actualizar",
      datosActualizados
    );
    if (response.status === 200 && response.data?.usuario) {
      const newData = {
        id: getMyId(),
        nombre: nuevoNombre.value,
        avatar: nuevoAvatar.value,
        rolFavorito:
          nuevoRol.value === "Sin rol favorito" ? null : nuevoRol.value,
      };
      localStorage.setItem("usuario", JSON.stringify(newData));

      nombre.value = newData.nombre;
      avatar.value = newData.avatar;
      rolFavorito.value = newData.rolFavorito || "Sin rol favorito";

      toast.success("Perfil actualizado exitosamente", { autoClose: 3000 });
      modalAbierto.value = false;
    } else {
      errorMensaje.value = "Error al actualizar el perfil";
      toast.error(errorMensaje.value);
    }
  } catch (error) {
    errorMensaje.value =
      error.response?.data?.error || "Error al actualizar el perfil";
    toast.error(errorMensaje.value, { autoClose: 3000 });
  }
};

// Función para obtener el historial de partidas (para cualquier usuario)
const obtenerHistorialPartidas = async (userId) => {
  try {
    const response = await axios.get(`/api/juega/usuario/${userId}`);
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
const obtenerEstadisticas = async (userId) => {
  try {
    const response = await axios.get(`/api/estadisticas/obtener/${userId}`);
    if (response.data?.stats) {
      estadisticas.value = response.data.stats;
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    toast.error("No se pudieron cargar las estadísticas.");
  }
};

// Función para seleccionar y ver detalles de una partida
const seleccionarPartida = (partida) => {
  partidaSeleccionada.value = partida;
  mostrarDetalles.value = true;
};
const cerrarDetalles = () => {
  mostrarDetalles.value = false;
};

// Función para cargar el perfil, distinguiendo si es el propio o de un amigo
const cargarPerfil = async () => {
  // Convertir ambos IDs a cadena para comparar correctamente
  const myId = String(getMyId());
  const paramId = route.params.idUsuario
    ? String(route.params.idUsuario)
    : null;

  if (paramId && paramId !== myId) {
    // Se carga el perfil del amigo utilizando el endpoint POST "obtener_por_id"
    try {
      const response = await axios.post("/api/usuario/obtener_por_id", {
        idUsuario: paramId,
      });
      if (response.status === 200 && response.data.usuario) {
        const userData = response.data.usuario;
        nombre.value = userData.nombre;
        avatar.value = userData.avatar || "avatar1";
        rolFavorito.value = userData.rolFavorito || "Sin rol favorito";
      } else {
        toast.error("No se encontró el perfil del usuario.");
      }
    } catch (error) {
      console.error("Error al obtener el perfil del amigo:", error);
      toast.error("Error al cargar el perfil del usuario.");
    }
  } else {
    // Se muestra el perfil propio, usando la información de localStorage
    const myData = JSON.parse(localStorage.getItem("usuario") || "{}");
    nombre.value = myData.nombre || "";
    avatar.value = myData.avatar || "avatar1";
    rolFavorito.value = myData.rolFavorito || "Sin rol favorito";
  }

  // Inicializar los campos de edición solo si es el perfil propio
  if (!paramId || paramId === myId) {
    nuevoNombre.value = nombre.value;
    nuevoAvatar.value = avatar.value;
    nuevoRol.value = rolFavorito.value;
  }
};

// Cargar perfil y el historial al montar
onMounted(async () => {
  await cargarPerfil();
  const idParaHistorial =
    route.params.idUsuario &&
    String(route.params.idUsuario) !== String(getMyId())
      ? route.params.idUsuario
      : getMyId();
  obtenerHistorialPartidas(idParaHistorial);
  obtenerEstadisticas(idParaHistorial);
  initUser();

  // Manejo de errores
  socket.on("error", (mensaje) => {
    toast.error(mensaje);
  });
});

onUnmounted(() => {
  // Limpiar eventos al desmontar el componente
  socket.off("error");
});
</script>

<template>
  <div class="perfil-container">
    <!-- Cabecera oculta para notificaciones -->
    <div style="display: none">
      <Cabecera :titulo="'Perfil'" :esAdmin="esAdmin" />
    </div>

    <div class="perfil-page">
      <!-- Tarjeta de información del usuario -->
      <div class="user-info-card">
        <div class="avatar-section">
          <img
            :src="avatarMap[avatar] || defaultAvatar"
            alt="Avatar"
            class="avatar-image"
          />
        </div>
        <div class="user-details">
          <h2 class="user-name">{{ nombre }}</h2>
          <p class="user-role">
            Rol Favorito:
            <strong>{{ rolFavorito || "Sin rol favorito" }}</strong>
          </p>
          <!-- Sólo se muestra el botón de actualización si es el propio perfil -->
          <div
            class="user-actions"
            v-if="
              !route.params.idUsuario || route.params.idUsuario === getMyId()
            "
          >
            <button class="btn edit-btn" @click="modalAbierto = true">
              Actualizar Perfil
            </button>
            <button class="btn friends-btn" @click="$router.push('/amigos')">
              Ver mis amigos
            </button>
          </div>
        </div>
      </div>

      <!-- Sección de estadísticas -->
      <div class="stats-section">
        <h3>Estadísticas</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Partidas Ganadas</span>
            <span class="stat-value">{{ estadisticas.partidasGanadas }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Partidas Totales</span>
            <span class="stat-value">{{ estadisticas.partidasTotales }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Porcentaje de Victorias</span>
            <span class="stat-value"
              >{{ estadisticas.porcentajeVictorias.toFixed(2) }}%</span
            >
          </div>
        </div>
      </div>

      <!-- Sección de historial de partidas -->
      <div class="profile-history">
        <h2>Historial de Partidas</h2>
        <div class="history-table-wrapper">
          <table class="history-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Modo</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="partida in partidas"
                :key="partida.idPartida"
                @click="seleccionarPartida(partida)"
                style="cursor: pointer"
              >
                <td>{{ new Date(partida.fecha).toLocaleDateString() }}</td>
                <td>
                  {{
                    partida.tipo.charAt(0).toUpperCase() + partida.tipo.slice(1)
                  }}
                </td>
                <td>{{ partida.resultado }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal para ver detalles de la partida -->
      <div v-if="mostrarDetalles" class="modal-overlay details-modal">
        <div class="modal-content details-modal-content">
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
              partidaSeleccionada.estado === "en_curso"
                ? "En curso"
                : "Terminada"
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
          <button class="btn cancel-btn" @click="cerrarDetalles">Cerrar</button>
        </div>
      </div>

      <!-- Modal de edición de perfil (solo visible en el perfil propio) -->
      <div
        v-if="
          modalAbierto &&
          (!route.params.idUsuario || route.params.idUsuario === getMyId())
        "
        class="modal-overlay"
      >
        <div class="modal-content">
          <h3>Actualizar Perfil</h3>
          <form @submit.prevent="actualizarPerfil" class="update-form">
            <div class="form-group">
              <label for="nuevoNombre">Nombre de usuario:</label>
              <input
                id="nuevoNombre"
                v-model="nuevoNombre"
                type="text"
                required
              />
            </div>

            <div class="form-group avatar-selection">
              <label>Seleccionar Avatar:</label>
              <div class="avatar-grid">
                <div
                  v-for="(img, key) in avatarMap"
                  :key="key"
                  class="avatar-option"
                  :class="{ selected: nuevoAvatar === key }"
                  @click="nuevoAvatar = key"
                >
                  <img :src="img" :alt="key" class="avatar-thumbnail" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="nuevoRol">Nuevo Rol Favorito:</label>
              <select v-model="nuevoRol" id="nuevoRol" required>
                <option value="bruja">Bruja</option>
                <option value="cazador">Cazador</option>
                <option value="vidente">Vidente</option>
                <option value="lobo">Lobo</option>
                <option value="aldeano">Aldeano</option>
              </select>
            </div>

            <div class="modal-buttons">
              <button type="submit" class="btn save-btn">Guardar</button>
              <button
                type="button"
                class="btn cancel-btn"
                @click="modalAbierto = false"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <Volver />
    </div>
  </div>
</template>

<style scoped>
/* Contenedor general de la página de perfil */
.perfil-page {
  background-color: #181715;
  color: #fff;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Tarjeta de información del usuario */
.user-info-card {
  background-color: #1e1c1a;
  border-radius: 12px;
  display: flex;
  padding: 1.5rem;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.avatar-section {
  flex: 0 0 auto;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
}

.user-details {
  margin-left: 1.5rem;
  flex-grow: 1;
}

.user-name {
  font-size: 2rem;
  margin: 0;
}

.user-role {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.user-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.edit-btn {
  background-color: #007bff;
  color: #fff;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.friends-btn {
  background-color: #28a745;
  color: #fff;
}

.friends-btn:hover {
  background-color: #218838;
}

/* Sección de estadísticas */
.stats-section {
  background-color: #1e1c1a;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.stats-section h3 {
  text-align: center;
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Sección de historial de partidas */
.profile-history {
  background-color: #1e1c1a;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.profile-history h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.history-table-wrapper {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  padding: 0.75rem 1rem;
  border: 1px solid #333;
  text-align: left;
}

.history-table th {
  background-color: #333;
}

.history-table tr:nth-child(even) {
  background-color: #242424;
}

.history-table tr:hover {
  background-color: #3a3a3a;
}

/* Estilos para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #222;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  color: #fff;
}

.details-modal .details-modal-content {
  max-width: 500px;
  width: 100%;
  text-align: left;
}

.update-form .form-group {
  margin-bottom: 1rem;
}

.update-form label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.update-form input,
.update-form select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #333;
  color: #fff;
}

/* Selección de avatar en el formulario */
.avatar-selection {
  margin-bottom: 1rem;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.avatar-option {
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}

.avatar-option:hover {
  transform: scale(1.05);
}

.avatar-option.selected {
  border-color: #00ff2a;
}

.avatar-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.save-btn {
  background-color: #007bff;
  color: #fff;
  flex: 1;
  margin-right: 0.5rem;
}

.save-btn:hover {
  background-color: #0056b3;
}

.cancel-btn {
  background-color: red;
  color: #fff;
  flex: 1;
  margin-left: 0.5rem;
}

.cancel-btn:hover {
  background-color: darkred;
}
</style>
